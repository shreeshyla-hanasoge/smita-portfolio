import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './CommonCTA.css'

const reveal = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

/**
 * The closing block every page ends on: the enquiry CTA, the newsletter
 * pointer and the copyright line. Kept as one component because the owner
 * specified them as a single common section — splitting them would let the
 * three drift apart page to page, which is exactly what happened before.
 */
const CommonCTA = () => (
  <>
    <section className="cta-band">
      <img className="cta-art" src="/images/services/dragonfly.png" alt="" aria-hidden="true" />
      <div className="cta-wrap">
        <motion.div className="cta-inner" {...reveal}>
          <h2>Have a project in mind?</h2>
          <p>Tell us what you&rsquo;re imagining, and we&rsquo;ll turn it into a visual experience beyond what you expected.</p>
          <a className="cta-email" href="mailto:smita@studiomintleaf.in">smita@studiomintleaf.in</a>
          <p className="cta-side">Based in Bangalore, working worldwide. We usually respond within two working days.</p>
        </motion.div>
      </div>
    </section>

    <section className="cta-news">
      <div className="cta-wrap cta-news-row">
        <div>
          <h2>Field notes, quarterly</h2>
          <p>Sketches, new work and updates.</p>
        </div>
        <Link className="cta-news-link" to="/newsletter">Read the latest issue &rarr;</Link>
      </div>
    </section>

    <footer className="cta-footer">
      <div className="cta-wrap">
        <p>&copy; 2026 Studio Mintleaf. All rights reserved.</p>
      </div>
    </footer>
  </>
)

export default CommonCTA
