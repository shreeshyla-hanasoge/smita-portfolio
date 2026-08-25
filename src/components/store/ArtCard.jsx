import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { STUDIO } from '../../store/catalog'
import { useCart } from '../../store/CartContext'

/**
 * One art card, at the proportions of the real thing (3.5 × 4 inches → 7:8).
 *
 * The front is the studio's finished artwork, rendered whole. An earlier
 * iteration composed it in the browser from a tint, the illustration and a name
 * plate; the real cards move the title block to suit each piece — top for the
 * barbet, bottom for the tulip — so composing it would have meant redrawing the
 * studio's design badly. One image is both more faithful and less code.
 *
 * Only the front is shown. What is printed on the reverse is part of what
 * someone gets when the card arrives, so the shop does not give it away — the
 * card no longer turns over, here or on its own page.
 */

export const CardStepper = ({ quantity, onAdd, onSet, compact = false }) => {
  if (quantity === 0) {
    return (
      <button className={`ac-add ${compact ? 'ac-add--compact' : ''}`} onClick={onAdd}>
        <span aria-hidden="true">+</span> Add
      </button>
    )
  }
  return (
    <div className={`ac-step ${compact ? 'ac-step--compact' : ''}`} role="group" aria-label="Quantity">
      <button onClick={() => onSet(quantity - 1)} aria-label="One fewer">
        −
      </button>
      <span aria-live="polite">{quantity}</span>
      <button onClick={() => onSet(quantity + 1)} aria-label="One more" disabled={quantity >= 10}>
        +
      </button>
    </div>
  )
}

/**
 * The reverse. Shared by the grid card, the hero and the card page so the three
 * can never drift apart.
 *
 * Where the studio has exported the printed back, that file is what shows —
 * exact, QR and all. The composed version below is the fallback for species
 * whose back hasn't been drawn yet: same content in the same order, so the two
 * read as the same card rather than as two different products.
 */
export const CardBack = ({ card, showLink = true, linkTabIndex = 0 }) => {
  if (card.back) {
    return (
      <img
        className="ac__backart"
        src={card.back}
        alt={`Reverse of the ${card.name} card`}
        loading="lazy"
      />
    )
  }

  return (
    <>
    <p className="ac__fact">
      The <strong>{card.name}</strong> {card.fact}
    </p>

    <div className="ac__backfoot">
      {showLink && (
        <Link to={`/shop/card/${card.slug}`} className="ac__more" tabIndex={linkTabIndex}>
          More about this card →
        </Link>
      )}
      {/* The printed back carries the full logo lockup at 300dpi. On a 250px
          card that artwork collapses into itself, so the web back uses the
          monogram with the name set in type — same mark, legible at any size. */}
      <div className="ac__lockup">
        <img className="ac__mono" src={STUDIO.monogram} alt="" aria-hidden="true" />
        <span className="ac__lockup-text">
          <span className="ac__studio">{STUDIO.name}</span>
          <span className="ac__tagline">{STUDIO.tagline}</span>
          <span className="ac__contact">{STUDIO.site}</span>
          <span className="ac__contact">{STUDIO.email}</span>
        </span>
      </div>
    </div>
    </>
  )
}

const ArtCard = ({ card, index = 0 }) => {
  const { quantityOf, add, setQuantity } = useCart()
  const quantity = quantityOf(card.slug)
  const chosen = quantity > 0

  return (
    <motion.article
      className={`ac ${chosen ? 'is-chosen' : ''}`}
      data-theme={card.theme}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index, 7) * 0.05 }}
    >
      <div className="ac__scene">
        {/* Front only. What is printed on the reverse is meant to be found
            when the card arrives, so there is nothing here to turn over. */}
        <div className="ac__face ac__face--front" data-theme={card.theme} style={{ '--tint': card.tint }}>
          <img
            src={card.art}
            alt={`${card.name}, ${card.scientific}`}
            loading={index < 4 ? 'eager' : 'lazy'}
          />
        </div>

        {/* Count rides on the card itself, so a scan down the grid shows what
            has been collected without reading a single number twice. */}
        <AnimatePresence>
          {chosen && (
            <motion.span
              className="ac__count"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 26 }}
            >
              {quantity}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* The name is on the artwork already; repeating it below would be noise.
          What the grid still needs is a way in to the card's own page. */}
      <div className="ac__label">
        <Link to={`/shop/card/${card.slug}`} className="ac__labelname">
          {card.name}
        </Link>
      </div>

      <CardStepper
        quantity={quantity}
        onAdd={() => add(card)}
        onSet={(q) => setQuantity(card.slug, q)}
      />
    </motion.article>
  )
}

export default ArtCard
