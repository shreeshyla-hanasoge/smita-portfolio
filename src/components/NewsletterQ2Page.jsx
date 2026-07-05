import React from 'react'
import { Helmet } from 'react-helmet-async'
import NewsletterArchive from './NewsletterArchive'
import './NewsletterQ2Page.css'

const NewsletterQ2Page = () => {
  return (
    <div className="newsletter-page nlq2">
      <Helmet>
        <title>Field Notes From The Studio | Q2 2026</title>
        <meta
          name="description"
          content="Studio Mintleaf quarterly newsletter for April to June 2026."
        />
        <meta property="og:title" content="Field Notes From The Studio | Q2 2026" />
        <meta
          property="og:description"
          content="Studio Mintleaf quarterly newsletter for April to June 2026."
        />
        <meta
          property="og:image"
          content="https://studiomintleaf.in/images/newsletter/q2/q2-kingfisher.png"
        />
        <meta property="og:url" content="https://studiomintleaf.in/newsletter/q2-2026" />
        <meta property="og:type" content="article" />
        <meta name="twitter:title" content="Field Notes From The Studio | Q2 2026" />
        <meta
          name="twitter:description"
          content="Studio Mintleaf quarterly newsletter for April to June 2026."
        />
        <meta
          name="twitter:image"
          content="https://studiomintleaf.in/images/newsletter/q2/q2-kingfisher.png"
        />
        <link rel="canonical" href="https://studiomintleaf.in/newsletter/q2-2026" />
      </Helmet>

      <NewsletterArchive currentId="q2-2026" />

      <article className="newsletter-article">
        <header className="newsletter-header">
          <div className="newsletter-header-copy">
            <h1>Field Notes From The Studio</h1>
            <p>Updates from Apr-Jun&apos;26</p>
          </div>
          <img
            className="newsletter-header-logo"
            src="/images/newsletter/newsletter-logo.svg"
            alt="Studio Mintleaf"
          />
        </header>

        <main className="newsletter-main">
          {/* Artist's note */}
          <section className="nlq2-note" aria-labelledby="q2-note-title">
            <figure className="nlq2-note-portrait">
              <img src="/images/newsletter/q2/q2-portrait.svg" alt="Portrait of Smita" />
            </figure>

            <div className="nlq2-note-copy">
              <h2 id="q2-note-title">Artist&apos;s note</h2>
              <p>
                AI is everywhere today &ndash; in your glasses, in the kids&apos; toys and
                even in your shoes &ndash; but not in my artwork. While I may use AI to
                understand some technicalities or figure out the best way to do something, it
                does not make the artwork you see bearing the Studio Mintleaf label. Creating
                art is what gives me greatest joy, and that part I will never outsource to AI.
              </p>
            </div>

            <img
              className="nlq2-kingfisher"
              src="/images/newsletter/q2/q2-kingfisher.png"
              alt="Blue-toned illustration of a kingfisher"
            />
          </section>

          {/* Projects */}
          <section className="nlq2-projects" aria-labelledby="q2-projects-title">
            <h2 id="q2-projects-title">Projects</h2>

            <div className="nlq2-projects-top">
              <figure className="nlq2-lstreet">
                <img
                  src="/images/newsletter/q2/q2-lstreet-board.jpg"
                  alt="L Street interpretation board on urban flora and fauna"
                />
              </figure>

              <ul className="nlq2-list">
                <li>
                  <strong>L Street Interpretation Boards</strong>
                  <p>
                    The L Street interpretation boards were launched with a small community
                    event celebrating everyone who helped create this interactive public
                    space. This project is very special and can be seen in person near St
                    John&apos;s Hospital, Koramangala (Bangalore). Let me know if you would
                    like to visit.
                  </p>
                </li>
                <li>
                  <strong>Wild Cats Posters</strong>
                  <p>
                    The wild cats posters were printed this quarter and were well received
                    after being distributed by the client.
                  </p>
                </li>
              </ul>
            </div>

            <div className="nlq2-photo-row">
              <img src="/images/newsletter/q2/q2-talk.jpg" alt="Community talk on living landscapes" />
              <img
                src="/images/newsletter/q2/q2-rubber-board.jpg"
                alt="Rubber tree interpretation board"
              />
              <img
                src="/images/newsletter/q2/q2-tulip-board.jpg"
                alt="African Tulip Tree interpretation board"
              />
            </div>

            <div className="nlq2-projects-bottom">
              <div className="nlq2-projects-bottom-left">
                <figure className="nlq2-spider-poster">
                  <img
                    src="/images/newsletter/q2/q2-jumping-spider-poster.jpg"
                    alt="Pantropical Jumping Spider illustration poster"
                  />
                </figure>
                <figure className="nlq2-framed">
                  <img
                    src="/images/newsletter/q2/q2-framed-print.jpg"
                    alt="Framed bird artwork displayed on an easel"
                  />
                </figure>
              </div>

              <ul className="nlq2-list nlq2-list-bottom">
                <li>
                  <strong>Bangalore Sticker Packs (Personal Project)</strong>
                  <p>
                    I&apos;ve been working on sticker packs featuring the inhabitants of
                    Bangalore&apos;s gardens. It&apos;s been a fun way to learn more about the
                    creatures that live around us &mdash; from pollinators to tiny hunters.
                  </p>
                </li>
                <li>
                  <strong>Indian Chameleon Outreach</strong>
                  <p>
                    I developed outreach material on the Indian chameleon for Trustoree Media.
                    It was great working with researcher &amp; content writer Ashritha Anoop. I
                    was in charge of printing as well (which is not always the case), so it was
                    fun to play around with prototypes.
                  </p>
                </li>
                <li>
                  <strong>Prints for a Special Gift</strong>
                  <p>
                    Some of my artworks were chosen as a gift for someone special. Let me know
                    if you&apos;d like some artwork commissioned, and we can discuss it over
                    coffee!
                  </p>
                </li>
              </ul>

              <figure className="nlq2-chameleon">
                <img
                  src="/images/newsletter/q2/q2-chameleon-poster.jpg"
                  alt="The Indian Chameleon — Why This Reptile Matters poster"
                />
              </figure>
            </div>
          </section>

          {/* What's next + Wrapping up, with the spider spanning both on the right */}
          <div className="nlq2-closing">
            <div className="nlq2-closing-copy">
              <section className="nlq2-next" aria-labelledby="q2-next-title">
                <h2 id="q2-next-title">What&apos;s next</h2>
                <p>
                  Planning a trip to some beautiful tropical islands, hoping to get some
                  sketching done! Will share some artwork in the next newsletter!
                </p>
              </section>

              <section className="nlq2-wrap" aria-labelledby="q2-wrap-title">
                <h2 id="q2-wrap-title">Wrapping up</h2>
                <p>
                  That&apos;s it for this quarter. If you liked what you saw, or just want to
                  discuss something over a coffee, come say hi! &ndash;
                  <a href="mailto:smita@studiomintleaf.in"> smita@studiomintleaf.in</a>
                </p>
              </section>
            </div>

            <img
              className="nlq2-peacock-spider"
              src="/images/newsletter/q2/q2-spider-peacock.png"
              alt="Colourful peacock jumping spider illustration"
            />
          </div>
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

export default NewsletterQ2Page
