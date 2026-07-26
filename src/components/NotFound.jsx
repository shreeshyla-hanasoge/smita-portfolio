import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import './NotFound.css'

const NotFound = () => {
  return (
    <div className="not-found-page">
      <Helmet>
        <title>Page Not Found - Studio Mintleaf</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="not-found-content"
      >
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for seems to have wandered off into the wild.</p>
        <Link to="/" className="back-home-button">
          ← Back to Home
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound
