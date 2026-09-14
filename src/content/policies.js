/**
 * The four policy documents Razorpay's activation review looks for, plus the
 * contact details it cross-checks against the dashboard.
 *
 * Written from what the shop actually promises — the tiers in commerce.js, the
 * flat ₹60 / free-over-₹500 shipping, the monthly batch on the 26th, and the
 * GST position in GST_POSITION. If any of those change, these change with them.
 *
 * The `confirm()` helper marks a fact only the studio can supply and renders it
 * highlighted so it cannot go live unnoticed. Nothing uses it today: the studio
 * trades under the brand name for now. It is kept because naming a registered
 * entity and a postal address becomes necessary at GST registration, and then
 * re-adding it is one line rather than rebuilding the mechanism.
 */

export const POLICY_CONTACT = {
  name: 'Studio Mintleaf',
  email: 'smita@studiomintleaf.in',
  site: 'studiomintleaf.in',
  city: 'Bangalore, Karnataka, India',
}

export const LAST_UPDATED = '12 September 2026'

const p = (...text) => ({ type: 'p', text })
const ul = (...items) => ({ type: 'ul', items })
const confirm = (what) => ({ type: 'confirm', what })

export const POLICIES = {
  terms: {
    slug: 'terms',
    title: 'Terms & Conditions',
    lede: 'The agreement between you and Studio Mintleaf when you buy from this website.',
    sections: [
      {
        heading: 'Who we are',
        body: [
          p('This website is operated by Studio Mintleaf, an illustration studio based in Bangalore, India. You can reach us at smita@studiomintleaf.in and we usually reply within two working days.'),
        ],
      },
      {
        heading: 'What we sell',
        body: [
          p('Illustrated art cards, 3.5 × 4 inches, printed on premium matte cardstock in Bangalore. Each card carries an original painting on the front and a short piece of writing about that species on the reverse.'),
          p('Card artwork is photographed and reproduced as faithfully as we can manage, but screens vary. Small differences in colour between what you see here and what arrives are normal and are not a fault.'),
        ],
      },
      {
        heading: 'Prices and payment',
        body: [
          p('All prices are in Indian Rupees and include taxes where they apply. Cards are priced by how many are in the order rather than which ones: ₹99 for one, ₹250 for any three, ₹400 for any six and ₹650 for any twelve. Your order is charged the cheapest combination of those for the number of cards you have chosen.'),
          p('Studio Mintleaf is not currently registered for GST. If that changes, the prices shown will not change — only how the tax is set out on the invoice.'),
          p('Payments are taken by Razorpay. Your card, UPI or banking details are entered on Razorpay’s secure page and are never seen or stored by us.'),
        ],
      },
      {
        heading: 'Orders',
        body: [
          p('An order is confirmed when payment succeeds and you receive a confirmation email carrying an order number.'),
          p('We may decline or cancel an order — for example if a card is out of stock, if the price or description was wrong, or if we cannot deliver to the address given. If we do, you are refunded in full and we will tell you why.'),
        ],
      },
      {
        heading: 'Dispatch',
        body: [
          p('Orders are packed and posted in one batch each month, on the 26th. This is deliberate: it lets us use one good mailer and one trip to the post office rather than sending every card separately. Your confirmation email tells you which batch your order is in.'),
          p('Shipping charges and delivery expectations are set out in the Shipping Policy.'),
        ],
      },
      {
        heading: 'Artwork and copyright',
        body: [
          p('Every illustration on these cards is original work and remains the property of Studio Mintleaf. Buying a card buys you the card.'),
          p('You are welcome to keep, frame, gift or photograph your cards. You may not reproduce, scan, reprint or resell the artwork, or use it commercially, without written permission. If you would like to license an illustration, write to us.'),
        ],
      },
      {
        heading: 'Our responsibility',
        body: [
          p('We take care over what we make and how we pack it. If something arrives damaged or wrong, the Refund & Cancellation Policy sets out what we will do about it.'),
          p('Beyond that, our liability for any order is limited to what you paid for it. We are not liable for indirect losses, and nothing here limits any right you have under Indian consumer law.'),
        ],
      },
      {
        heading: 'Governing law',
        body: [
          p('These terms are governed by the laws of India. Any dispute is subject to the jurisdiction of the courts at Bangalore, Karnataka.'),
        ],
      },
      {
        heading: 'Changes',
        body: [
          p('We may update these terms as the shop changes. The version in force for your order is the one published on the day you ordered. The date at the top of this page shows when it was last revised.'),
        ],
      },
    ],
  },

  privacy: {
    slug: 'privacy',
    title: 'Privacy Policy',
    lede: 'What we collect when you buy something, why, and who else sees it.',
    sections: [
      {
        heading: 'What we collect',
        body: [
          p('When you place an order we ask for your name, email address, phone number and postal address. We ask for these because a parcel cannot be addressed without them and a courier may need to call.'),
          p('We also collect anonymous usage statistics through Google Analytics — which pages are visited, which cards are looked at, whether an order completes. This is aggregate and is not used to identify you.'),
        ],
      },
      {
        heading: 'What we never see',
        body: [
          p('Card numbers, UPI PINs, net-banking credentials and anything else you type into the payment window. That window belongs to Razorpay. Those details go to them and their banking partners directly and never reach this website or our records.'),
        ],
      },
      {
        heading: 'Why we hold it',
        body: [
          ul(
            'To pack and post your order, and to tell you when it has gone out.',
            'To answer you if you write to us about an order.',
            'To keep a record of sales, as any business must.',
            'To understand, in aggregate, which work people respond to.',
          ),
          p('We do not sell your details, and we do not send marketing email to people who have not asked for it. The quarterly newsletter is opt-in and every issue carries an unsubscribe link.'),
        ],
      },
      {
        heading: 'Who else sees it',
        body: [
          ul(
            'Razorpay — to take the payment. Their own privacy policy governs what they hold.',
            'The courier or India Post — the name, address and phone number needed to deliver.',
            'Our email provider — to send you the confirmation and the tracking note.',
            'Google Analytics — anonymous usage data only.',
          ),
          p('Nobody else, unless we are required to disclose something by law.'),
        ],
      },
      {
        heading: 'How long we keep it',
        body: [
          p('Order records are kept as long as we need them for accounts and tax. Correspondence is kept while it is useful and deleted when it is not. Your basket is stored in your own browser, not on our servers, and clearing your browser data clears it.'),
        ],
      },
      {
        heading: 'Your say over it',
        body: [
          p('Write to smita@studiomintleaf.in and you can ask us what we hold about you, ask us to correct it, or ask us to delete it. We will do so unless we are required to keep it for tax or accounting. We aim to reply within two working days.'),
        ],
      },
      {
        heading: 'Cookies',
        body: [
          p('This site uses cookies for Google Analytics, and your browser’s local storage to remember the cards you have picked so your basket survives a refresh. Blocking cookies will not stop you browsing or buying; it will stop the basket persisting between visits.'),
        ],
      },
    ],
  },

  refunds: {
    slug: 'refunds',
    title: 'Refund & Cancellation Policy',
    lede: 'If something is wrong with your order, this is what happens.',
    sections: [
      {
        heading: 'Cancelling before dispatch',
        body: [
          p('Because orders go out in one batch a month, there is usually a comfortable window between paying and posting. Write to smita@studiomintleaf.in with your order number any time before your batch is dispatched and we will cancel it and refund you in full.'),
          p('Once a batch is in the post it cannot be recalled, and the sections below apply instead.'),
        ],
      },
      {
        heading: 'Damaged, faulty or wrong cards',
        body: [
          p('Send us a photograph within seven days of the parcel arriving, along with your order number. If a card arrived damaged, misprinted, or is not the one you ordered, we will send a replacement at no cost, or refund that card in full if you would rather.'),
          p('We do not ask you to post the card back. Return postage on a ₹99 card costs more than the card, and asking for it would only make a problem we caused into a chore for you.'),
        ],
      },
      {
        heading: 'Change of mind',
        body: [
          p('Write to us within seven days of delivery and we will refund the cards you have not opened or used. Because these are low-value printed items, we will usually simply refund you rather than arrange a collection; we will tell you which when you write.'),
        ],
      },
      {
        heading: 'Parcels that do not arrive',
        body: [
          p('If tracking shows a parcel as delivered but you do not have it, or if it has not moved for two weeks, tell us. We will chase the courier, and if it cannot be found we will replace the order or refund it.'),
          p('If a parcel comes back to us because the address was incomplete or nobody could take delivery, we will write to you. We can resend it once you confirm the address; a second postage charge may apply.'),
        ],
      },
      {
        heading: 'How refunds are paid',
        body: [
          p('Refunds go back through Razorpay to the method you paid with — we cannot send them anywhere else. Once we approve a refund it is initiated within two working days, and banks typically take a further five to seven working days to show it on your statement.'),
          p('Where shipping was charged and the whole order is refunded, the shipping is refunded too.'),
        ],
      },
      {
        heading: 'How to reach us',
        body: [
          p('Email smita@studiomintleaf.in with your order number — it looks like SM-2609-4F2A and is in your confirmation email. We reply within two working days.'),
        ],
      },
    ],
  },

  shipping: {
    slug: 'shipping',
    title: 'Shipping Policy',
    lede: 'Where we post to, what it costs, and when it goes.',
    sections: [
      {
        heading: 'Where we post',
        body: [
          p('Anywhere in India. We do not currently ship internationally — if you are abroad and want cards, write to smita@studiomintleaf.in and we will quote you directly.'),
        ],
      },
      {
        heading: 'What it costs',
        body: [
          ul(
            'A flat ₹60 anywhere in India.',
            'Free once the order passes ₹500.',
          ),
          p('One rate for the whole country, rather than a table you have to find yourself in. Where the real postage costs more than ₹60, the studio absorbs the difference.'),
        ],
      },
      {
        heading: 'When it goes',
        body: [
          p('Orders are packed and posted in one batch each month, on the 26th. Whatever you order between one batch and the next goes out on the next 26th, and your confirmation email names that date.'),
          p('This is a deliberate choice rather than a delay. Cards are small and light, and posting each one separately means far more packaging for the same number of cards. One batch a month lets us pack properly, in one go.'),
        ],
      },
      {
        heading: 'How long it takes to arrive',
        body: [
          p('Once a batch is posted, delivery within India usually takes two to seven working days depending on where you are. Remote pin codes and the days around festivals take longer.'),
          p('These are the courier’s timelines rather than promises we can keep on their behalf.'),
        ],
      },
      {
        heading: 'Tracking',
        body: [
          p('When your batch goes out you will get an email with a tracking number. If it has not arrived within a few days of the dispatch date, check your promotions folder before writing to us.'),
        ],
      },
      {
        heading: 'Addresses',
        body: [
          p('Please check your address and pin code before paying — we print the label from what you gave us. If you spot a mistake, email smita@studiomintleaf.in with your order number as soon as you can and we will correct it if the batch has not gone out.'),
        ],
      },
    ],
  },
}

export const POLICY_LIST = Object.values(POLICIES).map(({ slug, title }) => ({ slug, title }))
