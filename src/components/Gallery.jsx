import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Gallery.css'

const Gallery = ({ id }) => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)

  const projects = [
    {
      id: 1,
      title: "Wildlife Illustration Series",
      category: "Digital Art",
      description: "A collection of detailed wildlife illustrations showcasing various species in their natural habitats.",
      thumbnail: "https://picsum.photos/400/500?random=1",
      images: ["https://picsum.photos/600/800?random=1"]
    },
    {
      id: 2,
      title: "Nature App UI Design",
      category: "UI/UX Design",
      description: "Mobile application design for nature enthusiasts with intuitive navigation and organic visuals.",
      thumbnail: "https://picsum.photos/400/500?random=2",
      images: ["https://picsum.photos/600/800?random=2"]
    },
    {
      id: 3,
      title: "Conservation Website",
      category: "Web Design",
      description: "Website design for wildlife conservation organization with donation functionality.",
      thumbnail: "https://picsum.photos/400/500?random=3",
      images: ["https://picsum.photos/600/800?random=3"]
    },
    {
      id: 4,
      title: "Animal Pattern Design",
      category: "Pattern Design",
      description: "Repeatable patterns featuring animal motifs for textile and product design.",
      thumbnail: "https://picsum.photos/400/500?random=4",
      images: ["https://picsum.photos/600/800?random=4"]
    },
    {
      id: 5,
      title: "Eco Brand Identity",
      category: "Branding",
      description: "Complete brand identity for sustainable products company with nature-inspired logo.",
      thumbnail: "https://picsum.photos/400/500?random=5",
      images: ["https://picsum.photos/600/800?random=5"]
    },
    {
      id: 6,
      title: "Wildlife Photography",
      category: "Photography",
      description: "Nature photography collection capturing wildlife behavior and natural landscapes.",
      thumbnail: "https://picsum.photos/400/500?random=6",
      images: ["https://picsum.photos/600/800?random=6"]
    },
    {
      id: 7,
      title: "Educational App Design",
      category: "UI/UX Design",
      description: "Interactive learning app for children about wildlife and environmental conservation.",
      thumbnail: "https://picsum.photos/400/500?random=7",
      images: ["https://picsum.photos/600/800?random=7"]
    },
    {
      id: 8,
      title: "Nature Journal Design",
      category: "Print Design",
      description: "Custom journal design with wildlife illustrations and nature-inspired layouts.",
      thumbnail: "https://picsum.photos/400/500?random=8",
      images: ["https://picsum.photos/600/800?random=8"]
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
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
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
                />
              </div>
              
              <div className="modal-info">
                <h2>{selectedProject.title}</h2>
                <span className="modal-category">{selectedProject.category}</span>
                <p>{selectedProject.description}</p>
                <div className="modal-actions">
                  <button className="btn-primary">View Live Project</button>
                  <button className="btn-secondary">See More Details</button>
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