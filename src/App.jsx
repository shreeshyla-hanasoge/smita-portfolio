import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
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
import './App.css'

// Initialize Google Analytics
ReactGA.initialize("G-8EEEE29D24");

const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return null;
};

function App() {
  return (
    <Router>
      <PageTracker />
      <Helmet>
        <title>Studio Mintleaf - Stories Beyond Pixels</title>
        <meta name="description" content="Creative portfolio of Studio Mintleaf, blending wildlife artistry with modern UI/UX design" />
        <meta name="keywords" content="wildlife artist, UI/UX designer, portfolio, nature art, digital design, Bangalore" />
        <meta name="author" content="Studio Mintleaf" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://studiomintleaf.in/" />
        <meta property="og:title" content="Studio Mintleaf - Stories Beyond Pixels" />
        <meta property="og:description" content="Explore the creative portfolio of Studio Mintleaf, blending wildlife artistry with modern UI/UX design" />
        <meta property="og:image" content="https://studiomintleaf.in/images/hero_image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://studiomintleaf.in/" />
        <meta property="twitter:title" content="Studio Mintleaf - Stories Beyond Pixels" />
        <meta property="twitter:description" content="Explore the creative portfolio of Studio Mintleaf, blending wildlife artistry with modern UI/UX design" />
        <meta property="twitter:image" content="https://studiomintleaf.in/images/hero_image.png" />
        
        <link rel="canonical" href="https://studiomintleaf.in/" />
      </Helmet>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Landing id="landing" />
              <Gallery id="gallery" />
              <About id="about" />
              <Contact id="contact" />
            </>
          } />
          <Route path="/project/:projectId" element={<ProjectPage />} />
          <Route path="/newsletter/q1-2026" element={<NewsletterPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
