import { getPayment, listContracts, listVerifications } from '../services'
import { addDays, formatDate, toISODate } from './format'

// Orden del alquiler (igual que el backend):
// aceptada -> pago + contrato de entrega (desde el dia antes) -> check-in
// -> acta de devolucion -> check-out -> fianza
// El pago se abre el dia antes para que la fianza retenida cubra todo el alquiler
export const DAYS_BEFORE_PICKUP = 1

const FINAL_DEPOSIT_STATUSES = ['released', 'captured', 'canceled']
const HELD_DEPOSIT_STATUSES = ['authorized', ...FINAL_DEPOSIT_STATUSES]

const isFullySigned = (contract) => Boolean(contract?.guest_signed_at && contract?.owner_signed_at)

// 404 en el pago no es un error
export const fetchProgress = async (reservationId) => {
  const [contracts, payment, verifications] = await Promise.all([
    listContracts(reservationId).catch(() => []),
    getPayment(reservationId).catch(() => null),
    listVerifications(reservationId).catch(() => []),
  ])
  return { contracts, payment, verifications }
}

export function getFlow(reservation, progress) {
  const { contracts = [], payment = null, verifications = [] } = progress || {}
  const rental = contracts.find((contract) => contract.contract_type === 'rental')
  const returnAct = contracts.find((contract) => contract.contract_type === 'return')
  const has = (type) => verifications.some((verification) => verification.verification_type === type)
  const opensOn = addDays(reservation.start_date, -DAYS_BEFORE_PICKUP)

  return {
    loaded: Boolean(progress),
    accepted: ['confirmed', 'completed'].includes(reservation.status),
    opensOn,
    preparationOpen: toISODate(new Date()) >= opensOn,
    payment,
    paid: payment?.rent_status === 'succeeded' && HELD_DEPOSIT_STATUSES.includes(payment?.deposit_status),
    rental,
    rentalSigned: isFullySigned(rental),
    returnAct,
    returnSigned: isFullySigned(returnAct),
    checkIn: has('check_in'),
    checkOut: has('check_out'),
    depositSettled: FINAL_DEPOSIT_STATUSES.includes(payment?.deposit_status),
  }
}

export function buildSteps(reservation, flow) {
  return [
    { label: 'Solicitada', icon: 'send', done: true },
    { label: 'Aceptada', icon: 'thumb_up', done: flow.accepted },
    { label: 'Pago', icon: 'payments', done: flow.paid },
    { label: 'Contrato de entrega', icon: 'contract_edit', done: flow.rentalSigned },
    { label: 'Check-in', icon: 'login', done: flow.checkIn },
    { label: 'Acta de devolución', icon: 'assignment_return', done: flow.returnSigned },
    { label: 'Check-out', icon: 'logout', done: flow.checkOut },
    { label: 'Fianza', icon: 'verified', done: reservation.status === 'completed' && flow.depositSettled },
  ]
}

// Firma pendiente de un contrato segun quien mira
function signatureStep(contract, role, name) {
  if (!contract) return `Generad el ${name} en «Contratos» y firmadlo los dos con el código que os llega por email.`
  if (contract[`${role}_signed_at`]) return `Ya has firmado el ${name}. Falta la firma de la otra parte.`
  return `Firma el ${name} en «Contratos» con el código que te llega por email.`
}

// Que toca hacer ahora y quien lo hace
export function getNextStep(reservation, flow, role) {
  const isGuest = role === 'guest'

  if (reservation.status === 'pending') {
    return isGuest
      ? { title: 'Esperando al propietario', text: 'Tu solicitud está pendiente de que el propietario la acepte.' }
      : { title: 'Solicitud nueva', text: 'Acepta o rechaza la solicitud.' }
  }
  if (!flow.accepted || !flow.loaded) return null

  if (!flow.checkIn && !flow.preparationOpen) {
    return {
      title: 'Reserva aceptada',
      text: `El pago y el contrato de entrega se habilitan el ${formatDate(flow.opensOn)}, el día antes de la recogida. Así la fianza queda retenida durante todo el alquiler.`,
    }
  }
  if (!flow.paid) {
    return isGuest
      ? { title: 'Paso 1 · Pago', text: 'Paga el alquiler. La fianza solo se retiene en tu tarjeta y se libera tras la devolución.' }
      : { title: 'Paso 1 · Pago', text: 'Esperando a que quien alquila pague el alquiler y la fianza.' }
  }
  if (!flow.rentalSigned) {
    return { title: 'Paso 2 · Contrato de entrega', text: signatureStep(flow.rental, role, 'contrato de entrega') }
  }
  if (!flow.checkIn) {
    return {
      title: 'Paso 3 · Check-in',
      text: 'Al entregar el objeto, iniciad el check-in y subid fotos de su estado. Desde el check-in se pueden abrir disputas.',
    }
  }
  if (!flow.returnSigned) {
    return { title: 'Paso 4 · Acta de devolución', text: signatureStep(flow.returnAct, role, 'acta de devolución') }
  }
  if (!flow.checkOut) {
    return {
      title: 'Paso 5 · Check-out',
      text: 'Al devolver el objeto, iniciad el check-out y subid fotos de cómo se devuelve. El alquiler pasa a completado.',
    }
  }
  if (!flow.depositSettled) {
    return isGuest
      ? { title: 'Paso 6 · Fianza', text: 'El propietario debe liberar la fianza. Si no estás de acuerdo con lo que decida, abre una disputa.' }
      : { title: 'Paso 6 · Fianza', text: 'Libera la fianza o cobra una parte si el objeto se ha devuelto dañado.' }
  }
  return { title: 'Alquiler finalizado', text: 'Todo está cerrado. Si algo no fue bien, todavía puedes abrir una disputa.', tone: 'success' }
}
