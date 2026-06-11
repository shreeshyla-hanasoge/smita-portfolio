import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Gallery.css'

import { projects } from './ProjectPage'

const Gallery = ({ id }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )
  const [isInteracting, setIsInteracting] = useState(false)
  const touchStartRef = useRef(null)
  const clamp = (v, min = 0, max = 100) => Math.min(max, Math.max(min, v))

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  // Track viewport size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      setViewportWidth(window.innerWidth)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-slide effect — paused while the user is touching the carousel,
  // and the 5s timer restarts whenever the slide changes
  useEffect(() => {
    if (isInteracting) return
    const interval = setInterval(() => {
      // Skip while the tab is hidden — animations can't run there and the
      // slides would pile up into a scrambled jump when the user returns
      if (document.hidden) return
      setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isInteracting, currentIndex])

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length)
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length)
  }

  // Touch handlers
  const onTouchStart = (e) => {
    touchStartRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    }
    setIsInteracting(true)
  }

  const onTouchEnd = (e) => {
    setIsInteracting(false)
    if (!touchStartRef.current) return

    const dx = e.changedTouches[0].clientX - touchStartRef.current.x
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y
    touchStartRef.current = null

    // Only treat mostly-horizontal gestures as swipes so vertical
    // page scrolling over the carousel doesn't change slides
    if (Math.abs(dx) < minSwipeDistance || Math.abs(dx) < Math.abs(dy)) return

    if (dx < 0) {
      handleNext()
    } else {
      handlePrev()
    }
  }

  return (
    <section id={id} className="gallery-section">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="gallery-title"
        >
          Featured Projects
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="gallery-subtitle"
        >
          Highlights from recent collaborations and assignments.
        </motion.p>

        <div className="carousel-container">
          <div className="carousel-wrapper">
            <div
              className="carousel"
              ref={carouselRef}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {projects.map((project, index) => {
                // Calculate relative position to center (0)
                let position = index - currentIndex
                // Handle circular positioning
                if (position > Math.floor(projects.length / 2)) {
                  position = position - projects.length
                } else if (position < -Math.floor(projects.length / 2)) {
                  position = position + projects.length
                }
                
                const isCenter = position === 0
                const isLeft = position === -1
                const isRight = position === 1
                const isVisible = isMobile ? Math.abs(position) <= 1 : Math.abs(position) <= 2

                // Mobile-specific positioning — derived from the real viewport
                // width so the side cards peek in from the edges on any phone.
                // The card width formula must stay in sync with Gallery.css.
                const getMobileTransform = () => {
                  if (isMobile) {
                    const cardWidth = Math.min(280, viewportWidth - 110)
                    const sideX = viewportWidth / 2 + (cardWidth * 0.8) / 2 - 36
                    if (isCenter) return {
                      x: 0,
                      scale: 1,
                      opacity: 1,
                      zIndex: 10,
                      rotateY: 0,
                      z: 0
                    }
                    if (isLeft) return {
                      x: -sideX,
                      scale: 0.8,
                      opacity: 0.6,
                      zIndex: 5,
                      rotateY: 18,
                      z: -40
                    }
                    if (isRight) return {
                      x: sideX,
                      scale: 0.8,
                      opacity: 0.6,
                      zIndex: 5,
                      rotateY: -18,
                      z: -40
                    }
                    return {
                      x: position > 0 ? sideX + 120 : -(sideX + 120),
                      scale: 0.6,
                      opacity: 0,
                      zIndex: 1,
                      rotateY: position > 0 ? -40 : 40,
                      z: -80
                    }
                  }
                  
                  // Desktop positioning (existing logic)
                  return {
                    x: position * 360,
                    scale: isCenter ? 1 : 0.85 - Math.abs(position) * 0.05,
                    opacity: isVisible ? 1 : 0.2,
                    zIndex: 20 - Math.abs(position) * 2,
                    rotateY: position * -15,
                    z: Math.abs(position) * -50
                  }
                }

                const transform = getMobileTransform()

                return (
                  <motion.div
                    key={project.id}
                    className={`carousel-item ${isCenter ? 'center' : ''} ${isLeft ? 'left' : ''} ${isRight ? 'right' : ''} ${!isVisible ? 'hidden' : ''}`}
                    initial={false}
                    animate={transform}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.25, 0.1, 0.25, 1.0],
                      scale: { duration: 0.6 },
                      rotateY: { duration: 0.7 }
                    }}
                    onClick={() => {
                      // On mobile, clicking side cards navigates to them
                      if (isMobile && !isCenter) {
                        setCurrentIndex(index)
                      }
                    }}
                  >
                    <Link 
                      to={`/project/${project.id}`} 
                      className="project-link"
                      onClick={(e) => {
                        // Prevent navigation if clicking side cards on mobile
                        if (isMobile && !isCenter) {
                          e.preventDefault()
                        }
                      }}
                    >
                      {isCenter && (
                        <div className="project-info">
                          <h3>{project.title}</h3>
                        </div>
                      )}
                      <div className="project-image">
                        <motion.img 
                          src={project.thumbnail} 
                          alt={project.title}
                          loading="lazy"
                          layoutId={`project-hero-${project.id}`}
                          style={{ 
                            transformOrigin: `${clamp(project.preview?.x ?? 50)}% ${clamp(project.preview?.y ?? 50)}%`,
                            objectPosition: `${clamp(project.preview?.x ?? 50)}% ${clamp(project.preview?.y ?? 50)}%`,
                            scale: project.preview?.zoom ?? 1
                          }}
                        />
                        <div className="project-overlay">
                          <span className="view-project">View Project</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <div className="carousel-controls">
            <button className="carousel-btn prev" onClick={handlePrev}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button className="carousel-btn next" onClick={handleNext}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>

          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Gallery
