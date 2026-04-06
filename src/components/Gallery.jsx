import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Gallery.css'

import { projects } from './ProjectPage'

const Gallery = ({ id }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const clamp = (v, min = 0, max = 100) => Math.min(max, Math.max(min, v))

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [projects.length])

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length)
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length)
  }

  // Touch handlers
  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
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
              onTouchMove={onTouchMove}
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

                // Mobile-specific positioning
                const getMobileTransform = () => {
                  if (isMobile) {
                    if (isCenter) return { 
                      x: 0, 
                      scale: 1, 
                      opacity: 1, 
                      zIndex: 10,
                      rotateY: 0,
                      z: 0
                    }
                    if (isLeft) return { 
                      x: -200, 
                      scale: 0.8, 
                      opacity: 0.7, 
                      zIndex: 5,
                      rotateY: 20,
                      z: -40
                    }
                    if (isRight) return { 
                      x: 200, 
                      scale: 0.8, 
                      opacity: 0.7, 
                      zIndex: 5,
                      rotateY: -20,
                      z: -40
                    }
                    return { 
                      x: position > 0 ? 400 : -400, 
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
