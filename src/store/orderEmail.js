import emailjs from '@emailjs/browser'
import { formatINR } from './commerce'

/**
 * Order confirmations — one to the buyer, one to the studio.
 *
 * Until there is a server, these two emails and the notes attached to the
 * Razorpay payment are the *only* record that an order happened. The studio
 * one in particular is the packing instruction: if it does not arrive, nobody
 * knows what to put in an envelope.
 *
 * So the rules here are:
 *
 *   - Sending never blocks the buyer. They have paid; they see their
 *     confirmation whether or not our mail provider is having a bad day.
 *   - A failure is reported, not swallowed. It goes to the console and to GA4,
 *     because an order that silently fails to reach the studio is the worst
 *     outcome this shop has.
 *   - Once per order id. A reload or a back-button must not re-send.
 *
 * The message bodies are composed here rather than in the EmailJS templates,
 * so the templates stay a handful of {{placeholders}} and the wording lives in
 * the repository where it can be reviewed and changed.
 */

const SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const BUYER_TEMPLATE = import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID
const STUDIO_TEMPLATE = import.meta.env.VITE_EMAILJS_STUDIO_TEMPLATE_ID

export const ORDER_EMAIL_CONFIGURED = Boolean(SERVICE && PUBLIC_KEY && BUYER_TEMPLATE && STUDIO_TEMPLATE)

/** Strict SMTP servers reject bare carriage returns — the contact form hit
 *  this already, so every multi-line block we build gets normalised. */
const clean = (text) => String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n')

/** "Malabar Gliding Frog × 2" per line, one card per row. */
const orderLines = (summary) =>
  clean(
    summary.items
      .map((i) => `${i.name}${i.quantity > 1 ? ` × ${i.quantity}` : ''}`)
      .join('\n')
  )

const shipTo = (buyer) =>
  clean(
    [
      buyer.name,
      buyer.address1,
      buyer.address2,
      `${buyer.city}, ${buyer.state} ${buyer.pincode}`,
      buyer.phone,
    ]
      .filter(Boolean)
      .join('\n')
  )

/**
 * A machine-readable copy of the order, for the packing-slip tool and as a
 * belt-and-braces record if the formatted body is ever mangled in transit.
 */
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

const report = (which, error) => {
  console.error(`Order email (${which}) failed to send`, error)
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'order_email_failed', { which, message: String(error?.text || error) })
  }
}

/**
 * Fire both confirmations. Resolves to a small report rather than throwing —
 * the caller is on the happy path of a completed payment and must not be
 * derailed by a mail failure.
 */
export const sendOrderEmails = async ({ orderId, paymentId, summary, buyer, dispatch }) => {
  if (!ORDER_EMAIL_CONFIGURED) {
    console.warn(
      'Order emails are not configured — set VITE_EMAILJS_ORDER_TEMPLATE_ID and ' +
        'VITE_EMAILJS_STUDIO_TEMPLATE_ID. The order is still recorded in the ' +
        'notes on the payment in the Razorpay dashboard.'
    )
    return { sent: false, reason: 'not_configured' }
  }

  // One send per order, however many times this page is reloaded.
  const guard = `sm.emailed.${orderId}`
  try {
    if (window.sessionStorage.getItem(guard)) return { sent: false, reason: 'already_sent' }
    window.sessionStorage.setItem(guard, '1')
  } catch {
    // Private mode — carry on and accept the small risk of a duplicate.
  }

  const shared = {
    order_id: orderId,
    payment_id: paymentId || '',
    order_lines: orderLines(summary),
    card_count: String(summary.count),
    subtotal: formatINR(summary.subtotal),
    shipping: summary.shipping === 0 ? 'Free' : formatINR(summary.shipping),
    total: formatINR(summary.total),
    dispatch_date: dispatch,
  }

  const buyerSend = emailjs
    .send(
      SERVICE,
      BUYER_TEMPLATE,
      {
        ...shared,
        to_name: buyer.name,
        to_email: buyer.email,
        studio_email: 'smita@studiomintleaf.in',
      },
      PUBLIC_KEY
    )
    .then(() => true)
    .catch((e) => {
      report('buyer', e)
      return false
    })

  const studioSend = emailjs
    .send(
      SERVICE,
      STUDIO_TEMPLATE,
      {
        ...shared,
        buyer_name: buyer.name,
        buyer_email: buyer.email,
        buyer_phone: buyer.phone || '',
        ship_to: shipTo(buyer),
        order_json: orderJson({ orderId, paymentId, summary, buyer, dispatch }),
      },
      PUBLIC_KEY
    )
    .then(() => true)
    .catch((e) => {
      report('studio', e)
      return false
    })

  const [buyerOk, studioOk] = await Promise.all([buyerSend, studioSend])
  return { sent: buyerOk || studioOk, buyerOk, studioOk }
}
