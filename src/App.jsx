import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ReactGA from 'react-ga4'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import About from './components/About'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import ProjectPage from './components/ProjectPage'
import NewsletterPage from './components/NewsletterPage'
import NewsletterQ2Page from './components/NewsletterQ2Page'
import ServicesPage from './components/ServicesPage'
import NotFound from './components/NotFound'
import CommonCTA from './components/CommonCTA'
import { latestNewsletter } from './components/newsletters'
import { canCheckout } from './store/commerce'
import { CartProvider } from './store/CartContext'
import ShopPage from './components/store/ShopPage'
import CardDetailPage from './components/store/CardDetailPage'
import CartPage from './components/store/CartPage'
import CheckoutPage from './components/store/CheckoutPage'
import { OrderSuccessPage, OrderFailedPage } from './components/store/OrderStatusPage'
import CollectionTray from './components/store/CollectionTray'
import PreviewBadge, { IS_PREVIEW } from './components/PreviewBadge'
import './App.css'

// Initialize Google Analytics.
//
// Never on a preview build. The shop fires real GA4 ecommerce events, so a
// reviewer clicking through the stubbed checkout would post `purchase` events
// with rupee values straight into the studio's production property — inventing
// revenue that never happened and poisoning the E6 demand data this epic is
// gated on. See scripts/deploy-preview.sh, which also strips the gtag snippet
// from index.html for the same reason.
if (!IS_PREVIEW) {
  ReactGA.initialize("G-8EEEE29D24");
}

const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (IS_PREVIEW) return;
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  // Shop routes are a browse flow — landing on a card page halfway down
  // because the collection was scrolled is disorienting. Home is left alone
  // so its hash-to-section navigation keeps working.
  useEffect(() => {
    if (location.pathname.startsWith('/shop')) window.scrollTo(0, 0);
  }, [location.pathname]);

  // Arriving at /#gallery from another page used to land on the hero: the
  // router sets the hash but scrolls nothing, so only a second click — by
  // which point we were already on home — actually moved. Scroll to the
  // target ourselves once it exists, retrying for a few frames because the
  // home sections mount and lay out after this effect first runs.
  useEffect(() => {
    if (!location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    let frame = null;
    let tries = 0;
    const seek = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (tries++ < 30) frame = requestAnimationFrame(seek);
    };
    frame = requestAnimationFrame(seek);
    return () => frame && cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  return null;
};

function App() {
  return (
    <Router>
      <CartProvider>
        <PageTracker />
        <Helmet>
          <title>Studio Mintleaf - Stories Beyond Pixels</title>
          <meta name="description" content="Creative portfolio of Studio Mintleaf, blending wildlife artistry with modern UI/UX design" />
          <meta name="keywords" content="wildlife artist, UI/UX designer, portfolio, nature art, digital design, Bangalore" />
          <meta name="author" content="Studio Mintleaf" />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.studiomintleaf.in/" />
          <meta property="og:title" content="Studio Mintleaf - Stories Beyond Pixels" />
          <meta property="og:description" content="Explore the creative portfolio of Studio Mintleaf, blending wildlife artistry with modern UI/UX design" />
          <meta property="og:image" content="https://www.studiomintleaf.in/images/og-image.jpg" />

          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://www.studiomintleaf.in/" />
          <meta property="twitter:title" content="Studio Mintleaf - Stories Beyond Pixels" />
          <meta property="twitter:description" content="Explore the creative portfolio of Studio Mintleaf, blending wildlife artistry with modern UI/UX design" />
          <meta property="twitter:image" content="https://www.studiomintleaf.in/images/og-image.jpg" />

          <link rel="canonical" href="https://www.studiomintleaf.in/" />
        </Helmet>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={
              <>
                <Landing id="landing" />
                <Gallery id="gallery" />
                <About id="about" />
                <CommonCTA />
              </>
            } />
            <Route path="/project/:projectId" element={<ProjectPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/newsletter" element={<Navigate to={latestNewsletter.path} replace />} />
            <Route path="/newsletter/q2-2026" element={<NewsletterQ2Page />} />
            <Route path="/newsletter/q1-2026" element={<NewsletterPage />} />

            {/* Shop (E9). Card routes are enumerated from the catalog at build
                time — see shopRoutes() in src/store/catalog.js */}
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/cart" element={<CartPage />} />
            {/* Checkout opens only when a Razorpay key is configured AND the
                shop has opened (or this is a preview build) — see canCheckout()
                in commerce.js. With no key this stays a redirect, exactly as
                before, so deploying this changes nothing on its own. */}
            <Route
              path="/shop/checkout"
              element={canCheckout() ? <CheckoutPage /> : <Navigate to="/shop/cart" replace />}
            />
            <Route path="/shop/order/success" element={<OrderSuccessPage />} />
            <Route path="/shop/order/failed" element={<OrderFailedPage />} />
            <Route path="/shop/card/:cardSlug" element={<CardDetailPage />} />
            {/* /store was the earlier iteration's path; keep it resolving so
                nothing already shared points at a dead page. */}
            <Route path="/store/*" element={<Navigate to="/shop" replace />} />

            {/* Must stay last — it matches anything the routes above did not. */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CollectionTray />
          <PreviewBadge />
        </div>
      </CartProvider>
    </Router>
  )
}

export default App
