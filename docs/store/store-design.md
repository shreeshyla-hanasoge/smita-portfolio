# Shop design — E9, Art Card collection

Design for the Studio Mintleaf shop. Covers E9.2 through E9.6; the stack decision lives in
[E9.1-commerce-architecture.md](./E9.1-commerce-architecture.md).

A clickable prototype of everything marked **Built** below is in this branch — run
`npm run dev` and open `/shop`.

---

## 1. What the product is

One line, many species. An art card is 3.5 × 4 inches, ₹99, with an original painting on
the front and the story of that species on the reverse. There are no sizes, no framing
options and no stock levels. The only variable in an order is **how many cards**, and the
price follows that:

| | Price | Per card |
| --- | --- | --- |
| One card | ₹99 | ₹99 |
| Any three | ₹250 | ₹83 |
| Any six | ₹400 | ₹67 |
| Any twelve | ₹650 | ₹54 |

Free shipping above ₹500, flat ₹60 below it. Posted in one batch a month.

Every design decision below falls out of that shape.

---

## 2. The design idea

Three things follow from a collectible card sold by the handful.

**The card is the interface.** Not a photo of a product — the card itself, at its real
proportions (7:8), rendered from the studio's own print-ready front. An earlier iteration
composed the front in the browser from a tint, the illustration and a name plate; the real
cards move the title block to suit each piece — top for the barbet, bottom for the tulip —
so composing it meant redrawing the studio's design badly. One image is more faithful and
less code. Adding a species is one artwork file and one catalog entry.

**It flips.** The whole product is an illustration on one side and a piece of natural
history on the other, so the interface lets you do the thing you would do holding it. The
hero shows both faces once, laid out flat, so nobody has to discover the gesture to
understand what they are buying. The printed card carries a QR to the species page; on the
web that would be silly, so the reverse links instead.

**Buying is picking, not adding.** There is no "add to cart" step. The steppers on the
grid write straight to the basket, so the basket *is* the collection being built, and the
tray at the bottom of the screen keeps score. This removes a whole page from the flow.

### The type rule

> **Fraunces carries the voice. Barlow carries the money.**

Page titles and section heads are set in Fraunces, matching `/services`. Prices, counts,
per-card rates, specs, totals, form labels and errors are Barlow with tabular figures —
on this shop the numbers are doing argumentative work, so they have to be read
accurately, and a display face is not where accuracy lives.

The voice face was Reenie Beanie until `/services` landed. Its stylesheet describes
itself as "tokens and layout from the approved style tile", which makes it the newest
word on what this site looks like, so the shop follows it rather than the older
portfolio pages. That switch is not only a font swap: Reenie Beanie is handwriting and
had to be set enormous to read at all (the hero ran at 5.2rem), where Fraunces carries
the same weight at 56px. Every heading in the shop was re-scaled to the Services scale
rather than merely re-faced.

### Tokens

Scoped to `.store-root` (and `.tray`, which mounts at the app root) in
`src/components/store/store.css`. **The values mirror the `--sv-*` tokens in
`ServicesPage.css`, which is the source of truth — change them together.**

| Token | Value | Mirrors | Use |
| --- | --- | --- | --- |
| `--sm-serif` | `Fraunces, Georgia, serif` | `--sv-serif` | Headings |
| `--sm-paper` | `#F6F5EF` | `--sv-paper-tint` | Page |
| `--sm-surface` | `#FFFFFF` | `--sv-paper` | Card reverse, panels, forms |
| `--sm-sunk` | `#ECEFE3` | `--sv-sage` | Bundle breakdown, nudges |
| `--sm-ink` | `#26291F` | `--sv-ink` | Headings, primary buttons |
| `--sm-ink-soft` / `--sm-ink-faint` | `#43473D` / `#83867A` | `--sv-body` / `--sv-muted` | Body, meta |
| `--sm-mint` / `--sm-mint-deep` | `#4F7A3E` / `#3E5C33` | `--sv-green` / `--sv-green-deep` | Accent / accent text |
| `--sm-warn` | `#B0713F` | `--sv-ochre` | Errors |
| `--sm-rule` | `#E3E2D9` | `--sv-line` | Hairlines |
| `--card-ratio` | `7 / 8` | — | The physical card, everywhere |

The token names stayed `--sm-mint*` after the colour became the Services green, so the
diff reads as a palette change rather than a rename touching every rule. Worth
correcting if the two pages are ever merged onto one shared token file.

Primary buttons are ink rather than green — on a page made of artwork, a coloured button
competes with the work; a dark one doesn't.

### Front supplied, back composed

```
front ───────►  the studio's artwork, 1050 × 1200 (7:8 at 300dpi), rendered whole
                title, scientific name and monogram are already set in it
back  ───────►  composed: the fact with the species name bold, then the lockup
turn button ─►  top right, over the artwork
```

The split is deliberate. The **front** is design work that belongs to the studio and
varies per card, so the site renders it and gets out of the way. The **back** is the same
template every time, so composing it means a new card needs one artboard rather than two —
and the writing stays real text: selectable, searchable, readable by a screen reader, and
editable without reopening a design file.

Two details the printed back does that the web back should not. It carries a QR to the
species page — pointless on a device already showing the page, so the web back links
instead. And it uses the full logo lockup at 300dpi, which collapses into itself at 250px,
so the web back uses the monogram with the studio name set in type.

`tint` is sampled from each artwork's own background. Nothing is drawn on top of it; it is
there so thumbnails and loading states sit on the card's colour instead of flashing white.

---

## 3. Information architecture

```
/shop                     the collection — hero, specs, tiers, grid, studio panels
/shop/card/:slug          one species: both faces, the writing, add
/shop/cart                review — bundle breakdown, dispatch date
/shop/checkout            address capture → Razorpay
/shop/order/success       confirmation (fires GA4 purchase, clears the basket)
/shop/order/failed        payment failure, basket intact
/store/*                  → redirect to /shop (earlier iteration's path)
```

Card routes are enumerated from the catalog by `shopRoutes()`, so E3.1 prerendering and
E3.3 sitemap generation both derive from the data file rather than a hand-kept list. Cart,
checkout and order pages are `noindex`.

`/shop` — not `/store` — because E6's payment-link version ships at that URL first, and
QR codes printed on physical cards cannot be redirected later.

Navigation: **Shop** joins the navbar word-list. The basket sits outside it as a count
pill, hidden until it holds something, and outside `.nav-menu`, which is `display: none`
on mobile. A basket you cannot reach from a phone is the one place this site can lose
money.

---

## 4. Pricing — the part worth getting right

### The engine — **Built** (`src/store/commerce.js`)

**There is no such thing as a line price.** A card's cost depends on what else is in the
basket, so the UI must never print ₹99 next to one card and then charge something else at
the bottom. Every surface that shows money derives it from one function.

`priceFor(n)` finds the *cheapest* combination of tiers by dynamic programming, always in
the buyer's favour. Greedy would be wrong: ten cards greedily is 6+3+1 at ₹749 when twelve
cost ₹650.

| Cards | Total | Made of | Per card |
| --- | --- | --- | --- |
| 3 | ₹250 | one trio | ₹83 |
| 5 | ₹448 | trio + 2 singles | ₹90 |
| 6 | ₹400 | one six | ₹67 |
| 9 | ₹650 | six + trio | ₹72 |
| 12 | ₹650 | one dozen | ₹54 |
| 15 | ₹900 | dozen + trio | ₹60 |

Note the shape of that table: **five cards cost more than six, and nine cost the same as
twelve.** That is not a bug in the tiers, it is what tiers do — and it is the single
biggest opportunity in the whole shop.

### The nudge — **Built**

`nextTierNudge(n)` looks a short way ahead for a count that costs the same or less than
the current one, and the tray says so in plain words:

- 5 cards → *"Add 1 more — 6 cards for ₹400, ₹48 less than this"*
- 9 cards → *"Add 3 more at no extra cost — 12 cards is also ₹650"*
- 11 cards → *"Add 1 more — 12 cards for ₹650, ₹198 less than this"*

**Nudges are counted in cards, not rupees.** Nobody adds ₹99 of anything; they will
happily add one more bird. And the nudge only ever fires when it is true — it is computed
from the same engine that charges, so it cannot drift into marketing.

Priority is deliberate: a cheaper total beats free shipping, because "add one and pay
less" is a better sentence than any shipping message. `freeShippingNudge` is the fallback.

### The tray — **Built** (`CollectionTray.jsx`)

Bundle pricing has one failure mode: a buyer picks four cards, sees ₹349 at checkout and
has no idea whether that was a good deal or how it was reached. The tray removes that by
doing the arithmetic out loud, live, while they choose — a stack of what is picked, the
count, the total, the per-card rate, one nudge, and the free-shipping meter along the top
edge.

On mobile it becomes three rows and keeps the nudge, because that is the only place the
tier maths gets explained. It hides itself on the cart and checkout pages, where the real
summary is already on screen.

### Showing the working — **Built** (`BundleBreakdown`)

The cart and checkout both print how the total was reached — *"Any three · 3 cards ₹250"*,
*"2 × One card · 2 cards ₹198"*. Not decoration: with tiered pricing the buyer cannot add
the line items up themselves, so without it the number at the bottom is something to be
taken on faith.

---

## 5. E9.3 — Catalog & shop pages

### The data model — **Built** (`src/store/catalog.js`)

Adding a card is one entry and nothing else. The build reads the same file for routes, the
sitemap, OG images and JSON-LD.

```js
{
  slug, name, scientific, group,
  theme: 'light' | 'dark',   // for anything drawn over the card
  tint: '#B4CCD2',           // sampled from the artwork's own background
  art: '/images/cards/….jpg',// the studio's finished front, 1050 × 1200
  fact: '…',   // printed on the reverse; a predicate — rendered as "The «name» «fact»"
  note: '…',   // the studio's aside, shown only on the card's own page
}
```

`fact` is stored as a predicate rather than a sentence so the back can set the species
name bold inside it, the way the printed card does.

No prices, no stock, no variants — all three would be lies. Price is a function of order
size; a card is printed in runs, so per-card stock is not a number anyone tracks; and
there is only one physical object.

Thirteen species are in, all from the studio's finished card artwork: the Malabar Gliding
Frog (the hero), four birds, five spiders and insects, and three plants. Thirteen is a
useful number — the twelve-card tier can now be filled with twelve *different* species,
which it could not before. The heading reads *"13 cards, so far"* off `CARDS.length`,
turning the catalogue being incomplete into the point ("a growing catalogue", per the
brief).

### The grid — **Built**

Four across on desktop, two on phones down to 330px. Each card: the flip card, then a
museum-style label (name, scientific name), then the control. Chosen cards get a mint ring
and a count badge on the corner, so a scan down the grid shows what has been collected
without reading a number twice.

**The control morphs.** At zero it is an `+ Add` button; from one it becomes a stepper. A
stepper showing "− 0 +" is two dead controls, and the minus is the one people press by
accident.

Group filters (Birds, Mammals, Insects & Spiders, Plants, Botanical Still Life) scroll
horizontally on mobile rather than wrapping into a wall of pills.

### A page per species — **Built** (`CardDetailPage.jsx`)

The grid sells; this page is what a WhatsApp forward or a search result lands on, so it
shows both faces at once rather than making a first-time visitor discover the flip. It
carries `Product` JSON-LD at ₹99 with `InStock`, the studio's note about the piece, and
the tier line so the ₹99 never reads as the only price.

### OG images — **Not built** (needs E3.1/E3.2)

Each card page needs a 1200×630 render so a forward unfurls into the artwork. Generate at
build time from the same composition the `ArtCard` front already describes — tint, art,
name plate, monogram — into `public/images/og/cards/<slug>.png`; the meta tag already
points there. The same generator produces the story cards in §8.

---

## 6. E9.4 — Basket & checkout

### Basket state — **Built** (`src/store/CartContext.jsx`)

**The basket stores card slugs and quantities. Nothing else.** Names, artwork and the
total are all derived at render time. A basket left open in a tab for three weeks
re-prices itself on the next render instead of checking out at last month's tiers, and
hydration failure is survivable:

| Stored | On load |
| --- | --- |
| Slug no longer in the collection | dropped |
| Quantity 9999 | clamped to 10 |
| `{slug: null, quantity: 'x'}` | dropped |
| Unparseable JSON | whole basket discarded |

The buyer loses a basket; they never see a broken page or pay a wrong total.

The basket is **not cleared on checkout submit** — only on the success page, after the
purchase is recorded. Clearing on submit punishes exactly the person whose payment just
failed. The failure page says so: *"Nothing has been charged and your cards are exactly
where you left them."*

### Checkout — **Built, payment handoff stubbed**

One page. Fields are the postman's minimum, each with an `autoComplete` attribute so a
phone fills the address in one tap. Validation is on submit, focuses the first bad field,
and never blocks a keystroke. No shipping-zone selector: one flat rate for the whole
country is one fewer thing to get wrong, and the studio absorbs the difference.

The Razorpay call is stubbed at `CheckoutPage.jsx#handoff` with the real shape commented
in place, plus a prototype-only checkbox that simulates a decline so the failure page can
be reviewed. **To go live:** replace `handoff` with the Razorpay Checkout open call
(Phase 1) or the Worker fetch (Phase 2) from the E9.1 record.

### GA4 ecommerce — **Built** (`src/store/analytics.js`)

`view_item_list` · `view_item` · `add_to_cart` · `remove_from_cart` · `view_cart` ·
`begin_checkout` · `add_shipping_info` · `purchase`, plus a non-standard
`checkout_failure` as a funnel-leak marker.

Four things that are easy to get wrong and are handled:

- **`purchase` fires once per `transaction_id`**, guarded by `sessionStorage`, so
  refreshing the confirmation page does not inflate revenue.
- **`begin_checkout` fires on the checkout page, not the cart button** — otherwise anyone
  who reloads or lands directly is invisible and the drop-off looks better than it is.
- **Item `price` is the effective bundle rate, not ₹99.** GA4 reconciles price × quantity
  against `value`; reporting the list price would overstate revenue on every order above
  one card. (Rounding the rate to whole rupees leaves a rupee or two of drift on some
  counts; `value` is authoritative and correct.)
- Events go through `gtag` rather than `react-ga4`, which flattens parameters and would
  drop the nested `items` array the ecommerce reports read.

**Verified end to end:** a five-card basket checks out on mobile and desktop, fires
`purchase` with `value: 508` and `shipping: 60`, clears the basket, and shows the
confirmation with the cards fanned out. The simulated decline lands on the failure page
with the basket intact.

---

## 7. E9.5 — Order operations

The target is unchanged: **paid → shipped with tracking sent, in one sitting.** The
monthly batch makes it easier than the multi-product version would have been.

**Order routing — Built** (`src/store/orderEmail.js`). On payment success, two EmailJS
sends fire from the checkout — the earliest point the money is known to have moved, and
still reached if the buyer closes the tab a second later:

1. **To the buyer** — order id, cards, totals, and the batch date their order goes out on.
2. **To the studio** — all of that plus the buyer's contact details, a multi-line shipping
   address, and a compact JSON block of the order. The JSON is what the packing slip
   reads, so nobody re-types an address.

Three rules the module holds to, because until there is a server these two emails are the
only record an order happened:

- **Sending never blocks the buyer.** They have paid; the confirmation page renders
  whether or not the mail provider is having a bad day. The send is not awaited.
- **Failures are reported, not swallowed** — to the console and to GA4 as
  `order_email_failed`. An order that silently fails to reach the studio is the worst
  outcome this shop has, so it must be visible in the same place the revenue is.
- **Once per order id**, guarded in `sessionStorage`, so a reload cannot re-send.

The bodies are composed in the module rather than in the EmailJS templates, so the
templates stay a handful of `{{placeholders}}` and the wording lives in the repository
where it can be reviewed. Set `VITE_EMAILJS_ORDER_TEMPLATE_ID` and
`VITE_EMAILJS_STUDIO_TEMPLATE_ID` to switch it on; unset, orders still complete and the
record is the notes attached to the Razorpay payment.

**The backup is real and already in place.** Every payment carries the order id, the card
slugs and the full shipping address as Razorpay notes, visible on the payment in the
dashboard. If an email is ever lost, the order is still packable from there.

**Packing slip — design.** A single local file, `tools/packing-slip.html`: paste the JSON
from the order email, get a print-ready A6 slip with the address, the species list and the
studio's return address. No server, no login, no order database — at this volume the email
*is* the order database.

**The monthly rhythm — design.** On batch day: reconcile every payment in the Razorpay
dashboard against its order email (this is also the Phase-1 fraud control from E9.1), print
the slips for the batch, pack, label, post, then send tracking numbers from the template.
One sitting, once a month, which is the entire point of batching.

**Monthly summary — design.** One page into the E4.3 KPI review: revenue and order count
from the Razorpay settlement export; **average cards per order** and the tier mix from GA4
(the number that says whether the nudges work); conversion and drop-off; and
`checkout_failure` reasons.

---

## 8. E9.6 — Launch

**Campaign links.** UTM conventions from E4.2 per channel, all pointing at `/shop` or a
card page, never the home page — launch traffic should land where it can buy.

**Story cards.** Every species gets a 1080×1920 share card from the same build-time
generator as the OG images: artwork, name, scientific name, the fact, a QR to the card
page. The rule that makes this stick: **a card does not go live until its story card
exists**, because a new card Smita has to design a post for is a new card that quietly
never gets announced.

**Seasonal drops.** The collection grows; each new batch of species is an announcement,
and the monthly dispatch date gives every announcement a natural deadline ("in this
month's batch"). Festive gifting wants the twelve-card bundle, which is already the best
value tier — no separate gift SKU needed.

**Nav and /links.** Shop enters the navbar (done in the prototype) and `/links` (E1.5, not
built).

---

## 9. Build order and what's outstanding

| | Item | State |
| --- | --- | --- |
| E9.1 | Decision record | This branch |
| E9.3 | Catalog, shop page, flip card, grid, card pages, JSON-LD | **Built** |
| E9.4 | Basket, bundle pricing, tray, cart, checkout, outcomes, GA4 | **Built** (payment stubbed) |
| E9.4 | Razorpay handoff — replace `handoff()` | Outstanding |
| E9.4 | Razorpay Checkout, behind a key guard | **Built** |
| E9.5 | Order confirmation emails, buyer + studio | **Built** (needs two EmailJS templates) |
| E9.3 | Per-card OG images + story cards | Blocked on E3.1/E3.2 |
| E9.3 | Prerendering of shop routes | Blocked on E3.1 (#22) |
| E9.2 | Print run, cardstock proof, mailer, postage rates | Smita |
| E9.5 | Packing slip tool, tracking template, monthly summary | Outstanding |
| E9.6 | Story-card generator, campaign links, /links entry | Outstanding |

**E9.2 shrinks.** With no print-on-demand partner, that story is now: approve a printed
proof of the cardstock and colour, choose the mailer, and confirm the flat postage rate.
No POD comparison, no per-item white-labelling, no split-parcel policy.

Two dependencies worth stating plainly. **Without E3.1, shop pages are client-rendered** —
they will not rank and will not unfurl on WhatsApp, which removes most of the reason for
building a page per species. And **E6 has to run first**, because its numbers are the gate
in §1 of the decision record.

---

## 10. Open questions

1. **Accountant** — the three GST questions in the decision record.
2. **The ₹500 free-shipping line sits between tiers.** Six cards (₹400) pay postage;
   nine (₹650) do not. That is a real cliff and it may be worth moving the threshold to
   ₹400 so the six-pack — the tier most people will land on — ships free. Needs the real
   postage rate before deciding.
3. **Species facts** are written from general knowledge and need Smita's eye before
   anything is printed; the reverse of a card is not the place for an approximation.
4. **The Coppersmith Barbet artwork needs re-exporting.** The printed front reads
   *Psilopogan haemacephala*; the correct name is *Psilopogon haemacephalus*, and the
   White-cheeked Barbet card in the same set already spells the genus correctly. The
   catalog now carries the corrected name, so until the artwork is redrawn the card image
   and the text beside it disagree — visible on the card's own page and in the cart. Fix
   the artwork, drop the new file in over `public/images/cards/coppersmith-barbet.jpg`,
   and the mismatch closes with no code change.
5. **Monthly batch cadence** — if "ordered on the 2nd, posted on the 1st" starts drawing
   complaints, add a second batch rather than reverting to per-order posting.
