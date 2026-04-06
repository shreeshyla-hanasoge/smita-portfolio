import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const Landing = ({ id }) => {
  const [videoError, setVideoError] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [orientation, setOrientation] = useState(
    window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  )

  const handleVideoError = () => {
    console.warn('Hero video failed to load, falling back to static image')
    setVideoError(true)
  }

  const handleVideoLoad = () => {
    setVideoLoaded(true)
  }

  // Handle orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      // Debounce orientation changes to prevent excessive updates
      setTimeout(() => {
        const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
        setOrientation(newOrientation)
      }, 150)
    }

    window.addEventListener('resize', handleOrientationChange)
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('resize', handleOrientationChange)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  // Dynamic object position based on viewport and orientation
  const getVideoObjectPosition = () => {
    const isMobile = window.innerWidth <= 768
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024
    
    if (isMobile) {
      return orientation === 'portrait' ? '75% center' : '60% center'
    } else if (isTablet && orientation === 'portrait') {
      return '65% center'
    }
    return 'center center' // Desktop default
  }

  // Check if mobile for different animation behavior
  const isMobile = window.innerWidth <= 768

  return (
    <section id={id} className="landing-section">
      <div className="hero-video">
        {!videoError ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="hero-video-element"
            style={{ objectPosition: getVideoObjectPosition() }}
            onError={handleVideoError}
            onLoadedData={handleVideoLoad}
          >
            <source src="/smita_hero_video_2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src="/images/gallery/hero_image.png"
            alt="Studio Mintleai Hero"
            className="hero-video-element hero-fallback-image"
            style={{ objectPosition: getVideoObjectPosition() }}
            onError={() => console.warn('Fallback image also failed to load')}
          />
        )}
        
        {/* Loading indicator for slow connections */}
        {!videoLoaded && !videoError && (
          <div className="video-loading-indicator">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        <div className="video-overlay"></div>
        
        {/* Only show text overlay on desktop/landscape */}
        {!isMobile && (
          <motion.div 
            className="intro-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          >
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Stories beyond pixels
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              Our work explores the meeting point of art, design and interface, creating visual experiences tailored to express the diverse stories our clients want to share.
            </motion.p>
          </motion.div>
        )}
      </div>
      
      {/* Mobile text outside of hero-video container */}
      {isMobile && (
        <div className="intro-text mobile-intro-text">
          <h1>Stories beyond pixels</h1>
          <p>Our work explores the meeting point of art, design and interface, creating visual experiences tailored to express the diverse stories our clients want to share.</p>
        </div>
      )}
    </section>
  )
}

export default Landing
