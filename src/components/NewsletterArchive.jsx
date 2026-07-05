import React from 'react'
import { Link } from 'react-router-dom'
import { newsletters } from './newsletters'
import './NewsletterArchive.css'

// Slim history strip shown at the top of every newsletter issue so readers
// can jump between past quarters. The active issue is highlighted.
const NewsletterArchive = ({ currentId }) => {
  return (
    <nav className="newsletter-archive" aria-label="Newsletter archive">
      <span className="newsletter-archive-label">Past issues</span>
      <ul className="newsletter-archive-list">
        {newsletters.map((issue) => {
          const isActive = issue.id === currentId
          return (
            <li key={issue.id}>
              <Link
                to={issue.path}
                className={`newsletter-archive-pill${isActive ? ' is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="newsletter-archive-quarter">{issue.label}</span>
                <span className="newsletter-archive-period">{issue.period}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default NewsletterArchive
