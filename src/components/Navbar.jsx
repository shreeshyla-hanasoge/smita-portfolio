import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../store/CartContext'
import './Navbar.css'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { summary, hydrated } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavigation = (sectionId) => {
    // If we're on the home page (/), scroll to the section
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // If we're on any other page (like project page), navigate to home with hash
      navigate(`/#${sectionId}`)
    }
    setIsMobileMenuOpen(false)
  }

  const handleRouteNavigation = (path) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav 
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="nav-container">
        {/* Logo/Brand */}
        <motion.div 
          className="nav-brand"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavigation('landing')}
        >
          <img 
            src="/images/gallery/Updated_logo_light_wo_tagline.svg" 
            alt="Smita Logo" 
            className="logo-image"
          />
        </motion.div>

        {/* Desktop Navigation */}
        <div className="nav-menu">
          <motion.button 
            className="nav-link"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation('landing')}
          >
            Home
          </motion.button>
          <motion.button
            className="nav-link"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation('gallery')}
          >
            Projects
          </motion.button>
          <motion.button
            className="nav-link"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRouteNavigation('/services')}
          >
            Services
          </motion.button>
          <motion.button
            className="nav-link"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation('about')}
          >
            About
          </motion.button>
          <motion.button 
            className="nav-link"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation('contact')}
          >
            Contact
          </motion.button>
          <motion.button
            className="nav-link"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRouteNavigation('/newsletter')}
          >
            Newsletter
          </motion.button>
          <motion.button
            className="nav-link"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRouteNavigation('/shop')}
          >
            Shop
          </motion.button>
        </div>

        {/* Right-hand actions. The cart sits outside .nav-menu on purpose —
            .nav-menu is hidden on mobile, and a cart you can't reach from a
            phone is the one place this site can lose money. It stays hidden
            until it holds something, so readers who never shop never see it. */}
        <div className="nav-actions">
          {hydrated && summary.count > 0 && (
            <motion.button
              className="nav-cart"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRouteNavigation('/shop/cart')}
              aria-label={`Your collection, ${summary.count} ${summary.count === 1 ? 'card' : 'cards'}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="nav-cart__count">{summary.count}</span>
            </motion.button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div 
          className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -20 }}
          transition={{ duration: 0.3 }}
        >
          <button onClick={() => handleNavigation('landing')}>Home</button>
          <button onClick={() => handleNavigation('gallery')}>Projects</button>
          <button onClick={() => handleRouteNavigation('/services')}>Services</button>
          <button onClick={() => handleNavigation('about')}>About</button>
          <button onClick={() => handleNavigation('contact')}>Contact</button>
          <button onClick={() => handleRouteNavigation('/newsletter')}>Newsletter</button>
          <button onClick={() => handleRouteNavigation('/shop')}>Shop</button>
          {hydrated && summary.count > 0 && (
            <button onClick={() => handleRouteNavigation('/shop/cart')}>
              Cart ({summary.count})
            </button>
          )}
        </motion.div>
      </div>
    </motion.nav>
  )
}

export default Navbar
