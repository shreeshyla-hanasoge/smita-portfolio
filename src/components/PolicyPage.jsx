import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import CommonCTA from './CommonCTA'
import { POLICIES, POLICY_LIST, POLICY_CONTACT, LAST_UPDATED } from '../content/policies'
import './PolicyPage.css'

const SITE = 'https://www.studiomintleaf.in'

/**
 * One renderer for all four policy documents — they share a shape, and four
 * near-identical components would drift apart the first time one was edited.
 *
 * Razorpay's activation review needs each to sit at its own URL and to be
 * reachable from the site, which is what the footer links are for.
 */

const Block = ({ block }) => {
  if (block.type === 'ul') {
    return (
      <ul className="policy__list">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }

  if (block.type === 'confirm') {
    return (
      <p className="policy__confirm">
        <strong>Still to confirm —</strong> {block.what}
      </p>
    )
  }

  return (
    <>
      {block.text.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </>
  )
}

const PolicyPage = ({ slug: fixedSlug }) => {
  const params = useParams()
  const slug = fixedSlug || params.policySlug
  const doc = POLICIES[slug]

  if (!doc) return <Navigate to="/" replace />

  return (
    <div className="policy-page">
      <Helmet>
        <title>{`${doc.title} — Studio Mintleaf`}</title>
        <meta name="description" content={doc.lede} />
        <link rel="canonical" href={`${SITE}/${doc.slug}`} />
      </Helmet>

      <div className="policy-wrap">
        <header className="policy__head">
          <p className="policy__eyebrow">Studio Mintleaf</p>
          <h1>{doc.title}</h1>
          <p className="policy__lede">{doc.lede}</p>
          <p className="policy__updated">Last updated {LAST_UPDATED}</p>
        </header>

        <article className="policy__body">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </section>
          ))}
        </article>

        <footer className="policy__foot">
          <h2>Contact</h2>
          <p>
            {POLICY_CONTACT.name} · {POLICY_CONTACT.city}
            <br />
            <a href={`mailto:${POLICY_CONTACT.email}`}>{POLICY_CONTACT.email}</a>
          </p>

          <nav className="policy__nav" aria-label="Policies">
            {POLICY_LIST.filter((d) => d.slug !== slug).map((d) => (
              <Link key={d.slug} to={`/${d.slug}`}>
                {d.title}
              </Link>
            ))}
          </nav>
        </footer>
      </div>

      <CommonCTA />
    </div>
  )
}

export default PolicyPage
