import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAction } from '../../../hooks'
import { requestContractOtp, signContract } from '../../../services'
import { CONTRACT_TYPES } from '../../../lib/constants'
import { formatDateTime } from '../../../lib/format'
import { Alert, Badge, Button, Checkbox, Input } from '../../ui'

const EXPIRED_CODE = 'Request a new verification code'

function SignatureStatus({ label, signedAt }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-fg-muted">{label}</span>
      {signedAt ? (
        <Badge tone="success">Firmado · {formatDateTime(signedAt)}</Badge>
      ) : (
        <Badge tone="warning">Pendiente</Badge>
      )}
    </div>
  )
}

/**
 * Un contrato con su estado de firmas y el flujo de firma con código por email.
 * role: 'guest' | 'owner'
 */
function ContractCard({ contract, role, onChange }) {
  const mySignedAt = role === 'guest' ? contract.guest_signed_at : contract.owner_signed_at
  const [codeSent, setCodeSent] = useState(false)
  const [signError, setSignError] = useState(null)
  const sendCode = useAction(() => requestContractOtp(contract.id))
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { otp: '', accepted: false } })

  const handleSendCode = async () => {
    const { ok } = await sendCode.run()
    if (ok) {
      setCodeSent(true)
      setSignError(null)
      reset()
    }
  }

  const onSubmit = async ({ otp }) => {
    setSignError(null)
    try {
      await signContract(contract.id, otp)
      onChange?.()
    } catch (error) {
      setSignError(error)
    }
  }

  const codeExpired = signError?.message?.includes(EXPIRED_CODE)

  return (
    <div className="flex flex-col gap-4 rounded-input bg-surface-muted p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base">{CONTRACT_TYPES[contract.contract_type]}</h3>
        {contract.document_url && (
          <Button size="sm" variant="secondary" href={contract.document_url} target="_blank" rel="noreferrer">
            Descargar PDF
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <SignatureStatus label="Arrendatario" signedAt={contract.guest_signed_at} />
        <SignatureStatus label="Propietario" signedAt={contract.owner_signed_at} />
      </div>

      {mySignedAt && !contract.document_url && (
        <Alert tone="info">Ya has firmado. Esperando la firma de la otra parte.</Alert>
      )}

      {!mySignedAt && !codeSent && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-fg-muted">Para firmar te enviaremos un código de 6 dígitos por email (caduca en 10 minutos).</p>
          <div>
            <Button onClick={handleSendCode} loading={sendCode.loading}>
              Enviar código para firmar
            </Button>
          </div>
          <Alert error={sendCode.error} />
        </div>
      )}

      {!mySignedAt && codeSent && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
          <Alert tone="success">Te hemos enviado el código por email.</Alert>
          <Input
            label="Código de verificación"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            error={errors.otp?.message}
            {...register('otp', {
              required: 'Introduce el código',
              pattern: { value: /^\d{6}$/, message: 'Son 6 dígitos' },
            })}
          />
          <Checkbox
            label="He leído y acepto las condiciones del contrato"
            error={errors.accepted?.message}
            {...register('accepted', { required: 'Debes aceptar el contrato para firmarlo' })}
          />
          {signError && (
            <Alert
              error={codeExpired ? { message: 'El código ha caducado o no es válido.' } : signError}
              action={
                codeExpired && (
                  <Button size="sm" variant="secondary" onClick={handleSendCode} loading={sendCode.loading}>
                    Reenviar código
                  </Button>
                )
              }
            />
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" loading={isSubmitting}>
              Firmar contrato
            </Button>
            {!codeExpired && (
              <Button variant="ghost" onClick={handleSendCode} loading={sendCode.loading}>
                Reenviar código
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}

export default ContractCard
