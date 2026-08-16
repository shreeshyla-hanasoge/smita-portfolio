import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../store/CartContext'
import { formatINR, FREE_SHIPPING_OVER } from '../../store/commerce'

/**
 * The tray.
 *
 * Bundle pricing has one failure mode: a buyer picks four cards, sees ₹349 at
 * checkout, and has no idea whether that was a good deal or how it was reached.
 * The tray removes that by doing the arithmetic out loud, live, while they
 * choose — count, price, what each card is working out to, and the one thing
 * worth knowing next.
 *
 * It shows a single nudge at a time, in cards rather than rupees. Nobody adds
 * ₹99 of anything; they will happily add one more bird. Priority is
 * deliberate: a cheaper total beats free shipping, because "two more cards and
 * you pay less" is a better sentence than any shipping message.
 */
const CollectionTray = () => {
  const { summary, hydrated, pulse } = useCart()
  const { pathname } = useLocation()

  // The tray is the shop's basket. On the cart and checkout pages the real
  // summary is on screen, so a floating copy of it is just clutter.
  const suppressed = pathname.startsWith('/shop/cart') || pathname.startsWith('/shop/checkout')
  const open = hydrated && summary.count > 0 && !suppressed

  const nudge = summary.tierNudge
    ? {
        key: 'tier',
        text:
          summary.tierNudge.saving > 0
            ? `Add ${summary.tierNudge.addCards} more — ${summary.tierNudge.newCount} cards for ${formatINR(summary.tierNudge.newTotal)}, ${formatINR(summary.tierNudge.saving)} less than this`
            : `Add ${summary.tierNudge.addCards} more at no extra cost — ${summary.tierNudge.newCount} cards is also ${formatINR(summary.tierNudge.newTotal)}`,
      }
    : summary.shippingNudge
    ? {
        key: 'ship',
        text: `Add ${summary.shippingNudge.addCards} more and shipping is on the studio`,
      }
    : summary.shippingWaived
    ? { key: 'free', text: 'Shipping is on the studio', tone: 'won' }
    : null

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          className="tray"
          aria-label="Your collection"
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="tray__inner">
            <div className="tray__stack" aria-hidden="true">
              {summary.items.slice(0, 4).map((item, i) => (
                <motion.span
                  key={item.slug}
                  className="tray__chip"
                  data-theme={item.theme}
                  style={{ '--tint': item.tint, zIndex: 10 - i }}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{
                    scale: pulse?.slug === item.slug ? [1.14, 1] : 1,
                    opacity: 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={item.art} alt="" />
                </motion.span>
              ))}
              {summary.items.length > 4 && (
                <span className="tray__chip tray__chip--more">+{summary.items.length - 4}</span>
              )}
            </div>

            <div className="tray__figures">
              <span className="tray__count">
                {summary.count} {summary.count === 1 ? 'card' : 'cards'}
              </span>
              <span className="tray__price">
                {formatINR(summary.subtotal)}
                <small>{formatINR(summary.perCard)} each</small>
              </span>
            </div>

            <AnimatePresence mode="wait">
              {nudge && (
                <motion.p
                  key={nudge.key + nudge.text}
                  className={`tray__nudge ${nudge.tone === 'won' ? 'is-won' : ''}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                >
                  {nudge.text}
                </motion.p>
              )}
            </AnimatePresence>

            <Link to="/shop/cart" className="tray__cta">
              Review order
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <span className="tray__meter" aria-hidden="true">
            <motion.span
              className="tray__meterfill"
              animate={{
                width: `${Math.min(100, (summary.subtotal / FREE_SHIPPING_OVER) * 100)}%`,
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </span>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default CollectionTray
