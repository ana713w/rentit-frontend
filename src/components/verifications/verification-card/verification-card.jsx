import { useState } from 'react'
import { useAction, useFetch } from '../../../hooks'
import { deleteVerificationPhoto, listVerificationPhotos, updateVerificationNotes, uploadVerificationPhotos } from '../../../services'
import { VERIFICATION_TYPES } from '../../../lib/constants'
import { formatDateTime } from '../../../lib/format'
import { Alert, AsyncContent, Button, ConfirmButton, FileUploader, PhotoGrid, Textarea } from '../../ui'

const NOTES_MAX = 2000

function PhotoGroup({ title, photos, emptyText, renderActions }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm">
        {title} <span className="font-normal text-fg-muted">({photos.length})</span>
      </h4>
      {photos.length ? (
        <PhotoGrid photos={photos} renderActions={renderActions} />
      ) : (
        <p className="text-sm text-fg-muted">{emptyText}</p>
      )}
    </div>
  )
}

// Verificacion compartida: notas y fotos de cada parte
function VerificationCard({ verification, userId }) {
  const [notes, setNotes] = useState(verification.notes || '')
  const [savedNotes, setSavedNotes] = useState(verification.notes || '')
  const [justSaved, setJustSaved] = useState(false)
  const saveNotes = useAction(() => updateVerificationNotes(verification.id, notes))
  const photos = useFetch(() => listVerificationPhotos(verification.id), [verification.id])

  const handleSaveNotes = async () => {
    const { ok, data } = await saveNotes.run()
    if (ok) {
      setSavedNotes(data?.notes ?? notes)
      setJustSaved(true)
    }
  }

  const mine = (photos.data || []).filter((photo) => photo.uploaded_by === userId)
  const others = (photos.data || []).filter((photo) => photo.uploaded_by !== userId)

  return (
    <div className="flex flex-col gap-5 rounded-input bg-surface-muted p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base">{VERIFICATION_TYPES[verification.verification_type]}</h3>
        <span className="text-xs text-fg-muted">Creado el {formatDateTime(verification.created_at)}</span>
      </div>

      <div className="flex flex-col gap-2">
        <Textarea
          label="Notas"
          rows={3}
          maxLength={NOTES_MAX}
          value={notes}
          onChange={(event) => {
            setNotes(event.target.value)
            setJustSaved(false)
          }}
          hint={`${notes.length}/${NOTES_MAX} · Estado del objeto, accesorios incluidos, desperfectos...`}
        />
        <div className="flex items-center gap-3">
          <Button size="sm" variant="secondary" onClick={handleSaveNotes} loading={saveNotes.loading} disabled={notes === savedNotes}>
            Guardar notas
          </Button>
          {justSaved && <span className="text-xs text-success">Guardado</span>}
        </div>
        <Alert error={saveNotes.error} />
      </div>

      <FileUploader
        label="Añadir fotos"
        onUpload={(files) => uploadVerificationPhotos(verification.id, files)}
        onUploaded={photos.reload}
      />

      <AsyncContent loading={photos.loading} error={photos.error} data={photos.data} onRetry={photos.reload}>
        {() => (
          <div className="flex flex-col gap-5">
            <PhotoGroup
              title="Mis fotos"
              photos={mine}
              emptyText="Todavía no has subido fotos."
              renderActions={(photo) => (
                <ConfirmButton
                  size="sm"
                  variant="danger-outline"
                  title="¿Borrar esta foto?"
                  confirmLabel="Borrar"
                  onConfirm={async () => {
                    await deleteVerificationPhoto(verification.id, photo.id)
                    photos.reload()
                  }}
                >
                  Borrar
                </ConfirmButton>
              )}
            />
            <PhotoGroup title="Fotos de la otra parte" photos={others} emptyText="La otra parte aún no ha subido fotos." />
          </div>
        )}
      </AsyncContent>
    </div>
  )
}

export default VerificationCard
