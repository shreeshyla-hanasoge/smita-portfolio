import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Gallery.css'

import { projects } from './ProjectPage'

const Gallery = ({ id }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)
  const clamp = (v, min = 0, max = 100) => Math.min(max, Math.max(min, v))

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

  const handleProjectClick = (index) => {
    setCurrentIndex(index)
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
          Explore my creative journey through wildlife art and digital design
        </motion.p>

        <div className="carousel-container">
          <div className="carousel-wrapper">
            <div className="carousel" ref={carouselRef}>
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
                const isLeft = position === -1 || position === -2
                const isRight = position === 1 || position === 2
                const isVisible = Math.abs(position) <= 2

                return (
                  <motion.div
                    key={project.id}
                    className={`carousel-item ${isCenter ? 'center' : ''} ${isLeft ? 'left' : ''} ${isRight ? 'right' : ''} ${!isVisible ? 'hidden' : ''}`}
                    initial={false}
                    animate={{
                      scale: isCenter ? 1 : 0.85 - Math.abs(position) * 0.05,
                      opacity: isVisible ? 1 : 0.2,
                      zIndex: 20 - Math.abs(position) * 2,
                      x: `${position * 360}px`,
                      rotateY: position * -15,
                      z: Math.abs(position) * -50
                    }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.25, 0.1, 0.25, 1.0],
                      scale: { duration: 0.6 },
                      rotateY: { duration: 0.7 }
                    }}
                  >
                    <Link to={`/project/${project.id}`} className="project-link">
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
                      {isCenter && (
                        <div className="project-info">
                          <h3>{project.title}</h3>
                          <span className="project-category">{project.category}</span>
                        </div>
                      )}
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
