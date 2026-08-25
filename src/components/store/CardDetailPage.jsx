import React, { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { cardsBySlug, CARDS, COLLECTION } from '../../store/catalog'
import { formatINR, TIERS, nextDispatch } from '../../store/commerce'
import { trackViewItem } from '../../store/analytics'
import { useCart } from '../../store/CartContext'
import ArtCard, { CardStepper } from './ArtCard'
import { Breadcrumbs } from './StoreUI'
import './store.css'

const SITE = 'https://studiomintleaf.in'

/**
 * A page per species.
 *
 * The grid sells; this page is what a WhatsApp forward or a search result
 * lands on, so it shows both faces at once rather than making a first-time
 * visitor read about the species. The reverse stays unseen until the card
 * itself arrives.
 */
const CardDetailPage = () => {
  const { cardSlug } = useParams()
  const card = cardsBySlug[cardSlug]
  const { quantityOf, add, setQuantity } = useCart()
  const dispatchDate = nextDispatch()

  useEffect(() => {
    if (!card) return
    trackViewItem({
      sku: card.slug,
      title: card.name,
      variantLabel: card.scientific,
      category: card.group,
      price: 99,
    })
  }, [card])

  if (!card) return <Navigate to="/shop" replace />

  const quantity = quantityOf(card.slug)
  const others = CARDS.filter((c) => c.slug !== card.slug).slice(0, 4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${card.name} Art Card`,
    sku: card.slug,
    description: card.fact,
    image: `${SITE}${card.art}`,
    brand: { '@type': 'Brand', name: 'Studio Mintleaf' },
    category: card.group,
    offers: {
      '@type': 'Offer',
      price: 99,
      priceCurrency: 'INR',
      url: `${SITE}/shop/card/${card.slug}`,
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <div className="store-root">
      <Helmet>
        <title>{`${card.name} Art Card — Studio Mintleaf`}</title>
        <meta name="description" content={card.fact.slice(0, 155)} />
        <link rel="canonical" href={`${SITE}/shop/card/${card.slug}`} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${card.name} — Studio Mintleaf Art Card`} />
        <meta property="og:description" content={card.fact.slice(0, 200)} />
        <meta property="og:url" content={`${SITE}/shop/card/${card.slug}`} />
        <meta property="og:image" content={`${SITE}/images/og/cards/${card.slug}.png`} />
        <meta property="product:price:amount" content="99" />
        <meta property="product:price:currency" content="INR" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="sm-shell detail">
        <Breadcrumbs
          trail={[
            { label: 'Shop', to: '/shop' },
            { label: COLLECTION.name, to: '/shop' },
            { label: card.name },
          ]}
        />

        <div className="detail__grid">
          {/* Both faces, laid out flat — the way you would put the card down
              on a table to show someone. */}
          <motion.div
            className="detail__faces"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="detail__face detail__face--front"
              data-theme={card.theme}
              style={{ '--tint': card.tint }}
            >
              <img src={card.art} alt={`${card.name} art card, front`} />
            </div>
          </motion.div>

          <div className="detail__buy">
            <span className="detail__group">{card.group}</span>
            <h1 className="detail__title">{card.name}</h1>
            <p className="detail__sci">{card.scientific}</p>

            <p className="detail__note">{card.note}</p>

            <div className="detail__pricebox">
              <div className="detail__pricerow">
                <span className="detail__price">{formatINR(99)}</span>
                <span className="detail__pricemeta">a single card · incl. taxes</span>
              </div>
              <p className="detail__tierline">
                Collect more and the rate drops —{' '}
                {TIERS.slice(1)
                  .map((t) => `${t.size} for ${formatINR(t.price)}`)
                  .join(', ')}
                .
              </p>
              <CardStepper
                quantity={quantity}
                onAdd={() => add(card)}
                onSet={(q) => setQuantity(card.slug, q)}
              />
              {quantity > 0 && (
                <Link to="/shop/cart" className="sm-textlink">
                  Review your collection →
                </Link>
              )}
            </div>

            <dl className="detail__specs">
              {COLLECTION.specs.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>
                    {spec.value}
                    {spec.label === 'Shipped' && ` · next batch ${dispatchDate.label}`}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <section className="shop-block">
          <header className="sm-sectionhead">
            <div>
              <h2 className="sm-sectionhead__title">Also in the collection</h2>
            </div>
            <Link to="/shop" className="sm-textlink">
              See all {CARDS.length} →
            </Link>
          </header>
          <div className="shop-grid">
            {others.map((c, i) => (
              <ArtCard key={c.slug} card={c} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default CardDetailPage
