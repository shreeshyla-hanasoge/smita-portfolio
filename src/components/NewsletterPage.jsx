import React from 'react'
import { Helmet } from 'react-helmet-async'
import './NewsletterPage.css'

const radarItems = [
  {
    title: 'Bird, Nest & Egg',
    description:
      'This is a newly-released book containing several intricate illustrations by Joris De Raedt',
  },
  {
    title: 'Paper Gardens',
    description: 'an exhibition about botanical art at MAP Bangalore',
  },
  {
    title: 'Summer Scribbles',
    description:
      'by Sefi George - she has some very interesting walks scheduled and lovely merchandise on her website',
  },
]

const NewsletterPage = () => {
  return (
    <div className="newsletter-page">
      <Helmet>
        <title>Field Notes From The Studio | Q1 2026</title>
        <meta
          name="description"
          content="Studio Mintleaf quarterly newsletter for January to March 2026."
        />
        <meta property="og:title" content="Field Notes From The Studio | Q1 2026" />
        <meta
          property="og:description"
          content="Studio Mintleaf quarterly newsletter for January to March 2026."
        />
        <meta
          property="og:image"
          content="https://studiomintleaf.in/images/gallery/newsletter-q1-2026.png"
        />
        <meta property="og:url" content="https://studiomintleaf.in/newsletter/q1-2026" />
        <meta property="og:type" content="article" />
        <meta name="twitter:title" content="Field Notes From The Studio | Q1 2026" />
        <meta
          name="twitter:description"
          content="Studio Mintleaf quarterly newsletter for January to March 2026."
        />
        <meta
          name="twitter:image"
          content="https://studiomintleaf.in/images/gallery/newsletter-q1-2026.png"
        />
        <link rel="canonical" href="https://studiomintleaf.in/newsletter/q1-2026" />
      </Helmet>

      <article className="newsletter-article">
        <header className="newsletter-header">
          <div className="newsletter-header-copy">
            <h1>Field Notes From The Studio</h1>
            <p>Updates from Jan-Mar&apos;26</p>
          </div>
          <img
            className="newsletter-header-logo"
            src="/images/newsletter/newsletter-logo.svg"
            alt="Studio Mintleaf"
          />
        </header>

        <main className="newsletter-main">
          <section className="newsletter-note" aria-labelledby="artist-note-title">
            <figure className="newsletter-note-portrait">
              <img
                src="/images/newsletter/newsletter-photo-frame.png"
                alt="Portrait of Smita"
              />
              <img
                className="newsletter-note-leaf"
                src="/images/newsletter/newsletter-leaf.svg"
                alt=""
                aria-hidden="true"
              />
            </figure>

            <div className="newsletter-note-copy">
              <h2 id="artist-note-title">Artist&apos;s note</h2>
              <p>
                Studio Mintleaf started at a point of change when I stepped away from a
                decade-long corporate career to build something of my own. What began as a
                small art practice has slowly taken shape into a studio focused on
                illustration, nature-led storytelling, and thoughtful collaborations.
              </p>
              <p>
                Today, Studio Mintleaf works with people that care about nuance, craft, and
                quiet impact. As the practice grows, the intention remains the same: to
                create work that feels alive, grounded, and gently shifts the way people see
                the world around them.
              </p>
            </div>

            <img
              className="newsletter-copperpod"
              src="/images/newsletter/newsletter-copperpod.png"
              alt=""
              aria-hidden="true"
            />
          </section>

          <section className="newsletter-projects" aria-labelledby="projects-title">
            <div className="newsletter-projects-intro">
              <h2 id="projects-title">Projects</h2>
              <p>
                Few big projects this quarter: worked on the L Street community project -
                creating 25+ information boards around urban flora and fauna, illustrated
                posters on small wild cats for a PhD student, plus wolf and hyena masks for
                Holematthi Nature Foundation as part of an educational series.
              </p>
            </div>

            <img
              className="newsletter-fishing-cat"
              src="/images/newsletter/newsletter-fishing-cat.png"
              alt=""
              aria-hidden="true"
            />

            <div className="newsletter-projects-followup">
              <figure className="newsletter-memory-art">
                <img
                  src="/images/newsletter/newsletter-portrait.png"
                  alt="Blue-toned personal artwork"
                />
              </figure>

              <div className="newsletter-projects-copy">
                <p>We also finally set up our long-pending website! :)</p>
                <p>Outside of work, I found myself getting back to people sketching.</p>
                <p>
                  I also made time to paint just for myself. It&apos;s oddly difficult to
                  decide what to make when there&apos;s no brief, but I&apos;m getting ideas!
                  My idea book is helping here big time.
                </p>
              </div>
            </div>

            <img
              className="newsletter-wolves"
              src="/images/newsletter/newsletter-wolves.png"
              alt=""
              aria-hidden="true"
            />
          </section>

          <section className="newsletter-radar-next" aria-labelledby="radar-title">
            <img
              className="newsletter-barbet"
              src="/images/newsletter/newsletter-barbet.png"
              alt=""
              aria-hidden="true"
            />

            <div className="newsletter-radar">
              <h2 id="radar-title">On our radar</h2>
              <p>Here are some exciting happenings from the art world:</p>
              <ul>
                {radarItems.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong> - {item.description}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="newsletter-books" aria-label="Books and references">
              <img
                className="newsletter-book newsletter-book-paper"
                src="/images/newsletter/newsletter-paper-gardens.png"
                alt="Paper Gardens exhibition artwork"
              />
              <img
                className="newsletter-book newsletter-book-summer"
                src="/images/newsletter/newsletter-summer-scribbles.png"
                alt="Summer Scribbles"
              />
              <img
                className="newsletter-book newsletter-book-bird"
                src="/images/newsletter/newsletter-bird-nest-egg.png"
                alt="Bird, Nest & Egg book cover"
              />
            </aside>

            <div className="newsletter-next-wrap">
              <section className="newsletter-next" aria-labelledby="next-title">
                <h2 id="next-title">What&apos;s next</h2>
                <p>
                  In the next three months, we&apos;re gearing up for the launch of the L
                  Street community project, shaping ideas for our 2027 calendars, and step
                  into a few logo projects. Looking forward to sharing those updates as
                  well!
                </p>
              </section>

              <section className="newsletter-wrap" aria-labelledby="wrap-title">
                <h2 id="wrap-title">Wrapping up</h2>
                <p>
                  That&apos;s it for this quarter. If you liked what you saw, or just want
                  to discuss something over a coffee, come say hi! -
                  <a href="mailto:smita@studiomintleaf.in"> smita@studiomintleaf.in</a>
                </p>
              </section>
            </div>
          </section>
        </main>

        <footer className="newsletter-footer">
          <img
            className="newsletter-footer-monogram"
            src="/images/newsletter/newsletter-monogram.svg"
            alt=""
            aria-hidden="true"
          />
          <span>studiomintleaf.in</span>
        </footer>
      </article>
    </div>
  )
}

export default NewsletterPage
