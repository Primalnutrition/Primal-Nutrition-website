/**
 * Lazy-load the Razorpay Checkout JS and open the modal.
 *
 * Usage:
 *   const { paymentId, signature, orderId } = await openRazorpayCheckout({
 *     keyId, orderId, amount, currency, name, description, prefill, theme
 *   })
 *
 * Resolves on payment success, rejects on dismiss / failure.
 */
const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'
let scriptPromise = null

function loadScript() {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'))
  if (window.Razorpay) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => {
      scriptPromise = null
      reject(new Error('Failed to load Razorpay checkout script'))
    }
    document.head.appendChild(s)
  })
  return scriptPromise
}

export async function openRazorpayCheckout({
  keyId,
  orderId,
  amount,
  currency = 'INR',
  name = 'Primal Nutrition',
  description = 'T-Rex liquid + supplements',
  prefill = {},
  theme = { color: '#d6a85a' },
  onEvent = () => {},   // observability hook: ('payment_failed' | 'dismissed', detail)
}) {
  await loadScript()

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: keyId,
      order_id: orderId,
      amount,
      currency,
      name,
      description,
      prefill,
      theme,
      modal: {
        ondismiss: () => {
          // User closed the modal (e.g. to switch card → UPI). Not a failure —
          // flag it so the UI shows a calm "ready when you are" prompt, not a red error.
          onEvent('dismissed', {})
          const err = new Error('Payment cancelled')
          err.cancelled = true
          reject(err)
        },
      },
      handler: (response) => {
        resolve({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        })
      },
    })
    // A failed attempt (wrong UPI PIN, declined card) keeps the Razorpay modal
    // open for retry — it must NOT settle this promise. Rejecting here meant a
    // fail-then-succeed retry resolved into a dead promise: the customer was
    // charged while our UI showed an error and verify-payment never ran.
    rzp.on('payment.failed', (err) => {
      onEvent('payment_failed', {
        code: err?.error?.code,
        description: err?.error?.description,
        reason: err?.error?.reason,
        step: err?.error?.step,
      })
    })
    rzp.open()
  })
}
