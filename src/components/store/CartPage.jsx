import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCart } from '../../store/CartContext'
import { formatINR, nextDispatch, FREE_SHIPPING_OVER } from '../../store/commerce'
import { trackViewCart } from '../../store/analytics'
import { Breadcrumbs, EmptyState, BundleBreakdown } from './StoreUI'
import { CardStepper } from './ArtCard'
import './store.css'

const CartPage = () => {
  const { summary, setQuantity, remove, hydrated } = useCart()
  const navigate = useNavigate()
  const dispatchDate = nextDispatch()

  useEffect(() => {
    if (hydrated && summary.items.length) trackViewCart(summary)
    // Once per visit, not per quantity tweak
  }, [hydrated]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="store-root">
      <Helmet>
        <title>Your collection — Studio Mintleaf</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="sm-shell sm-cart">
        <Breadcrumbs trail={[{ label: 'Shop', to: '/shop' }, { label: 'Your collection' }]} />
        <h1 className="sm-pagetitle">Your collection</h1>

        {!hydrated ? (
          <p className="sm-note">One moment…</p>
        ) : summary.items.length === 0 ? (
          <EmptyState title="No cards picked yet">
            <p>
              Pick a bird, a wolf, a jumping spider. Three cards cost less than three singles, and
              the rate keeps dropping from there.
            </p>
            <Link to="/shop" className="sm-btn sm-btn--primary">
              Back to the collection
            </Link>
          </EmptyState>
        ) : (
          <div className="sm-cart__grid">
            <div className="sm-cart__lines">
              {summary.items.map((item) => (
                <article className="line" key={item.slug}>
                  <Link
                    to={`/shop/card/${item.slug}`}
                    className="line__art"
                    data-theme={item.theme}
                    style={{ '--tint': item.tint }}
                  >
                    <img src={item.art} alt="" loading="lazy" />
                  </Link>
                  <div className="line__body">
                    <Link to={`/shop/card/${item.slug}`} className="line__name">
                      {item.name}
                    </Link>
                    <p className="line__sci">{item.scientific}</p>
                    <div className="line__controls">
                      <CardStepper
                        slug={item.slug}
                        quantity={item.quantity}
                        onAdd={() => setQuantity(item.slug, 1)}
                        onSet={(q) => setQuantity(item.slug, q)}
                        compact
                      />
                      <button className="line__remove" onClick={() => remove(item.slug)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              <Link to="/shop" className="sm-textlink">
                ← Add more cards
              </Link>
            </div>

            <aside className="summary">
              <h2 className="summary__title">
                {summary.count} {summary.count === 1 ? 'card' : 'cards'}
                <span>{formatINR(summary.perCard)} each</span>
              </h2>

              {/* Bundle pricing means the buyer cannot add the lines up
                  themselves. Showing the working is not decoration — without
                  it the total is just a number to be taken on faith. */}
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

              {summary.tierNudge && (
                <p className="summary__nudge">
                  {summary.tierNudge.saving > 0 ? (
                    <>
                      Add <strong>{summary.tierNudge.addCards} more</strong> and{' '}
                      {summary.tierNudge.newCount} cards come to{' '}
                      {formatINR(summary.tierNudge.newTotal)} —{' '}
                      {formatINR(summary.tierNudge.saving)} less than you are paying now.
                    </>
                  ) : (
                    <>
                      Add <strong>{summary.tierNudge.addCards} more</strong> at no extra cost —{' '}
                      {summary.tierNudge.newCount} cards is also{' '}
                      {formatINR(summary.tierNudge.newTotal)}.
                    </>
                  )}{' '}
                  <Link to="/shop" className="sm-textlink sm-textlink--inline">
                    Pick them
                  </Link>
                </p>
              )}

              {!summary.tierNudge && summary.shippingNudge && (
                <p className="summary__nudge">
                  <strong>{summary.shippingNudge.addCards} more</strong> and shipping is on the
                  studio.{' '}
                  <span className="summary__meter" aria-hidden="true">
                    <span
                      className="summary__meterfill"
                      style={{
                        width: `${Math.min(100, (summary.subtotal / FREE_SHIPPING_OVER) * 100)}%`,
                      }}
                    />
                  </span>
                </p>
              )}

              <p className="sm-note sm-note--inline">
                Cards are packed and posted in one batch a month. This order goes out on{' '}
                <strong>{dispatchDate.long}</strong>.
              </p>

              <button
                className="sm-btn sm-btn--primary sm-btn--block"
                onClick={() => navigate('/shop/checkout')}
              >
                Checkout
              </button>

              <p className="summary__pay">
                Card · UPI · Net banking · Wallets, via Razorpay. Prices include taxes.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
