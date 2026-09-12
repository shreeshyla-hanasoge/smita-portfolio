import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCart } from '../../store/CartContext'
import {
  formatINR,
  generateOrderId,
  toPaise,
  nextDispatch,
  RAZORPAY_KEY_ID,
  IS_TEST_KEY,
} from '../../store/commerce'
import { openCheckout } from '../../store/razorpay'
import {
  trackBeginCheckout,
  trackAddShippingInfo,
  trackCheckoutFailure,
} from '../../store/analytics'
import { Breadcrumbs, BundleBreakdown } from './StoreUI'
import './store.css'

/**
 * Checkout — address capture, then handoff.
 *
 * The site never touches card data. This form collects only what the postman
 * needs, then hands the amount and the order id to Razorpay's Checkout modal.
 * The route only renders when a key is configured — see canCheckout() — so
 * there is no stubbed path left to fall through to.
 *
 * One page, not a wizard. At this order size a three-step checkout buys
 * nothing but three chances to leave.
 */

const FIELDS = [
  { name: 'name', label: 'Full name', autoComplete: 'name', width: 'full' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', width: 'half',
    hint: 'For the confirmation and the dispatch note' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', width: 'half',
    hint: 'Only if the courier needs to call' },
  { name: 'address1', label: 'Address', autoComplete: 'address-line1', width: 'full' },
  { name: 'address2', label: 'Apartment, landmark (optional)', autoComplete: 'address-line2', width: 'full', optional: true },
  { name: 'city', label: 'City', autoComplete: 'address-level2', width: 'half' },
  { name: 'state', label: 'State', autoComplete: 'address-level1', width: 'half' },
  { name: 'pincode', label: 'PIN code', autoComplete: 'postal-code', width: 'half', inputMode: 'numeric' },
]

const validate = (values) => {
  const errors = {}
  FIELDS.forEach((f) => {
    if (!f.optional && !values[f.name]?.trim()) errors[f.name] = 'Required'
  })
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = 'That email doesn’t look right'
  if (values.phone && !/^[+]?[\d\s-]{10,14}$/.test(values.phone)) errors.phone = 'Ten digits, please'
  if (values.pincode && !/^\d{6}$/.test(values.pincode)) errors.pincode = 'Six digits'
  return errors
}

const CheckoutPage = () => {
  const { summary, hydrated } = useCart()
  const navigate = useNavigate()
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const dispatchDate = nextDispatch()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Reaching this page *is* beginning checkout, however you got here — firing
  // it on the cart button instead would hide every reload and direct landing.
  useEffect(() => {
    if (hydrated && summary.items.length) trackBeginCheckout(summary)
  }, [hydrated]) // eslint-disable-line react-hooks/exhaustive-deps

  if (hydrated && summary.items.length === 0) return <Navigate to="/shop/cart" replace />

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }))
  }

  /**
   * Hand off to Razorpay.
   *
   * Phase 1: no server, so Checkout opens in amount-only mode and the amount
   * originates in this browser. Nothing ships until the studio has matched the
   * payment in the dashboard — see docs/store/E9.1-commerce-architecture.md.
   */
  const handoff = (orderId) =>
    openCheckout({
      keyId: RAZORPAY_KEY_ID,
      orderId,
      summary,
      buyer: values,
      dispatchLabel: dispatchDate.long,
      amountPaise: toPaise(summary.total),
    })

  const submit = async (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      const first = FIELDS.find((f) => found[f.name])
      document.getElementById(`f-${first.name}`)?.focus()
      return
    }

    setBusy(true)
    setCancelled(false)
    trackAddShippingInfo(summary, 'india')
    const orderId = generateOrderId(new Date(), Math.floor(Math.random() * 1e6))

    try {
      const { paymentId } = await handoff(orderId)
      // The basket is deliberately NOT cleared here — the success page clears
      // it once it has recorded the purchase. Someone who closes the tab during
      // the gateway redirect keeps their cards.
      navigate('/shop/order/success', {
        state: {
          orderId,
          paymentId,
          summary,
          dispatch: dispatchDate.long,
          buyer: { name: values.name, email: values.email },
        },
      })
    } catch (err) {
      // Closing the modal is a change of mind, not a decline. Sending someone
      // to a page headed "that payment didn't go through" for deciding to
      // think about it would be both wrong and alarming.
      if (err.message === 'payment_cancelled') {
        setCancelled(true)
        return
      }
      trackCheckoutFailure(err.message)
      navigate('/shop/order/failed', { state: { orderId, reason: err.message } })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="store-root">
      <Helmet>
        <title>Checkout — Studio Mintleaf</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="sm-shell sm-cart">
        <Breadcrumbs
          trail={[
            { label: 'Shop', to: '/shop' },
            { label: 'Your collection', to: '/shop/cart' },
            { label: 'Checkout' },
          ]}
        />
        <h1 className="sm-pagetitle">Checkout</h1>

        <div className="sm-cart__grid">
          <form className="form" onSubmit={submit} noValidate>
            <h2 className="form__legend">Where should these go?</h2>
            <div className="form__grid">
              {FIELDS.map((f) => (
                <div
                  key={f.name}
                  className={`field field--${f.width} ${errors[f.name] ? 'has-error' : ''}`}
                >
                  <label htmlFor={`f-${f.name}`}>{f.label}</label>
                  <input
                    id={`f-${f.name}`}
                    name={f.name}
                    type={f.type || 'text'}
                    inputMode={f.inputMode}
                    autoComplete={f.autoComplete}
                    value={values[f.name] || ''}
                    onChange={(e) => set(f.name, e.target.value)}
                    aria-invalid={Boolean(errors[f.name])}
                    aria-describedby={
                      errors[f.name] ? `e-${f.name}` : f.hint ? `h-${f.name}` : undefined
                    }
                  />
                  {errors[f.name] ? (
                    <p className="field__error" id={`e-${f.name}`}>
                      {errors[f.name]}
                    </p>
                  ) : f.hint ? (
                    <p className="field__hint" id={`h-${f.name}`}>
                      {f.hint}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>

            {IS_TEST_KEY && (
              <p className="sim">
                Razorpay test mode — use a test card or UPI id. No money moves.
              </p>
            )}

            {cancelled && (
              <p className="field__error" role="status">
                Payment window closed — nothing has been charged. Your cards are still here
                whenever you are ready.
              </p>
            )}

            <button className="sm-btn sm-btn--primary sm-btn--block" type="submit" disabled={busy}>
              {busy ? 'Opening secure checkout…' : `Pay ${formatINR(summary.total)}`}
            </button>
            <p className="form__legal">
              You&apos;ll pay on Razorpay&apos;s secure page. Studio Mintleaf never sees your card
              details.
            </p>
          </form>

          <aside className="summary">
            <h2 className="summary__title">
              {summary.count} {summary.count === 1 ? 'card' : 'cards'}
              <span>{formatINR(summary.perCard)} each</span>
            </h2>

            <ul className="summary__cards">
              {summary.items.map((i) => (
                <li key={i.slug}>
                  <span
                    className="summary__chip"
                    data-theme={i.theme}
                    style={{ '--tint': i.tint }}
                  >
                    <img src={i.art} alt="" loading="lazy" />
                  </span>
                  <span className="summary__cardname">
                    {i.name}
                    {i.quantity > 1 && <small>× {i.quantity}</small>}
                  </span>
                </li>
              ))}
            </ul>

            <BundleBreakdown bundles={summary.bundles} />

            <dl className="summary__rows">
              <div>
                <dt>Cards</dt>
                <dd>{formatINR(summary.subtotal)}</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd>
                  {summary.shippingWaived ? (
                    <span className="summary__free">Free</span>
                  ) : (
                    formatINR(summary.shipping)
                  )}
                </dd>
              </div>
              <div className="summary__total">
                <dt>Total</dt>
                <dd>{formatINR(summary.total)}</dd>
              </div>
            </dl>

            <p className="sm-note sm-note--inline">
              Posted in the monthly batch on <strong>{dispatchDate.long}</strong>.
            </p>

            <Link to="/shop/cart" className="sm-textlink sm-textlink--center">
              Edit collection
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
