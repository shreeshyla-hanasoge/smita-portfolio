import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const Landing = ({ id }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Force video to load and play
      video.load()
      
      // Add event listeners for debugging
      video.addEventListener('loadeddata', () => {
        console.log('Video loaded successfully')
      })
      
      video.addEventListener('error', (e) => {
        console.error('Video error:', e)
      })
      
      video.addEventListener('canplay', () => {
        video.play().catch(err => {
          console.log('Autoplay prevented:', err)
          // Handle autoplay restrictions
          video.muted = true
          video.play()
        })
      })
      
      // Fallback: If video doesn't load after 3 seconds, show background
      const fallbackTimer = setTimeout(() => {
        if (video.readyState < 2) {
          console.log('Video loading timeout - using fallback')
          video.style.display = 'none'
        }
      }, 3000)
      
      return () => clearTimeout(fallbackTimer)
    }
  }, [])

  return (
    <section id={id} className="landing-section">
      {/* Full-screen video background */}
      <div className="video-background">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          style={{ backgroundColor: '#000' }}
        >
          <source src="/background-video.mp4" type="video/mp4" />
          <source src="/background-video.webm" type="video/webm" />
          <source src="/background-video.mov" type="video/quicktime" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Introductory text positioned bottom left */}
      <motion.div 
        className="intro-text"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Wildlife Art & Design
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Creating meaningful connections between nature and digital experiences
        </motion.p>
        <motion.p
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          Placeholder: Wildlife artist and UI/UX designer based in Bangalore,
          crafting nature-inspired illustrations and intuitive digital products.
        </motion.p>
      </motion.div>
    </section>
  )
}

export default Landing