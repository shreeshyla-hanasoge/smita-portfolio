/**
 * GA4 ecommerce events (E9.4).
 *
 * These replace E6's single `shop_buy_click`. The parameter names are GA4's,
 * not ours — `items`, `value`, `currency` are what the ecommerce reports read.
 * Renaming any of them silently empties the revenue report, so don't.
 *
 * gtag is loaded directly in index.html; react-ga4 wraps the same queue. We
 * call gtag so the nested `items` array survives — react-ga4's event() flattens
 * parameters and would drop it.
 */

const gtag = (...args) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag(...args)
}

const CURRENCY = 'INR'

/** GA4 item shape, built once so every event agrees. */
export const toGaItem = (item, index = 0) => ({
  item_id: item.sku,
  item_name: item.title,
  item_variant: item.variantLabel,
  item_category: item.category,
  price: item.price,
  quantity: item.quantity ?? 1,
  index,
})

export const trackViewItem = (item) =>
  gtag('event', 'view_item', {
    currency: CURRENCY,
    value: item.price,
    items: [toGaItem(item)],
  })

export const trackViewItemList = (items, listName) =>
  gtag('event', 'view_item_list', {
    item_list_name: listName,
    items: items.map(toGaItem),
  })

export const trackAddToCart = (item) =>
  gtag('event', 'add_to_cart', {
    currency: CURRENCY,
    value: item.price * (item.quantity ?? 1),
    items: [toGaItem(item)],
  })

export const trackRemoveFromCart = (item) =>
  gtag('event', 'remove_from_cart', {
    currency: CURRENCY,
    value: item.price * (item.quantity ?? 1),
    items: [toGaItem(item)],
  })

export const trackViewCart = (summary) =>
  gtag('event', 'view_cart', {
    currency: CURRENCY,
    value: summary.subtotal,
    items: summary.items.map(toGaItem),
  })

export const trackBeginCheckout = (summary) =>
  gtag('event', 'begin_checkout', {
    currency: CURRENCY,
    value: summary.subtotal,
    items: summary.items.map(toGaItem),
  })

export const trackAddShippingInfo = (summary, zoneId) =>
  gtag('event', 'add_shipping_info', {
    currency: CURRENCY,
    value: summary.subtotal,
    shipping_tier: zoneId,
    items: summary.items.map(toGaItem),
  })

/**
 * Fired once, on the success page, keyed by transaction_id. GA4 dedupes on
 * that key — which is what stops a buyer refreshing the confirmation page
 * from inflating revenue.
 */
export const trackPurchase = (orderId, summary) =>
  gtag('event', 'purchase', {
    transaction_id: orderId,
    currency: CURRENCY,
    value: summary.total,
    shipping: summary.shipping,
    items: summary.items.map(toGaItem),
  })

/** Not a GA4 standard event — our own funnel-leak marker. */
export const trackCheckoutFailure = (reason) =>
  gtag('event', 'checkout_failure', { reason })
