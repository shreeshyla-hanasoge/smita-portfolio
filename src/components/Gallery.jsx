import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Gallery.css'

const Gallery = ({ id }) => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const carouselRef = useRef(null)
  const modalRef = useRef(null)

  const projects = [
    {
      id: 1,
      title: "Modern Architecture Design",
      category: "Architecture",
      description: "Contemporary architectural design showcasing clean lines and innovative space utilization. This project features sustainable materials and innovative structural solutions that blend form and function seamlessly. The design prioritizes natural light, open spaces, and environmental integration.",
      thumbnail: "/images/gallery/architecture-1.jpg",
      images: [
        "/images/gallery/architecture-1.jpg",
        "/images/gallery/design-1.jpg",
        "/images/gallery/art-1.jpg",
        "/images/gallery/creative-1.jpg",
        "/images/gallery/portfolio-1.jpg"
      ]
    },
    {
      id: 2,
      title: "UI/UX Design System",
      category: "UI/UX Design",
      description: "Comprehensive design system with modern interfaces and user-friendly interactions. This design system includes a complete component library, design tokens, and accessibility guidelines. It ensures consistency across all digital products while maintaining flexibility for creative expression.",
      thumbnail: "/images/gallery/design-1.jpg",
      images: [
        "/images/gallery/design-1.jpg",
        "/images/gallery/architecture-1.jpg",
        "/images/gallery/portfolio-1.jpg",
        "/images/gallery/art-1.jpg"
      ]
    },
    {
      id: 3,
      title: "Digital Art Collection",
      category: "Digital Art",
      description: "Contemporary digital artwork featuring vibrant colors and abstract compositions. This collection explores the intersection of traditional artistic principles and modern digital techniques. Each piece tells a unique story through color, form, and digital manipulation.",
      thumbnail: "/images/gallery/art-1.jpg",
      images: [
        "/images/gallery/art-1.jpg",
        "/images/gallery/creative-1.jpg",
        "/images/gallery/design-1.jpg",
        "/images/gallery/architecture-1.jpg",
        "/images/gallery/portfolio-1.jpg"
      ]
    },
    {
      id: 4,
      title: "Creative Development",
      category: "Development",
      description: "Innovative coding projects showcasing modern web development techniques. This portfolio includes responsive web applications, interactive experiences, and cutting-edge frontend implementations. Each project demonstrates technical excellence and creative problem-solving.",
      thumbnail: "/images/gallery/creative-1.jpg",
      images: [
        "/images/gallery/creative-1.jpg",
        "/images/gallery/portfolio-1.jpg",
        "/images/gallery/design-1.jpg"
      ]
    },
    {
      id: 5,
      title: "Portfolio Showcase",
      category: "Portfolio",
      description: "Professional portfolio presentation highlighting various design and development projects. This comprehensive showcase demonstrates a wide range of skills from conceptual design to final implementation. It represents years of dedicated work and creative exploration.",
      thumbnail: "/images/gallery/portfolio-1.jpg",
      images: [
        "/images/gallery/portfolio-1.jpg",
        "/images/gallery/art-1.jpg",
        "/images/gallery/creative-1.jpg",
        "/images/gallery/architecture-1.jpg",
        "/images/gallery/design-1.jpg"
      ]
    }
  ]

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
    setSelectedProject(projects[index])
  }

  // Handle modal scroll for parallax effect
  const handleModalScroll = () => {
    if (modalRef.current) {
      const scrollTop = modalRef.current.scrollTop
      setIsScrolled(scrollTop > 100)
    }
  }

  // Reset scroll state when modal closes
  useEffect(() => {
    if (!selectedProject) {
      setIsScrolled(false)
    }
  }, [selectedProject])

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
                    onClick={() => handleProjectClick(index)}
                  >
                    <div className="project-image">
                      <img 
                        src={project.thumbnail} 
                        alt={project.title}
                        loading="lazy"
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

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="project-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className={`modal-content ${isScrolled ? 'scrolled' : ''}`}
              initial={{ 
                scale: 0.8, 
                opacity: 0,
                y: 50
              }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: 0
              }}
              exit={{ 
                scale: 0.8, 
                opacity: 0,
                y: 50
              }}
              transition={{ 
                duration: 0.5, 
                ease: [0.25, 0.1, 0.25, 1.0],
                scale: { duration: 0.6 },
                opacity: { duration: 0.4 }
              }}
              onClick={(e) => e.stopPropagation()}
              ref={modalRef}
              onScroll={handleModalScroll}
            >
              <button 
                className="close-modal"
                onClick={() => setSelectedProject(null)}
              >
                ×
              </button>
              
              <div className="modal-images">
                <img 
                  src={selectedProject.images[0]} 
                  alt={selectedProject.title}
                  className="modal-hero-image"
                />
                <div className="image-overlay">
                  <h2>{selectedProject.title}</h2>
                  <span className="modal-category">{selectedProject.category}</span>
                </div>
              </div>
              
              <div className="modal-info">
                <div className="project-details">
                  <div className="detail-section">
                    <h3>Project Overview</h3>
                    <p>{selectedProject.description}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h3>Technologies Used</h3>
                    <div className="tech-tags">
                      <span className="tech-tag">React</span>
                      <span className="tech-tag">Framer Motion</span>
                      <span className="tech-tag">CSS3</span>
                      <span className="tech-tag">JavaScript</span>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h3>Additional Images</h3>
                    <div className="additional-images">
                      {selectedProject.images.map((image, index) => (
                        <img 
                          key={index}
                          src={image} 
                          alt={`${selectedProject.title} ${index + 1}`}
                          className="additional-image"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button className="btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19A2 2 0 0 0 5 21H19A2 2 0 0 0 21 19V9H15V1H21Z"/>
                    </svg>
                    View Live Project
                  </button>
                  <button className="btn-secondary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                    Download Case Study
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Gallery