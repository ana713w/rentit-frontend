import { loadStripe } from '@stripe/stripe-js'

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

// null si falta la clave
export const stripePromise = publishableKey ? loadStripe(publishableKey) : null

export function getCardElementStyle() {
  const css = getComputedStyle(document.documentElement)
  const token = (name) => css.getPropertyValue(name).trim()

  return {
    base: {
      color: token('--color-fg'),
      fontFamily: token('--font-sans'),
      fontSize: '16px',
      '::placeholder': { color: token('--color-fg-subtle') },
    },
    invalid: { color: token('--color-danger') },
  }
}
