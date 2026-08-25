import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import CommonCTA from './CommonCTA'
import { projects } from './ProjectPage'
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

// Every testimonial the studio has, drawn from the project data so the two
// can't drift apart. Flattened once at module load, not per render.
const testimonials = projects.flatMap((project) =>
  (project.testimonials || []).map((t) => ({ ...t, project: project.title }))
)

// Below this width the long sections collapse behind a button, per the mobile design.
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const onChange = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isMobile
}

// Parallax for the jungle band. The subjects hold still and only the backdrop
// travels behind them, which is why it is exported from a much taller crop.
//
// Where scroll-driven animations are supported the CSS handles this entirely
// on the compositor, and this hook does nothing. Elsewhere it falls back to
// writing a -1..1 progress value that the CSS applies to the backdrop. The
// fallback reads scroll position inside rAF rather than on the scroll event,
// so each frame paints the position it was actually scheduled for and the
// drift stops the instant the scroll does.
const useParallax = () => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = null
    let running = false
    let idle = 0
    let last = null
    let stopped = false

    const tick = () => {
      const rect = el.getBoundingClientRect()
      const progress = 1 - 2 * ((rect.top + rect.height) / (window.innerHeight + rect.height))
      if (progress !== last) {
        el.style.setProperty('--p', progress.toFixed(4))
        last = progress
        idle = 0
      } else if (++idle > 10) {
        // Nothing has moved for ten frames — idle until the next scroll
        running = false
        frame = null
        return
      }
      frame = window.requestAnimationFrame(tick)
    }

    const start = () => {
      if (running || stopped) return
      running = true
      idle = 0
      frame = window.requestAnimationFrame(tick)
    }

    const runFallback = () => {
      el.classList.add('sv-band-js')
      start()
      window.addEventListener('scroll', start, { passive: true })
      window.addEventListener('resize', start)
    }

    // No scroll-driven animation support: drive it from JS immediately.
    if (!window.CSS?.supports?.('animation-timeline: view()')) {
      runFallback()
      return () => {
        stopped = true
        if (frame !== null) window.cancelAnimationFrame(frame)
        window.removeEventListener('scroll', start)
        window.removeEventListener('resize', start)
      }
    }

    // Otherwise the CSS drives it on the compositor and this hook stays out of
    // the way. (Sampling the animation's progress from JS to double-check is
    // not reliable: during a compositor-driven scroll the main thread reads a
    // stale value, so the check reports "frozen" for a timeline that is in fact
    // running, and would disable the very path that makes this smooth.)
    return () => {
      stopped = true
      if (frame !== null) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', start)
      window.removeEventListener('resize', start)
    }
  }, [])

  return ref
}

const Disclosure = ({ label, open, onToggle }) => (
  <button className="sv-disclosure" aria-expanded={open} onClick={onToggle}>
    {open ? 'Show less' : label}
  </button>
)

const ServicesPage = () => {
  const isMobile = useIsMobile()
  const parallaxRef = useParallax()
  const [openFaq, setOpenFaq] = useState(0)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const quote = testimonials[quoteIndex]
  const [showServices, setShowServices] = useState(false)
  const [showProcess, setShowProcess] = useState(false)
  const [showFaq, setShowFaq] = useState(false)

  // On desktop every section is always open; the buttons only exist on mobile.
  const servicesOpen = !isMobile || showServices
  const processOpen = !isMobile || showProcess
  const faqOpen = !isMobile || showFaq

  return (
    <div className="services-page">
      <Helmet>
        <title>Services - Studio Mintleaf</title>
        <meta name="description" content="Science communication, editorial illustration, nature-inspired merchandise and custom wildlife commissions — what Studio Mintleaf makes and how a project unfolds." />

        <meta property="og:title" content="Services - Studio Mintleaf" />
        <meta property="og:description" content="Science communication, editorial illustration, nature-inspired merchandise and custom wildlife commissions." />
        <meta property="og:url" content="https://www.studiomintleaf.in/services" />
        <meta property="og:image" content="https://www.studiomintleaf.in/images/services/hero-heron.jpg" />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="Services - Studio Mintleaf" />
        <meta name="twitter:description" content="Science communication, editorial illustration, nature-inspired merchandise and custom wildlife commissions." />
        <meta name="twitter:image" content="https://www.studiomintleaf.in/images/services/hero-heron.jpg" />

        <link rel="canonical" href="https://www.studiomintleaf.in/services" />
      </Helmet>

      {/* Hero — dark band, heron bleeding off the right */}
      <header className="sv-hero">
        <div className="sv-hero-art" aria-hidden="true">
          <div className="sv-wrap sv-hero-art-inner">
            <img src="/images/services/hero-heron.jpg" alt="" />
          </div>
        </div>
        <div className="sv-wrap sv-hero-inner">
          <motion.p className="sv-eyebrow sv-eyebrow-light" {...reveal}>Services</motion.p>
          <motion.h1 {...reveal}>We tell stories — most of them happen to be about nature.</motion.h1>
          <motion.p className="sv-lede" {...reveal}>
            Our work sits at the intersection of art and science, turning research and biodiversity into visuals people connect with. Here's what we make, how a project unfolds, and answers to the questions we hear most.
          </motion.p>
        </div>
      </header>

      {/* What we do */}
      <section className="sv-section sv-section-what">
        <div className="sv-wrap sv-split">
          <motion.div className="sv-aside" {...reveal}>
            <p className="sv-eyebrow">What we do</p>
            <h2>Four ways in</h2>
            <p className="sv-note">From a single commissioned painting to a full interpretive exhibit — every project starts with the same question: what should people feel and understand?</p>
            <img className="sv-art sv-art-spider" src="/images/services/spider.png" alt="Illustration of a Chrysilla volupe jumping spider" />
            {isMobile && (
              <Disclosure label="Read about it" open={showServices} onToggle={() => setShowServices((v) => !v)} />
            )}
          </motion.div>

          {servicesOpen && (
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
          )}
        </div>
      </section>

      {/* Full-bleed parallax band: painted backdrop behind a single layer of
          vine artwork, which holds still while the backdrop drifts. */}
      <div className="sv-band-art" ref={parallaxRef} aria-hidden="true">
        <img className="sv-layer sv-layer-bg" src="/images/services/jungle-bg.jpg" alt="" />
        <img className="sv-layer sv-layer-fg" src="/images/services/vine.png" alt="" />
      </div>

      {/* How we do it — horizontal process */}
      <section className="sv-section sv-band-tint">
        <div className="sv-wrap">
          <motion.div className="sv-process-head" {...reveal}>
            <p className="sv-eyebrow">How we do it</p>
            <h2>From first call to final files</h2>
            <p className="sv-note">Four stages, shared milestones, no surprises.</p>
            {isMobile && (
              <Disclosure label="Understand how we do it" open={showProcess} onToggle={() => setShowProcess((v) => !v)} />
            )}
          </motion.div>

          {processOpen && (
            <>
              <ol className="sv-steps">
                {steps.map((step, i) => (
                  <motion.li key={step.title} {...reveal}>
                    <span className="sv-step-num" aria-hidden="true">{i + 1}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </motion.li>
                ))}
              </ol>
              <motion.p className="sv-process-coda" {...reveal}>
                Every project is different. If your needs fall outside the standard process — coordinating with printers, adapting artwork for new formats, collaborating with subject experts — we're happy to tailor the workflow.
              </motion.p>
            </>
          )}
        </div>
      </section>

      {/* Testimonials — manual carousel, one quote at a time */}
      <section className="sv-section sv-section-quote">
        <div className="sv-wrap sv-split">
          <motion.div className="sv-aside" {...reveal}>
            <p className="sv-eyebrow">Kind words</p>
            <h2>From the people we&rsquo;ve worked with</h2>
            <img className="sv-art sv-art-flower" src="/images/services/copperpod.png" alt="Illustration of a copperpod flower" />
          </motion.div>
          <div className="sv-main">
            <motion.div className="sv-quote-carousel" {...reveal}>
              <figure className="sv-quote" key={quoteIndex}>
                <blockquote>&ldquo;{quote.text}&rdquo;</blockquote>
                <figcaption>
                  <div className="sv-quote-name">{quote.author}</div>
                  <div className="sv-quote-role">{quote.role}</div>
                </figcaption>
              </figure>

              <div className="sv-quote-nav">
                <button
                  className="sv-quote-btn"
                  onClick={() => setQuoteIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
                  aria-label="Previous testimonial"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <span className="sv-quote-count" aria-live="polite">
                  {quoteIndex + 1} / {testimonials.length}
                </span>
                <button
                  className="sv-quote-btn"
                  onClick={() => setQuoteIndex((i) => (i + 1) % testimonials.length)}
                  aria-label="Next testimonial"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sv-section sv-section-faq">
        <div className="sv-wrap sv-split">
          <motion.div className="sv-aside" {...reveal}>
            <p className="sv-eyebrow">Questions</p>
            <h2>We're here to help</h2>
            <p className="sv-note">Anything else — just ask.</p>
            {isMobile && (
              <Disclosure label="Go through the FAQ" open={showFaq} onToggle={() => setShowFaq((v) => !v)} />
            )}
          </motion.div>
          {faqOpen && (
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
          )}
        </div>
      </section>

      <CommonCTA />

    </div>
  )
}

export default ServicesPage
