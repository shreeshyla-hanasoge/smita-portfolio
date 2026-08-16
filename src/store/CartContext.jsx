import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { cardsBySlug } from './catalog'
import { summarise } from './commerce'
import { trackAddToCart, trackRemoveFromCart } from './analytics'

/**
 * The basket.
 *
 * It holds card slugs and quantities. Nothing else — no prices, no names, no
 * images. Everything display-worthy is derived from the catalog at render
 * time, and the total is derived from the count by the bundle engine.
 *
 * That is what makes a price change safe: a basket left open in a tab for
 * three weeks re-prices itself on the next render instead of checking out at
 * last month's tiers. It also makes hydration failure survivable — a slug that
 * no longer exists is dropped, a silly quantity is clamped, and a corrupt blob
 * is discarded whole. The buyer loses a basket; they never see a broken page
 * or pay a wrong total.
 *
 * On this shop the grid steppers write here directly. There is no separate
 * "add to cart" step, so this state *is* the collection the buyer is building.
 */

const STORAGE_KEY = 'sm.cards.v1'
const CartContext = createContext(null)

const MAX_PER_CARD = 10

const reducer = (lines, action) => {
  switch (action.type) {
    case 'hydrate':
      return action.lines

    case 'add': {
      const existing = lines.find((l) => l.slug === action.slug)
      if (!existing) return [...lines, { slug: action.slug, quantity: 1 }]
      return lines.map((l) =>
        l.slug === action.slug
          ? { ...l, quantity: Math.min(MAX_PER_CARD, l.quantity + 1) }
          : l
      )
    }

    case 'setQuantity': {
      if (action.quantity <= 0) return lines.filter((l) => l.slug !== action.slug)
      const existing = lines.find((l) => l.slug === action.slug)
      const quantity = Math.min(MAX_PER_CARD, action.quantity)
      if (!existing) return [...lines, { slug: action.slug, quantity }]
      return lines.map((l) => (l.slug === action.slug ? { ...l, quantity } : l))
    }

    case 'remove':
      return lines.filter((l) => l.slug !== action.slug)

    case 'clear':
      return []

    default:
      return lines
  }
}

/** Read persisted lines and reconcile them against today's collection. */
const loadLines = () => {
  if (typeof window === 'undefined') return []
  let raw
  try {
    raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
  } catch {
    return [] // corrupt JSON — start clean
  }
  if (!raw || !Array.isArray(raw.lines)) return []

  return raw.lines
    .filter((l) => l && typeof l.slug === 'string' && Number.isFinite(l.quantity))
    .filter((l) => cardsBySlug[l.slug]) // card retired from the collection
    .map((l) => ({
      slug: l.slug,
      quantity: Math.max(1, Math.min(MAX_PER_CARD, Math.floor(l.quantity))),
    }))
}

export const CartProvider = ({ children }) => {
  const [lines, dispatch] = useReducer(reducer, [])
  const [hydrated, setHydrated] = useState(false)
  const [pulse, setPulse] = useState(null) // slug most recently added, for the tray animation

  // Hydrate after mount so a prerendered shell and the client agree on the
  // first paint — otherwise the tray flashes into empty HTML.
  useEffect(() => {
    dispatch({ type: 'hydrate', lines: loadLines() })
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, v: 1 }))
    } catch {
      // Private mode / quota. The basket still works for this session.
    }
  }, [lines, hydrated])

  const summary = useMemo(() => summarise(lines, cardsBySlug), [lines])

  const api = useMemo(() => {
    const quantityOf = (slug) => lines.find((l) => l.slug === slug)?.quantity || 0

    /** Per-card price for GA4. There is no line price here, so the effective
     *  bundle rate is the only honest number to report per item. */
    const gaItem = (card, quantity) => ({
      sku: card.slug,
      title: card.name,
      variantLabel: card.scientific,
      category: card.group,
      price: summary.perCard || 99,
      quantity,
    })

    return {
      lines,
      summary,
      hydrated,
      pulse,
      quantityOf,

      add: (card) => {
        dispatch({ type: 'add', slug: card.slug })
        setPulse({ slug: card.slug, at: Date.now() })
        trackAddToCart(gaItem(card, 1))
      },

      setQuantity: (slug, quantity) => {
        const card = cardsBySlug[slug]
        const before = quantityOf(slug)
        dispatch({ type: 'setQuantity', slug, quantity })
        if (!card) return
        if (quantity > before) {
          setPulse({ slug, at: Date.now() })
          trackAddToCart(gaItem(card, quantity - before))
        } else if (quantity < before) {
          trackRemoveFromCart(gaItem(card, before - quantity))
        }
      },

      remove: (slug) => {
        const card = cardsBySlug[slug]
        if (card) trackRemoveFromCart(gaItem(card, quantityOf(slug)))
        dispatch({ type: 'remove', slug })
      },

      clear: () => dispatch({ type: 'clear' }),
    }
  }, [lines, summary, hydrated, pulse])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}

export { MAX_PER_CARD, STORAGE_KEY }
