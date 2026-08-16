import React, { useEffect, useRef } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCart } from '../../store/CartContext'
import { formatINR } from '../../store/commerce'
import { trackPurchase } from '../../store/analytics'
import './store.css'

/**
 * Order outcome pages.
 *
 * Success is the only place `purchase` is fired, and it is fired once per
 * order id — a refresh must not double-count revenue. It is also the only
 * place the basket is cleared: clearing on submit would punish exactly the
 * person whose payment failed halfway.
 */

export const OrderSuccessPage = () => {
  const { state } = useLocation()
  const { clear } = useCart()
  const fired = useRef(false)

  useEffect(() => {
    if (!state?.orderId || fired.current) return
    const key = `sm.purchase.${state.orderId}`
    if (!window.sessionStorage.getItem(key)) {
      trackPurchase(state.orderId, state.summary)
      window.sessionStorage.setItem(key, '1')
    }
    fired.current = true
    clear()
  }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!state?.orderId) return <Navigate to="/shop" replace />

  const { orderId, summary, buyer, dispatch } = state

  return (
    <div className="store-root">
      <Helmet>
        <title>Order confirmed — Studio Mintleaf</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="sm-shell outcome">
        {/* The cards they just bought, fanned — a receipt they might actually
            want to look at. */}
        {summary?.items?.length > 0 && (
          <div className="outcome__fan" aria-hidden="true">
            {summary.items.slice(0, 5).map((item, i) => (
              <span
                key={item.slug}
                className="outcome__fancard"
                data-theme={item.theme}
                style={{
                  '--tint': item.tint,
                  '--i': i - Math.min(summary.items.length, 5) / 2,
                }}
              >
                <img src={item.art} alt="" />
              </span>
            ))}
          </div>
        )}

        <h1 className="outcome__title">Thank you, {buyer?.name?.split(' ')[0] || 'friend'}</h1>
        <p className="outcome__lede">
          Order <strong>{orderId}</strong> is paid. A confirmation is on its way to{' '}
          <strong>{buyer?.email}</strong> — if it isn&apos;t there in ten minutes, check the
          promotions tab before writing in.
        </p>

        <div className="outcome__card">
          <h2>What happens next</h2>
          <ol className="steps">
            <li>
              <strong>Now</strong> — your cards are set aside with your name on them.
            </li>
            <li>
              <strong>{dispatch || 'Next month'}</strong> — the monthly batch is packed and posted.
              Everything goes out in one run, which is how the studio keeps the packaging down.
            </li>
            <li>
              <strong>When it ships</strong> — a tracking number reaches you by email.
            </li>
          </ol>
        </div>

        {summary && (
          <div className="outcome__receipt">
            <h2>
              {summary.count} {summary.count === 1 ? 'card' : 'cards'}
            </h2>
            <ul>
              {summary.items.map((i) => (
                <li key={i.slug}>
                  <span>
                    {i.name}
                    {i.quantity > 1 && ` × ${i.quantity}`}
                  </span>
                  <span className="outcome__sci">{i.scientific}</span>
                </li>
              ))}
              <li className="outcome__total">
                <span>Total paid</span>
                <span>{formatINR(summary.total)}</span>
              </li>
            </ul>
          </div>
        )}

        <div className="outcome__actions">
          <Link to="/shop" className="sm-btn sm-btn--primary">
            Back to the collection
          </Link>
          <Link to="/newsletter" className="sm-btn sm-btn--ghost">
            Read the newsletter
          </Link>
        </div>
      </div>
    </div>
  )
}

export const OrderFailedPage = () => {
  const { state } = useLocation()

  return (
    <div className="store-root">
      <Helmet>
        <title>Payment didn&apos;t go through — Studio Mintleaf</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="sm-shell outcome outcome--fail">
        <span className="outcome__mark" aria-hidden="true">
          !
        </span>
        <h1 className="outcome__title">That payment didn&apos;t go through</h1>
        <p className="outcome__lede">
          Nothing has been charged and your cards are exactly where you left them. Card payments to
          small Indian merchants get declined more often than they should — a UPI attempt usually
          sails straight through.
        </p>

        <div className="outcome__actions">
          <Link to="/shop/checkout" className="sm-btn sm-btn--primary">
            Try again
          </Link>
          <Link to="/shop/cart" className="sm-btn sm-btn--ghost">
            Back to your collection
          </Link>
        </div>

        <p className="sm-note">
          Still stuck? Write to the studio with reference{' '}
          <strong>{state?.orderId || 'your email address'}</strong> and you&apos;ll get a direct
          payment link within a day.
        </p>
      </div>
    </div>
  )
}
