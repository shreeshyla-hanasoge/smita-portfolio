import emailjs from '@emailjs/browser'
import { formatINR } from './commerce'
import { STUDIO } from './catalog'

/**
 * Order confirmations — one to the buyer, one to the studio.
 *
 * Until there is a server, these two emails and the notes attached to the
 * Razorpay payment are the *only* record that an order happened. The studio
 * one in particular is the packing instruction: if it does not arrive, nobody
 * knows what to put in an envelope.
 *
 * **One template, sent twice.** EmailJS's free plan allows two templates in
 * total and the contact form already uses one. Since the bodies are composed
 * here anyway, the template does not need to know anything about orders — it
 * is a generic envelope of {{subject}} and {{content}} addressed to
 * {{to_email}}, which leaves the free plan with room to spare and keeps all
 * the wording in the repository where it can be reviewed.
 *
 * Rules this module holds to:
 *
 *   - Sending never blocks the buyer. They have paid; they see their
 *     confirmation whether or not the mail provider is having a bad day.
 *   - A failure is reported, not swallowed — console and GA4 — because an
 *     order that silently fails to reach the studio is the worst outcome here.
 *   - Once per order id. A reload must not re-send.
 */

const SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const TEMPLATE = import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID

export const ORDER_EMAIL_CONFIGURED = Boolean(SERVICE && PUBLIC_KEY && TEMPLATE)

/** Strict SMTP servers reject bare carriage returns — the contact form hit
 *  this already, so everything multi-line we build gets normalised. */
const clean = (text) => String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n')

const lines = (summary) =>
  summary.items.map((i) => `  ${i.name}${i.quantity > 1 ? ` × ${i.quantity}` : ''}`).join('\n')

const address = (buyer) =>
  [
    buyer.name,
    buyer.address1,
    buyer.address2,
    `${buyer.city}, ${buyer.state} ${buyer.pincode}`,
    buyer.phone,
  ]
    .filter(Boolean)
    .map((l) => `  ${l}`)
    .join('\n')

/** Padded so the figures line up in a monospaced mail body — a receipt whose
 *  numbers wander looks like a mistake. */
const row = (label, value) => `  ${label.padEnd(14)}${value}`

const money = (summary) =>
  [
    row(`Cards (${summary.count})`, formatINR(summary.subtotal)),
    row('Shipping', summary.shipping === 0 ? 'Free' : formatINR(summary.shipping)),
    row('Total', formatINR(summary.total)),
  ].join('\n')

/** A machine-readable copy, for the packing-slip tool and as a record if the
 *  formatted body is ever mangled in transit. */
const orderJson = ({ orderId, paymentId, summary, buyer, dispatch }) =>
  JSON.stringify(
    {
      orderId,
      paymentId,
      dispatch,
      cards: summary.items.map((i) => ({ slug: i.slug, name: i.name, qty: i.quantity })),
      count: summary.count,
      subtotal: summary.subtotal,
      shipping: summary.shipping,
      total: summary.total,
      buyer,
    },
    null,
    1
  )

const buyerBody = ({ orderId, summary, buyer, dispatch }) =>
  clean(`Hello ${buyer.name.split(' ')[0]},

Your order is confirmed. Thank you — it means a great deal.

ORDER ${orderId}

${lines(summary)}

${money(summary)}

WHAT HAPPENS NEXT

Cards are packed and posted in one batch each month. Yours goes out on
${dispatch}, and a tracking number will reach you by email when it does.

If anything is wrong with this order, reply to this email with your order
number and we will sort it out.

${STUDIO.name}
${STUDIO.tagline}
${STUDIO.site}`)

const studioBody = ({ orderId, paymentId, summary, buyer, dispatch }) =>
  clean(`NEW ORDER — ${orderId}
${summary.count} ${summary.count === 1 ? 'card' : 'cards'} · ${formatINR(summary.total)} · dispatch ${dispatch}

PACK

${lines(summary)}

SHIP TO

${address(buyer)}

BUYER

  ${buyer.email}

PAYMENT

${money(summary)}
  Razorpay ${paymentId || '(id not returned)'}

--- order data ---
${orderJson({ orderId, paymentId, summary, buyer, dispatch })}`)

const report = (which, error) => {
  console.error(`Order email (${which}) failed to send`, error)
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'order_email_failed', { which, message: String(error?.text || error) })
  }
}

const send = (which, params) =>
  emailjs
    .send(SERVICE, TEMPLATE, params, PUBLIC_KEY)
    .then(() => true)
    .catch((e) => {
      report(which, e)
      return false
    })

/**
 * Fire both confirmations. Resolves to a small report rather than throwing —
 * the caller is on the happy path of a completed payment and must not be
 * derailed by a mail failure.
 */
export const sendOrderEmails = async (order) => {
  if (!ORDER_EMAIL_CONFIGURED) {
    console.warn(
      'Order emails are not configured — set VITE_EMAILJS_SERVICE_ID, ' +
        'VITE_EMAILJS_PUBLIC_KEY and VITE_EMAILJS_ORDER_TEMPLATE_ID. The order is ' +
        'still recorded in the notes on the payment in the Razorpay dashboard.'
    )
    return { sent: false, reason: 'not_configured' }
  }

  const { orderId, summary, buyer } = order

  // One send per order, however many times this page is reloaded.
  const guard = `sm.emailed.${orderId}`
  try {
    if (window.sessionStorage.getItem(guard)) return { sent: false, reason: 'already_sent' }
    window.sessionStorage.setItem(guard, '1')
  } catch {
    // Private mode — carry on and accept the small risk of a duplicate.
  }

  const [buyerOk, studioOk] = await Promise.all([
    send('buyer', {
      to_email: buyer.email,
      to_name: buyer.name,
      reply_to: STUDIO.email,
      subject: `Your Studio Mintleaf order ${orderId}`,
      content: buyerBody(order),
      order_id: orderId,
    }),
    send('studio', {
      to_email: STUDIO.email,
      to_name: STUDIO.name,
      reply_to: buyer.email, // replying goes straight back to the buyer
      subject: `New order ${orderId} — ${summary.count} cards, ${formatINR(summary.total)}`,
      content: studioBody(order),
      order_id: orderId,
    }),
  ])

  return { sent: buyerOk || studioOk, buyerOk, studioOk }
}
