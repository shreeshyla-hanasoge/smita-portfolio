import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import './PreviewBadge.css'

/**
 * Preview build marker.
 *
 * Set by scripts/deploy-preview.sh at build time. Two jobs, both about not
 * misleading anyone who opens the review link:
 *
 *   1. It says out loud that the checkout is a stub. The page says "Pay ₹448"
 *      and then produces an order confirmation with an order number. Without a
 *      standing notice, a reviewer can reasonably conclude the shop is live and
 *      taking money.
 *   2. It marks the whole build noindex. A public copy of the site would
 *      otherwise be free to compete with studiomintleaf.in in search results
 *      for the studio's own name.
 *
 * The badge is deliberately small and dismissible — it must not sit on top of
 * the thing being reviewed.
 */

export const IS_PREVIEW = import.meta.env.VITE_PREVIEW === '1'

const PreviewBadge = () => {
  // Shows in full long enough to be read, then folds down to a chip. A notice
  // that parks itself over the page is a notice that gets in the way of the
  // review it exists to support — but it must not vanish either, or someone
  // arriving later at the checkout has no idea it is a mock-up.
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (!IS_PREVIEW) return undefined
    const timer = window.setTimeout(() => setOpen(false), 7000)
    return () => window.clearTimeout(timer)
  }, [])

  if (!IS_PREVIEW) return null

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {open ? (
        <aside className="preview-badge" role="status">
          <span className="preview-badge__dot" aria-hidden="true" />
          <span className="preview-badge__text">
            <strong>Preview build.</strong> Checkout is a mock-up — no payment is taken and no
            order reaches the studio.
          </span>
          <button
            className="preview-badge__close"
            onClick={() => setOpen(false)}
            aria-label="Collapse this notice"
          >
            ×
          </button>
        </aside>
      ) : (
        <button
          className="preview-badge preview-badge--chip"
          onClick={() => setOpen(true)}
          aria-label="Preview build — show what that means"
        >
          <span className="preview-badge__dot" aria-hidden="true" />
          Preview
        </button>
      )}
    </>
  )
}

export default PreviewBadge
