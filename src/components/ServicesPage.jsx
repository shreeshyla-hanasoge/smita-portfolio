import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import './ServicesPage.css'

const reveal = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

const services = [
  {
    title: 'Science communication & interpretation',
    description: 'Posters, field guides, outreach material, interpretation panels, educational graphics and exhibits.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="18" height="20" rx="1.5"/><path d="M8 8.5h10M8 12.5h10M8 16.5h6"/>
      </svg>
    )
  },
  {
    title: 'Publication & editorial illustration',
    description: 'Books, magazines, reports and educational publications.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 5.5C11 3.8 8.2 3 5 3v17c3.2 0 6 .8 8 2.5 2-1.7 4.8-2.5 8-2.5V3c-3.2 0-6 .8-8 2.5Z"/><path d="M13 5.5v17"/>
      </svg>
    )
  },
  {
    title: 'Merchandise & product design',
    description: 'Sticker packs, postcards, prints, stationery and other nature-inspired products.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 12.5 12.5 3.5H22v9.5L13 22.5a1.4 1.4 0 0 1-2 0l-7.5-7.5a1.4 1.4 0 0 1 0-2Z"/><circle cx="17.5" cy="8" r="1.4"/>
      </svg>
    )
  },
  {
    title: 'Custom wildlife commissions',
    description: 'Original paintings and bespoke artwork for homes, offices and gifts.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="3.5" width="19" height="19" rx="1"/><rect x="7" y="7" width="12" height="12"/><path d="m9.5 16 3-3.5 2 2.2 2-2.7 2.5 4"/>
      </svg>
    )
  }
]

const steps = [
  {
    title: 'Discovery',
    description: "We begin by understanding the project's goals, audience and intended use. You'll share any relevant content, research, species information, reference material or brand guidelines, and we'll discuss the best creative direction."
  },
  {
    title: 'Concept & sketches',
    description: "Initial concepts, compositions and sketches are developed and shared for discussion. Together, we'll refine the visual approach, timeline and project scope before moving into the final artwork."
  },
  {
    title: 'Design & refinement',
    description: 'Illustrations and layouts are developed progressively, with key milestones shared for feedback. Revisions are incorporated along the way to ensure the work meets both creative and communication goals.'
  },
  {
    title: 'Final delivery',
    description: 'Final artwork is delivered in the agreed formats, ready for print or digital use. Projects can be adapted into multiple languages where required — we work comfortably in English, Kannada, Hindi and Marathi.'
  }
]

const faqs = [
  {
    q: 'How long does a project take, and what does it cost?',
    a: "Timelines and costs both depend on scope, and are mutually decided before the project begins. Consultations are free — just drop us a message and we'll figure out a scope that works."
  },
  {
    q: "Who owns the artwork once it's done?",
    a: "You'll get full usage rights for the purpose we agree on upfront — a specific campaign, publication or exhibit. We retain copyright and may show the work in our portfolio unless we agree otherwise. If you need broader or exclusive rights, we'll talk licensing as part of the brief."
  },
  {
    q: 'What file formats do you deliver?',
    a: "Final files are delivered in whatever formats you need — typically print-ready PDF or TIFF at high resolution, and web-ready PNG or JPEG. Let us know your end use and we'll make sure you get the right files."
  },
  {
    q: 'How many revisions are included?',
    a: 'Two rounds of revisions are built into the process after the initial sketch. Additional changes may cost extra — just flag it early so we can plan for it.'
  },
  {
    q: 'Can I see the work in progress?',
    a: 'Of course — we can decide the cadence together so that everyone stays on the same page.'
  },
  {
    q: "My project doesn't quite fit what's listed — can I still get in touch?",
    a: "Absolutely — send us a note about what you have in mind and we'll let you know if it's something we can take on."
  }
]

const ServicesPage = () => {
  const [openFaq, setOpenFaq] = React.useState(0)

  return (
    <div className="services-page">
      <Helmet>
        <title>Services - Studio Mintleaf</title>
        <meta name="description" content="Science communication, editorial illustration, nature-inspired merchandise and custom wildlife commissions — what Studio Mintleaf makes and how a project unfolds." />

        <meta property="og:title" content="Services - Studio Mintleaf" />
        <meta property="og:description" content="Science communication, editorial illustration, nature-inspired merchandise and custom wildlife commissions." />
        <meta property="og:url" content="https://www.studiomintleaf.in/services" />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="Services - Studio Mintleaf" />
        <meta name="twitter:description" content="Science communication, editorial illustration, nature-inspired merchandise and custom wildlife commissions." />

        <link rel="canonical" href="https://www.studiomintleaf.in/services" />
      </Helmet>

      {/* Hero */}
      <header className="sv-hero">
        <div className="sv-wrap">
          <motion.p className="sv-eyebrow" {...reveal}>Services</motion.p>
          <motion.h1 {...reveal}>We tell stories — most of them happen to be about nature.</motion.h1>
          <motion.p className="sv-lede" {...reveal}>
            Our work sits at the intersection of art and science, turning research and biodiversity into visuals people connect with. Here's what we make, how a project unfolds, and answers to the questions we hear most.
          </motion.p>
        </div>
      </header>

      {/* What we do */}
      <section className="sv-section sv-section-first">
        <div className="sv-wrap sv-split">
          <motion.div className="sv-aside" {...reveal}>
            <p className="sv-eyebrow">What we do</p>
            <h2>Four ways in</h2>
            <p className="sv-note">From a single commissioned painting to a full interpretive exhibit — every project starts with the same question: what should people feel and understand?</p>
          </motion.div>
          <div className="sv-main">
            <div className="sv-services">
              {services.map((service) => (
                <motion.div className="sv-service" key={service.title} {...reveal}>
                  <span className="sv-icon" aria-hidden="true">{service.icon}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="sv-section sv-band-tint">
        <div className="sv-wrap sv-split">
          <motion.div className="sv-aside" {...reveal}>
            <p className="sv-eyebrow">How we do it</p>
            <h2>From first call to final files</h2>
            <p className="sv-note">Four stages, shared milestones, no surprises.</p>
          </motion.div>
          <div className="sv-main">
            <ol className="sv-timeline">
              {steps.map((step, i) => (
                <motion.li key={step.title} {...reveal}>
                  <span className="sv-step-num" aria-hidden="true">{i + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
            <motion.p className="sv-process-coda" {...reveal}>
              Every project is different. If your needs fall outside the standard process — coordinating with printers, adapting artwork for new formats, collaborating with subject experts — we're happy to tailor the workflow.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="sv-section">
        <div className="sv-wrap sv-split">
          <motion.div className="sv-aside" {...reveal}>
            <p className="sv-eyebrow">Kind words</p>
            <h2>From a recent collaboration</h2>
          </motion.div>
          <div className="sv-main">
            <motion.figure className="sv-quote" {...reveal}>
              <blockquote>
                &ldquo;Smita has a very pleasing aesthetic and design sense and a real feel for nature. The combination results in stunning designs, whether it's street art, information boards or any other visual medium.&rdquo;
              </blockquote>
              <figcaption>
                <div className="sv-quote-name">Ashish Patel</div>
                <div className="sv-quote-role">Volunteer, Friends of L Street</div>
              </figcaption>
            </motion.figure>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sv-section sv-section-faq">
        <div className="sv-wrap sv-split">
          <motion.div className="sv-aside" {...reveal}>
            <p className="sv-eyebrow">Questions</p>
            <h2>We're here to help</h2>
            <p className="sv-note">Anything else — just ask in your first message.</p>
          </motion.div>
          <div className="sv-main">
            <motion.div className="sv-faq" {...reveal}>
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i
                return (
                  <div className={`sv-faq-item ${isOpen ? 'open' : ''}`} key={faq.q}>
                    <button
                      className="sv-faq-q"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                    >
                      {faq.q}
                      <span className="sv-plus" aria-hidden="true"></span>
                    </button>
                    <div className="sv-faq-a" style={{ maxHeight: isOpen ? '400px' : '0' }}>
                      <p>{faq.a}</p>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sv-band-sage">
        <div className="sv-wrap">
          <motion.div className="sv-cta" {...reveal}>
            <h2>Have a project in mind?</h2>
            <p>If you need to bring a story to life with illustration, tell us what you're imagining — species, format, audience, anything you have.</p>
            <a className="sv-cta-email" href="mailto:smita@studiomintleaf.in">smita@studiomintleaf.in</a>
            <p className="sv-cta-side">We usually reply within two working days. Based in Bangalore, working everywhere.</p>
          </motion.div>
        </div>
      </section>

      {/* Newsletter pointer */}
      <section>
        <div className="sv-wrap sv-news-row">
          <div>
            <h2>Field notes, quarterly</h2>
            <p>Sketches, new work and what we're noticing outside. No noise.</p>
          </div>
          <Link className="sv-news-link" to="/newsletter">Read the latest issue →</Link>
        </div>
      </section>

      <footer className="sv-footer">
        <div className="sv-wrap">
          <p>&copy; 2026 Studio Mintleaf. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default ServicesPage
