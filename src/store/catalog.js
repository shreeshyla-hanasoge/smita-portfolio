/**
 * The Art Card collection.
 *
 * One product line, many species. Every card is the same object — same size,
 * same stock, same ₹99 — so the catalog carries no prices and no variants.
 * Price comes from how many cards are in the order, not from which ones, and
 * that lives in commerce.js.
 *
 * `art` is the studio's finished, print-ready card front (1050 × 1200, exactly
 * 7:8 at 300dpi) with the title, scientific name and monogram already set. The
 * site renders it whole rather than recomposing it — the studio moves the title
 * block around to suit each illustration (top for the barbet, bottom for the
 * tulip), and no amount of browser layout would reproduce that faithfully.
 *
 * `back` is optional. Where the studio has exported the printed reverse, the
 * site shows that file — exact, QR and all. Where it hasn't, the reverse is
 * composed from `fact` in the same order as the print, so a species can join
 * the collection on one artwork file instead of two. Supplying a back later is
 * a drop-in: add the file, add the field, nothing else changes.
 *
 * `fact` is written as a predicate — it is rendered as "The «name» «fact»", so
 * it must begin with a verb.
 *
 * `tint` is sampled from the artwork's own background. Nothing is drawn on top
 * of it; it is there so thumbnails, loading states and the tray chips sit on
 * the same colour as the card instead of flashing white.
 */

export const COLLECTION = {
  // `name` is the product line, used in breadcrumbs. `title` is the page's h1:
  // it names the shop rather than describing it, because this is the page a
  // search result or a shared link lands on cold — "The Collection" told a
  // first-time visitor nothing about whose collection it was.
  name: 'Art Cards',
  eyebrow: 'Art cards inspired by nature',
  title: 'Studio Mintleaf Shop',
  // Deliberately not "inspired by the natural world" — the eyebrow directly
  // above already says "inspired by nature", and the echo reads as an oversight.
  lede: 'Small keepsakes from the natural world.',
  intro:
    'Each illustrated art card pairs an original painting with a short story about the species on the reverse. Together they form a growing catalogue of the remarkable plants, birds, insects and other wildlife that surround us every day.',
  invitation:
    'Collect a favourite, gift one to a fellow nature lover, or build your own library of everyday nature.',
  specs: [
    { label: 'Size', value: '3.5 × 4 inches', detail: '8.9 × 10.2 cm' },
    { label: 'Printed on', value: 'Premium thick cardstock', detail: 'Smooth matte finish' },
    { label: 'Made in', value: 'India', detail: 'Printed and packed in Bangalore' },
    { label: 'Shipped', value: 'Once a month', detail: 'Batched to cut waste' },
  ],
}

export const CARDS = [
  {
    slug: 'malabar-gliding-frog',
    name: 'Malabar Gliding Frog',
    scientific: 'Rhacophorus malabaricus',
    group: 'Amphibians',
    theme: 'dark',
    tint: '#121824',
    art: '/images/cards/malabar-gliding-frog.jpg',
    back: '/images/cards/malabar-gliding-frog-back.png',
    fact: 'uses its large webbed feet to glide between trees, covering distances of up to 12 metres or nearly 115 times its body length.',
    note: 'A Western Ghats endemic that spends almost its whole life in the canopy, coming down only to breed in foam nests above monsoon pools.',
  },
  {
    slug: 'white-cheeked-barbet',
    name: 'White-cheeked Barbet',
    scientific: 'Psilopogon viridis',
    group: 'Birds',
    theme: 'light',
    tint: '#B4CCD2',
    art: '/images/cards/white-cheeked-barbet.jpg',
    fact: 'calls "kot-roo, kot-roo" through the hottest hours of the day — a sound most Bangalore gardens know long before anyone spots the bird, which is precisely the green of the leaves it sits in.',
    note: 'Endemic to southern India and one of the few birds that will keep calling right through a summer afternoon.',
  },
  {
    slug: 'coppersmith-barbet',
    name: 'Coppersmith Barbet',
    // The printed front currently reads "Psilopogan haemacephala". This is the
    // correct spelling and the artwork is the thing that needs re-exporting —
    // until it is, the card image and this line disagree.
    scientific: 'Psilopogon haemacephalus',
    group: 'Birds',
    theme: 'light',
    tint: '#BAD2E4',
    art: '/images/cards/coppersmith-barbet.jpg',
    fact: 'has a repetitive "tuk-tuk-tuk" call that sounds like a coppersmith hammering metal, which is where the bird gets its common name.',
    note: 'Smaller than it sounds. The call carries for hundreds of metres and can run for minutes without a pause.',
  },
  {
    slug: 'common-kingfisher',
    name: 'Common Kingfisher',
    scientific: 'Alcedo atthis',
    group: 'Birds',
    theme: 'light',
    tint: '#D8E4E4',
    art: '/images/cards/common-kingfisher.jpg',
    fact: 'corrects for the way water bends light on every dive, then closes a third, translucent eyelid at the moment of impact — it finishes the hunt effectively blind.',
    note: 'The blue is structural, not pigment. There is no blue in the feather at all; it is the way the feather is built.',
  },
  {
    slug: 'red-whiskered-bulbul',
    name: 'Red-whiskered Bulbul',
    scientific: 'Pycnonotus jocosus',
    group: 'Birds',
    theme: 'light',
    tint: '#B4CCD2',
    art: '/images/cards/red-whiskered-bulbul.jpg',
    fact: 'takes its name from the crimson patch below the eye. It sings from the highest exposed perch it can find, crest up, rather than from inside cover.',
    note: 'A garden bird almost everywhere in India, and an introduced one in several countries that now cannot get rid of it.',
  },
  {
    slug: 'signature-spider',
    name: 'Signature Spider',
    scientific: 'Argiope anasuja',
    group: 'Insects & Spiders',
    theme: 'dark',
    tint: '#727866',
    art: '/images/cards/signature-spider.jpg',
    fact: 'writes a zig-zag band of thick silk across the middle of its web — the "signature" it is named for. What the band is for is still argued: a warning to birds, a lure for insects, or cover for the spider at the centre.',
    note: 'Sits head-down at the hub with its legs paired, which is how you tell an Argiope before you see the silk.',
  },
  {
    slug: 'colourful-peacock-jumper',
    name: 'Colourful Peacock Jumper',
    scientific: 'Chrysilla volupe',
    group: 'Insects & Spiders',
    theme: 'light',
    tint: '#D8E4E4',
    art: '/images/cards/colourful-peacock-jumper.jpg',
    fact: 'is a few millimetres long and builds no web to catch anything. It stalks, judges the distance with a pair of forward-facing eyes, and jumps — trailing a silk line behind it as a safety rope.',
    note: 'Look closely and it will turn to look back at you. Very few invertebrates do that.',
  },
  {
    slug: 'indian-green-lynx-spider',
    name: 'Indian Green Lynx Spider',
    scientific: 'Peucetia viridana',
    group: 'Insects & Spiders',
    theme: 'light',
    tint: '#E4EAEA',
    art: '/images/cards/indian-green-lynx-spider.jpg',
    fact: 'hunts across foliage without a web at all, using the long spines on its legs to cage prey the moment it pounces. The female stands over her egg sac until the spiderlings leave.',
    note: 'Green enough to vanish on a leaf, which is the entire strategy.',
  },
  {
    slug: 'pantropical-jumping-spider',
    name: 'Pantropical Jumping Spider',
    scientific: 'Plexippus paykulli',
    group: 'Insects & Spiders',
    theme: 'light',
    tint: '#B4CCD2',
    art: '/images/cards/pantropical-jumping-spider.jpg',
    fact: 'lives on the walls of houses across the tropics, hunting flies in daylight and returning to the same crevice at dusk. It is probably the spider you have watched without knowing its name.',
    note: 'The white stripe down the middle is how to separate the male from everything else on the wall.',
  },
  {
    slug: 'common-picture-wing',
    name: 'Common Picture Wing',
    scientific: 'Rhyothemis variegata',
    group: 'Insects & Spiders',
    theme: 'dark',
    tint: '#66848A',
    art: '/images/cards/common-picture-wing.jpg',
    fact: 'flies like a butterfly rather than a dragonfly. Its broad patterned wings flutter and glide instead of darting, which makes it one of the few dragonflies easy to follow with the naked eye.',
    note: 'Often seen in loose groups over open ground after the first rains.',
  },
  {
    slug: 'copperpod',
    name: 'Copperpod',
    scientific: 'Peltophorum pterocarpum',
    group: 'Plants',
    theme: 'light',
    tint: '#B4CCD2',
    art: '/images/cards/copperpod.jpg',
    fact: 'flowers yellow through the worst of the summer and lays a carpet of it on the road below. The seed pods that follow darken to a flat copper and rattle through the dry months — which is where the name comes from, not the flower.',
    note: 'One of the trees that makes a Bangalore May bearable to look at.',
  },
  {
    slug: 'african-tulip-tree',
    name: 'African Tulip Tree',
    scientific: 'Spathodea campanulata',
    group: 'Plants',
    theme: 'light',
    tint: '#B4CCD2',
    art: '/images/cards/african-tulip-tree.jpg',
    fact: 'holds water inside its closed buds, and children have long squeezed them to make them squirt — which is why it is also called the fountain tree.',
    note: 'Introduced, spectacular, and rather too good at spreading itself for some of the places it now grows.',
  },
  {
    slug: 'purple-orchid-tree',
    name: 'Purple Orchid Tree',
    scientific: 'Bauhinia purpurea',
    group: 'Plants',
    theme: 'light',
    tint: '#9CBAD8',
    art: '/images/cards/purple-orchid-tree.jpg',
    fact: 'carries a two-lobed leaf that looks like one leaf folded down the middle — or, depending on who you ask, a butterfly or a camel’s footprint.',
    note: 'Not an orchid. The flower simply looks enough like one to have taken the name.',
  },
]

export const cardsBySlug = Object.fromEntries(CARDS.map((c) => [c.slug, c]))

export const GROUPS = ['All', ...new Set(CARDS.map((c) => c.group))]

export const cardsInGroup = (group) =>
  group === 'All' ? CARDS : CARDS.filter((c) => c.group === group)

/** The card the shop leads with. */
export const HERO_CARD = CARDS[0]

/** Studio details printed on the reverse of every card. */
export const STUDIO = {
  name: 'Studio Mintleaf',
  tagline: 'Illustrating nature, science, and stories.',
  site: 'studiomintleaf.in',
  email: 'smita@studiomintleaf.in',
  logo: '/images/gallery/Updated_logo_light_wo_tagline.svg',
  monogram: '/images/newsletter/newsletter-monogram.svg',
}

/** Every route the build needs to prerender and put in the sitemap. */
export const shopRoutes = () => ['/shop', ...CARDS.map((c) => `/shop/card/${c.slug}`)]
