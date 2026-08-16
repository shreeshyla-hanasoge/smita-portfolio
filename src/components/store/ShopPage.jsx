import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { COLLECTION, CARDS, GROUPS, cardsInGroup, HERO_CARD } from '../../store/catalog'
import {
  TIERS,
  formatINR,
  BEST_VALUE_TIER,
  FREE_SHIPPING_OVER,
  SHIPPING_FLAT,
  nextDispatch,
} from '../../store/commerce'
import { trackViewItemList } from '../../store/analytics'
import ArtCard, { CardBack } from './ArtCard'
import './store.css'

const SITE = 'https://studiomintleaf.in'

const ShopPage = () => {
  const [group, setGroup] = useState('All')
  const dispatchDate = nextDispatch()
  const visible = cardsInGroup(group)

  useEffect(() => {
    trackViewItemList(
      CARDS.map((c) => ({
        sku: c.slug,
        title: c.name,
        variantLabel: c.scientific,
        category: c.group,
        price: 99,
      })),
      'art_cards_collection'
    )
  }, [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    name: 'Studio Mintleaf Art Cards',
    description: COLLECTION.intro,
    url: `${SITE}/shop`,
    brand: { '@type': 'Brand', name: 'Studio Mintleaf' },
    hasVariant: CARDS.map((c) => ({
      '@type': 'Product',
      name: `${c.name} Art Card`,
      sku: c.slug,
      url: `${SITE}/shop/card/${c.slug}`,
      image: `${SITE}${c.art}`,
      offers: {
        '@type': 'Offer',
        price: 99,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
      },
    })),
  }

  return (
    <div className="store-root">
      <Helmet>
        <title>Art Cards — Studio Mintleaf</title>
        <meta
          name="description"
          content="Illustrated art cards of Indian wildlife and plants. An original painting on the front, the story of the species on the reverse. ₹99 a card, printed and packed in Bangalore."
        />
        <link rel="canonical" href={`${SITE}/shop`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Art Cards — Studio Mintleaf" />
        <meta
          property="og:description"
          content="An original painting on the front, the story of the species on the reverse."
        />
        <meta property="og:url" content={`${SITE}/shop`} />
        <meta property="og:image" content={`${SITE}/images/og/shop.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* ------------------------------------------------------------- hero */}
      <header className="shop-hero">
        <div className="sm-shell shop-hero__grid">
          <div>
            <motion.p
              className="shop-hero__eyebrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {COLLECTION.eyebrow}
            </motion.p>
            <motion.h1
              className="shop-hero__title"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {COLLECTION.title}
            </motion.h1>
            <motion.p
              className="shop-hero__lede"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
            >
              {COLLECTION.lede}
            </motion.p>
            <motion.p
              className="shop-hero__intro"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.14 }}
            >
              {COLLECTION.intro} {COLLECTION.invitation}
            </motion.p>
          </div>

          {/* A card, turned, doing the explaining that a paragraph would do
              worse. It is the only place on the page that shows both faces. */}
          <motion.div
            className="shop-hero__demo"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            aria-hidden="true"
          >
            <div
              className="shop-hero__demofront"
              data-theme={HERO_CARD.theme}
              style={{ '--tint': HERO_CARD.tint }}
            >
              <img src={HERO_CARD.art} alt="" />
            </div>
            {/* An actual card, not a caption about one. Both faces at the same
                proportions, so the hero shows the product rather than
                describing it. */}
            <div className="shop-hero__demoback">
              <CardBack card={HERO_CARD} showLink={false} />
            </div>
          </motion.div>
        </div>
      </header>

      {/* ------------------------------------------------------------ specs */}
      <section className="sm-shell shop-specs" aria-label="About the art cards">
        {COLLECTION.specs.map((spec, i) => (
          <motion.div
            className="shop-spec"
            key={spec.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <span className="shop-spec__label">{spec.label}</span>
            <span className="shop-spec__value">{spec.value}</span>
            <span className="shop-spec__detail">
              {spec.label === 'Shipped' ? `Next batch ${dispatchDate.label}` : spec.detail}
            </span>
          </motion.div>
        ))}
      </section>

      {/* ------------------------------------------------------------ tiers */}
      <section className="sm-shell shop-block" aria-labelledby="pricing-head">
        <header className="sm-sectionhead">
          <div>
            <h2 className="sm-sectionhead__title" id="pricing-head">
              The more you collect
            </h2>
            <p className="sm-sectionhead__sub">
              Mix any species you like — the price follows how many cards are in the order, not
              which ones.
            </p>
          </div>
        </header>

        {/* Set as type, not as cards. Four boxed panels made a simple price
            list look like four things to choose between; it is one price list
            read left to right. A definition list is also what it actually is —
            quantity, then what that quantity costs. */}
        <motion.dl
          className="shop-tiers"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          {TIERS.map((tier) => (
            <div className="shop-tier" key={tier.size}>
              <dt>{tier.blurb}</dt>
              <dd>
                {formatINR(tier.price)}
                {tier.size === BEST_VALUE_TIER && (
                  <span className="shop-tier__best">best value</span>
                )}
              </dd>
            </div>
          ))}
        </motion.dl>

        <p className="sm-note">
          Shipping is a flat {formatINR(SHIPPING_FLAT)} anywhere in India, and free once the order
          passes {formatINR(FREE_SHIPPING_OVER)}. Orders are packed and posted in one batch a month
          — the next goes out on <strong>{dispatchDate.long}</strong>.
        </p>
      </section>

      {/* ----------------------------------------------------------- the grid */}
      <section className="sm-shell shop-block" aria-labelledby="collection-head">
        <header className="sm-sectionhead">
          <div>
            <h2 className="sm-sectionhead__title" id="collection-head">
              {CARDS.length} cards, so far
            </h2>
            <p className="sm-sectionhead__sub">
              Turn a card over to read what is on the back of it.
            </p>
          </div>
          <div className="shop-filters" role="group" aria-label="Filter by group">
            {GROUPS.map((g) => (
              <button
                key={g}
                className={`shop-filter ${g === group ? 'is-active' : ''}`}
                onClick={() => setGroup(g)}
                aria-pressed={g === group}
              >
                {g}
              </button>
            ))}
          </div>
        </header>

        <div className="shop-grid">
          {visible.map((card, i) => (
            <ArtCard key={card.slug} card={card} index={i} />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- studio */}
      <section className="sm-shell shop-block">
        <div className="shop-studio">
          <div className="shop-studio__panel">
            <h2>Something bigger in mind?</h2>
            <p>
              Commissions, a species that matters to your organisation, an illustrated field guide,
              a set of cards for a reserve or a school — the studio takes on a small number of
              custom projects each quarter.
            </p>
            <Link to="/#contact" className="sm-btn sm-btn--ghost">
              Send an enquiry
            </Link>
          </div>
          <div className="shop-studio__panel shop-studio__panel--quiet">
            <h2>New cards, four times a year</h2>
            <p>
              Each quarterly letter carries what the studio has been painting, what is going into
              the next batch of cards, and the field notes behind them.
            </p>
            <Link to="/newsletter" className="sm-btn sm-btn--ghost">
              Read the latest letter
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ShopPage
