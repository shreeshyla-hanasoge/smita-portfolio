/**
 * Razorpay Checkout — SDK loading and the payment handoff.
 *
 * Phase 1 of the plan in docs/store/E9.1-commerce-architecture.md: no server,
 * so Checkout runs in amount-only mode without a server-created `order_id`.
 * That means **there is no signature to verify**, and the studio must match
 * every payment in the Razorpay dashboard against its order before packing
 * anything. The amount here comes from the browser and a determined buyer can
 * edit it; at this order size reconciliation is the control.
 *
 * The modal flow is used, not the redirect flow, and that is not a style
 * preference. A redirect leaves and re-enters the SPA, which destroys the
 * router state the success page reads its order from — the buyer would pay and
 * then land back on an empty shop. The modal keeps the page alive throughout.
 */

const SDK_URL = 'https://checkout.razorpay.com/v1/checkout.js'

let pending = null

/** Loads the SDK once, on demand — not in index.html, where it would cost
 *  every visitor a third-party script to look at a painting. */
export const loadRazorpay = () => {
  if (typeof window === 'undefined') return Promise.reject(new Error('razorpay_no_window'))
  if (window.Razorpay) return Promise.resolve(window.Razorpay)
  if (pending) return pending

  pending = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SDK_URL
    script.async = true
    script.onload = () =>
      window.Razorpay
        ? resolve(window.Razorpay)
        : reject(new Error('razorpay_sdk_unavailable'))
    script.onerror = () => {
      pending = null // let a later attempt retry rather than caching the failure
      reject(new Error('razorpay_sdk_blocked'))
    }
    document.body.appendChild(script)
  })

  return pending
}

/** Razorpay caps each note value at 256 characters and rejects the lot if one
 *  overflows, which would fail the payment over a long address. */
const note = (value) => String(value ?? '').slice(0, 250)

/**
 * Everything the studio needs to fulfil the order, carried on the payment.
 *
 * Until the confirmation emails exist (E9.5), **these notes are the only
 * record of who bought what and where it goes** — they are visible on the
 * payment in the Razorpay dashboard. Do not trim them to look tidy.
 */
export const buildNotes = ({ orderId, summary, buyer, dispatchLabel }) => ({
  order_id: note(orderId),
  cards: note(summary.items.map((i) => `${i.slug}x${i.quantity}`).join(', ')),
  card_count: note(summary.count),
  shipping: note(summary.shipping),
  dispatch: note(dispatchLabel),
  ship_to: note(
    [buyer.name, buyer.address1, buyer.address2, buyer.city, buyer.state]
      .filter(Boolean)
      .join(', ')
  ),
  pincode: note(buyer.pincode),
  phone: note(buyer.phone),
  email: note(buyer.email),
})

/**
 * Opens Checkout and settles when the buyer does.
 *
 * Resolves  → { paymentId } on success
 * Rejects   → Error('payment_cancelled') if they close the modal themselves,
 *             which is a change of mind and not a failure worth an error page
 *           → Error(<reason>) for a genuine decline
 */
export const openCheckout = async ({ keyId, orderId, summary, buyer, dispatchLabel, amountPaise }) => {
  const Razorpay = await loadRazorpay()

  return new Promise((resolve, reject) => {
    // Razorpay can fire both a failure and a dismiss for one attempt; whichever
    // lands first wins, so the caller is never settled twice.
    let settled = false
    const finish = (fn, arg) => {
      if (settled) return
      settled = true
      fn(arg)
    }

    const rzp = new Razorpay({
      key: keyId,
      amount: amountPaise,
      currency: 'INR',
      name: 'Studio Mintleaf',
      description: `${summary.count} art ${summary.count === 1 ? 'card' : 'cards'}`,
      image: '/images/newsletter/newsletter-monogram.svg',
      prefill: {
        name: buyer.name,
        email: buyer.email,
        contact: buyer.phone,
      },
      notes: buildNotes({ orderId, summary, buyer, dispatchLabel }),
      theme: { color: '#4F7A3E' },
      retry: { enabled: false }, // the failure page offers the retry, in our words
      handler: (response) =>
        finish(resolve, { paymentId: response?.razorpay_payment_id, orderId }),
      modal: {
        ondismiss: () => finish(reject, new Error('payment_cancelled')),
      },
    })

    rzp.on('payment.failed', (response) =>
      finish(reject, new Error(response?.error?.description || 'payment_failed'))
    )

    rzp.open()
  })
}
