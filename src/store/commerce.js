/**
 * Pricing for the Art Card collection.
 *
 * Cards are not priced individually — an order is priced by how many cards it
 * contains, using bundle tiers. That has one consequence worth stating loudly:
 * **there is no such thing as a line price.** A card's cost depends on what
 * else is in the basket, so the UI must never print "₹99" next to one card and
 * then charge something else at the bottom.
 *
 * The engine below computes the *cheapest* combination of bundles for any
 * count, always in the buyer's favour, and can say what one or two more cards
 * would do. Nudges are expressed in cards, not rupees — nobody adds ₹47 of
 * anything, but they will happily add one more bird.
 */

// -------------------------------------------------------------------- money

const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/** ₹250 — display only. Never parse this back into a number. */
export const formatINR = (rupees) => INR.format(rupees)

/** Razorpay and every Indian gateway want the smallest unit. */
export const toPaise = (rupees) => Math.round(rupees * 100)

// ------------------------------------------------------------------ bundles

export const TIERS = [
  { size: 1, price: 99, label: 'Single', blurb: 'One card' },
  { size: 3, price: 250, label: 'Trio', blurb: 'Any three' },
  { size: 6, price: 400, label: 'Half dozen', blurb: 'Any six' },
  { size: 12, price: 650, label: 'Full dozen', blurb: 'Any twelve' },
]

export const BEST_VALUE_TIER = 12

/** Per-card price for a tier, for the "₹54 a card" line that makes value legible. */
export const perCard = (tier) => Math.round(tier.price / tier.size)

export const FREE_SHIPPING_OVER = 500
export const SHIPPING_FLAT = 60

const MAX_COUNT = 240 // 10 per card × 24 cards, with room for the collection to grow

/**
 * Cheapest combination of bundles for n cards, by exhaustive DP.
 *
 * Greedy would be wrong: nine cards greedily is 6+3 (₹650), which happens to
 * tie, but ten cards greedily is 6+3+1 (₹749) when the honest answer is to
 * tell the buyer that twelve cost ₹650. DP finds the floor; nextTierNudge()
 * below handles the "buy more, pay less" case that DP can't express.
 */
const table = [{ total: 0, use: null }]

const solve = (n) => {
  for (let i = table.length; i <= n; i++) {
    let best = null
    for (const tier of TIERS) {
      if (tier.size > i) continue
      const total = table[i - tier.size].total + tier.price
      if (!best || total < best.total) best = { total, use: tier }
    }
    table[i] = best
  }
  return table[n]
}

/**
 * @returns {{ count, total, bundles: [{tier, count}], perCard }}
 */
export const priceFor = (count) => {
  const n = Math.max(0, Math.min(MAX_COUNT, Math.floor(count)))
  if (n === 0) return { count: 0, total: 0, bundles: [], perCard: 0 }

  solve(n)

  const bundles = []
  let remaining = n
  while (remaining > 0) {
    const tier = table[remaining].use
    const existing = bundles.find((b) => b.tier.size === tier.size)
    if (existing) existing.count += 1
    else bundles.push({ tier, count: 1 })
    remaining -= tier.size
  }
  bundles.sort((a, b) => b.tier.size - a.tier.size)

  const total = table[n].total
  return { count: n, total, bundles, perCard: Math.round(total / n) }
}

/**
 * "Add two more and pay less." Looks a short way ahead for a count that costs
 * the same or less than the current one — the moment a bigger bundle becomes
 * the cheaper way to buy.
 *
 * A saving of zero is still worth saying: at nine cards, three more are free.
 */
export const nextTierNudge = (count) => {
  if (count <= 0) return null
  const current = priceFor(count).total
  const horizon = Math.max(...TIERS.map((t) => t.size))

  for (let m = count + 1; m <= count + horizon; m++) {
    const total = priceFor(m).total
    if (total <= current) {
      return { addCards: m - count, newCount: m, newTotal: total, saving: current - total }
    }
  }
  return null
}

/** How many more cards until shipping is free, or null if it already is. */
export const freeShippingNudge = (count) => {
  const current = priceFor(count).total
  if (current > FREE_SHIPPING_OVER) return null
  for (let m = count + 1; m <= count + 12; m++) {
    if (priceFor(m).total > FREE_SHIPPING_OVER) return { addCards: m - count, newCount: m }
  }
  return null
}

// ----------------------------------------------------------------- dispatch

/**
 * The shop opens on Ganesha Chaturthi. Until then the catalogue is browsable
 * and the collection tray still works, but nothing can be paid for — see
 * CartPage and the /shop/checkout route.
 */
export const SHOP_OPENS = new Date(2026, 8, 14)   // 14 September 2026

export const SHOP_OPENS_LABEL = 'Ganesha Chaturthi, 14 September 2026'

// ------------------------------------------------------------- payment gate

/**
 * The shop takes money only when BOTH are true:
 *
 *   1. a Razorpay key is configured (VITE_RAZORPAY_KEY_ID), and
 *   2. the shop has opened — or this is a preview build.
 *
 * Two conditions, deliberately. The key alone would open the live shop the
 * moment it was deployed, which could be days before the announced date. The
 * date alone would open a checkout with no gateway behind it. The preview
 * bypass is the whole point: it lets the studio put a real payment through on
 * the review URL before opening day without the live site following suit.
 *
 * With no key the shop stays exactly as it is today — browsable, basket saves,
 * checkout unreachable — so merging this changes nothing until a key is set.
 */
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || ''

export const PAYMENTS_CONFIGURED = Boolean(RAZORPAY_KEY_ID)

/** Razorpay test keys start rzp_test_, live ones rzp_live_. */
export const IS_TEST_KEY = RAZORPAY_KEY_ID.startsWith('rzp_test_')

/**
 * Anything that is not the production build ignores the opening date, so the
 * dev server and the review deploy can both put a payment through before the
 * 14th. Only the real site waits for the day.
 *
 * Read directly rather than importing IS_PREVIEW from the badge component —
 * this module sits under the UI and should not reach up into it.
 */
const BEFORE_OPENING_OK = import.meta.env.DEV || import.meta.env.VITE_PREVIEW === '1'

export const isShopOpen = (now = new Date()) => now >= SHOP_OPENS

export const canCheckout = (now = new Date()) =>
  PAYMENTS_CONFIGURED && (isShopOpen(now) || BEFORE_OPENING_OK)

/**
 * Orders go out in one batch a month, on the 26th. Saying *which day* turns a
 * delay into a plan — "ships once a month" reads as an excuse, "packed on the
 * 26th" reads as a studio that knows what it is doing.
 *
 * Never quotes a date before the shop opens: the first batch cannot go out
 * ahead of the first order.
 */
const BATCH_DAY = 26

export const nextDispatch = (now = new Date(), opens = SHOP_OPENS) => {
  const from = now > opens ? now : opens
  // this month's batch if it is still ahead of us, otherwise next month's
  const date = from.getDate() < BATCH_DAY
    ? new Date(from.getFullYear(), from.getMonth(), BATCH_DAY)
    : new Date(from.getFullYear(), from.getMonth() + 1, BATCH_DAY)
  return {
    date,
    label: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' }),
    long: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  }
}

// ------------------------------------------------------------------- orders

/** SM-2607-4F2A — short enough to read out on a phone call. */
export const generateOrderId = (now, random) => {
  const yy = String(now.getFullYear()).slice(2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const suffix = random.toString(36).toUpperCase().slice(-4).padStart(4, '0')
  return `SM-${yy}${mm}-${suffix}`
}

// --------------------------------------------------------------------- tax

/**
 * Displayed prices include GST where applicable. Registering later must change
 * how the invoice splits, never what the buyer pays. HSN 4909 covers printed
 * cards; confirm with the accountant before the first registered invoice.
 */
export const GST_POSITION = {
  registered: false,
  inclusive: true,
  hsn: '4909',
  note: 'Prices include GST where applicable. Confirm HSN and rate with the accountant before the first registered invoice.',
}

// ----------------------------------------------------------------- summary

/**
 * Turn cart lines into everything the tray, the cart, the packing slip and the
 * GA4 purchase event need. One function so the four never disagree.
 *
 * `cardsBySlug` is passed in rather than imported so this module stays free of
 * the catalog and remains trivially testable.
 */
export const summarise = (lines, cardsBySlug) => {
  const present = lines
    .map((line) => ({ card: cardsBySlug[line.slug], quantity: line.quantity }))
    .filter((l) => l.card) // catalog changed under a stale basket

  const count = present.reduce((n, l) => n + l.quantity, 0)
  const pricing = priceFor(count)
  const shipping = count === 0 || pricing.total > FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT

  /**
   * `price` is the effective bundle rate, not ₹99. There is no line price
   * under tiered pricing, and GA4 multiplies price × quantity to reconcile
   * against `value` — reporting the list price would overstate revenue on
   * every order above a single card.
   */
  const items = present.map(({ card, quantity }) => ({
    slug: card.slug,
    name: card.name,
    scientific: card.scientific,
    art: card.art,
    theme: card.theme,
    tint: card.tint,
    quantity,
    sku: card.slug,
    title: card.name,
    variantLabel: card.scientific,
    category: card.group,
    price: pricing.perCard,
  }))

  return {
    items,
    count,
    distinct: items.length,
    subtotal: pricing.total,
    bundles: pricing.bundles,
    perCard: pricing.perCard,
    shipping,
    shippingWaived: count > 0 && shipping === 0,
    total: pricing.total + shipping,
    tierNudge: nextTierNudge(count),
    shippingNudge: freeShippingNudge(count),
  }
}
