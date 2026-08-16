import React from 'react'
import { Link } from 'react-router-dom'
import { formatINR } from '../../store/commerce'

/**
 * Small shared furniture for the shop.
 *
 * Type rule for everything in here, and everywhere under .store-root: Reenie
 * Beanie carries the studio's voice — page titles, section heads. Barlow
 * carries the money — prices, counts, totals, form labels, errors. A
 * handwritten price is charming exactly once and unreadable every time after.
 */

export const Breadcrumbs = ({ trail }) => (
  <nav className="sm-crumbs" aria-label="Breadcrumb">
    {trail.map((crumb, i) => (
      <span key={crumb.label} className="sm-crumbs__item">
        {crumb.to ? (
          <Link to={crumb.to}>{crumb.label}</Link>
        ) : (
          <span aria-current="page">{crumb.label}</span>
        )}
        {i < trail.length - 1 && (
          <span className="sm-crumbs__sep" aria-hidden="true">
            /
          </span>
        )}
      </span>
    ))}
  </nav>
)

export const EmptyState = ({ title, children }) => (
  <div className="sm-empty">
    <h2>{title}</h2>
    {children}
  </div>
)

/**
 * How the total was reached, in words. With bundle pricing the buyer cannot
 * add the line items up themselves, so the shop has to show its working —
 * otherwise the number at the bottom is just something to be trusted.
 */
export const BundleBreakdown = ({ bundles }) => {
  if (!bundles?.length) return null
  return (
    <ul className="bundles" aria-label="How this total is made up">
      {bundles.map(({ tier, count }) => (
        <li key={tier.size}>
          <span className="bundles__what">
            {count > 1 && <em>{count} ×</em>} {tier.blurb}
            <small>{tier.size * count} cards</small>
          </span>
          <span className="bundles__amount">{formatINR(tier.price * count)}</span>
        </li>
      ))}
    </ul>
  )
}
