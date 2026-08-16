import React, { useState } from 'react'
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
 * The back is composed, and follows the printed reverse: the fact with the
 * species name set bold, then the studio lockup. That way a new card needs one
 * artwork file rather than two, and the writing stays real text — selectable,
 * searchable, and readable by a screen reader.
 *
 * The card flips, because that is the product: an illustration on one side and
 * a piece of natural history on the other. The printed card carries a QR to the
 * species page; on the web that would be silly, so the reverse links instead.
 */

const FlipIcon = ({ back = false }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {back ? (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
      </>
    ) : (
      <>
        <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
        <path d="M21 3v5h-5" />
      </>
    )}
  </svg>
)

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
  const [flipped, setFlipped] = useState(false)
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
        <div className={`ac__flipper ${flipped ? 'is-flipped' : ''}`}>
          {/* ------------------------------------------------------- front */}
          <button
            className="ac__face ac__face--front"
            style={{ '--tint': card.tint }}
            onClick={() => setFlipped(true)}
            tabIndex={flipped ? -1 : 0}
            aria-hidden={flipped}
            aria-label={`${card.name}, ${card.scientific}. Turn the card over to read about it.`}
          >
            <img src={card.art} alt="" loading={index < 4 ? 'eager' : 'lazy'} />
            <span className="ac__turn" aria-hidden="true">
              <FlipIcon />
            </span>
          </button>

          {/* -------------------------------------------------------- back */}
          <div className="ac__face ac__face--back" aria-hidden={!flipped}>
            <CardBack card={card} linkTabIndex={flipped ? 0 : -1} />
            <button
              className="ac__turn ac__turn--back"
              onClick={() => setFlipped(false)}
              tabIndex={flipped ? 0 : -1}
              aria-label="Turn the card back over"
            >
              <FlipIcon back />
            </button>
          </div>
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
