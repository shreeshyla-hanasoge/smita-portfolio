import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import './ProjectPage.css'

// Project data (moved from Gallery for shared access)
export const projects = [
  {
    id: 1,
    title: "ABC of Indian Birds",
    category: "Illustration",
    description: "A personal project --- I created a pocket book featuring commonly found Indian birds, each accompanied by fun facts to spark interest in birding and nature among the general public. Every illustrated bird included a unique detail or observation. I would love to create similar series on **urban gardens, plants, insects, and other species** as well.",
    thumbnail: "/images/gallery/thumbnails/ABC.jpg",
    images: ["/images/gallery/ABC1.jpg", "/images/gallery/ABC2.jpg", "/images/gallery/ABC3.jpg", "/images/gallery/ABC4.jpg"],
    preview: { x: 0, y: -200, zoom: 1 },
    details: {
      medium: "Digital Illustration",
      tools: ["Procreate", "Adobe Illustrator"],
      dimensions: "3000x4000px",
      completionDate: "November 2024",
      inspiration: "Inspired by the vibrant colors and unique structure of the African Tulip flower found in tropical regions"
    }
  },
  {
    id: 2,
    title: "Deva Dhaare",
    category: "Illustration",
    description: "Nestled in Sakleshpur at the foothills of the Western Ghats, **Deva Dhaare** is an eco-conscious homestay celebrating its rich biodiversity. Collaborating with renowned artist **Sangeetha Kadur**, I designed displays showcasing the region's endemic species, enhancing guests' appreciation and understanding of this unique ecological haven.",
    thumbnail: "/images/gallery/thumbnails/deva_dhaare.jpg",
    images: ["/images/gallery/devadhaare1.jpg", "/images/gallery/devadhaare2.jpg"],
    preview: { x: 0, y: -200, zoom: 1 },
    details: {
      medium: "Digital Painting",
      tools: ["Adobe Photoshop", "Wacom Tablet"],
      dimensions: "3500x4500px",
      completionDate: "October 2024",
      inspiration: "Celebrating the native Indian Tulip tree and its cultural significance in Indian flora"
    }
  },
  {
    id: 3,
    title: "Hampi & the Sun Jewel",
    category: "Educational Poster",
    description: "Board game illustration for **Hampi & the Sun Jewel** by Tacit Games. I worked on the tile elements, characters, and box-cover artwork. It was an exciting project that gave me an opportunity to explore the beautiful landscape of the erstwhile **Vijayanagara empire**. The game features a unique combination of strategy and luck, with players navigating through the complex terrain of Hampi to collect jewels and reach the Sun Jewel at the end of the game.",
    thumbnail: "/images/gallery/thumbnails/hampi.jpg",
    images: ["/images/gallery/hampi1.jpg", "/images/gallery/hampi2.jpg", "/images/gallery/hampi3.jpg", "/images/gallery/hampi4.jpg"],
    preview: { x: 30, y: 50, zoom: 1 },
    details: {
      medium: "Digital Design",
      tools: ["Adobe InDesign", "Adobe Illustrator", "Adobe Photoshop"],
      dimensions: "24x36 inches",
      completionDate: "September 2024",
      inspiration: "Raising awareness about wild cat conservation through accessible educational materials"
    }
  },
  {
    id: 4,
    title: "Holematthi Nature Foundation -- Creatives",
    category: "Educational Poster",
    description: "In collaboration with the **Holematthi Nature Foundation (HNF)**, I developed engaging educational activities for children focused on the **Kaveri River ecosystem**. The project highlighted the river's diverse riparian habitat and its native species through creatives such as face masks, finger puppets, an educational jigsaw puzzle, and more.",
    thumbnail: "/images/gallery/thumbnails/holematthi.jpg",
    images: ["/images/gallery/holematthi1.jpg", "/images/gallery/holematthi2.jpg", "/images/gallery/holematthi3.jpg", "/images/gallery/holematthi4.jpg"],
    preview: { x: 30, y: 50, zoom: 1 },
    details: {
      medium: "Digital Design",
      tools: ["Adobe InDesign", "Adobe Illustrator", "Adobe Photoshop"],
      dimensions: "24x36 inches",
      completionDate: "September 2024",
      inspiration: "Raising awareness about wild cat conservation through accessible educational materials"
    }
  },
  {
    id: 5,
    title: "Early Bird -- Creatives",
    category: "Educational Poster",
    description: "Working with **Early Bird** (part of the **Nature Conservation Foundation**), I illustrated various activity materials for children as part of their educational outreach programs.",
    thumbnail: "/images/gallery/thumbnails/early_bird.jpg",
    images: ["/images/gallery/early_bird1.jpg", "/images/gallery/early_bird2.jpg", "/images/gallery/early_bird3.jpg"],
    preview: { x: 30, y: 50, zoom: 1 },
    details: {
      medium: "Digital Design",
      tools: ["Adobe InDesign", "Adobe Illustrator", "Adobe Photoshop"],
      dimensions: "24x36 inches",
      completionDate: "September 2024",
      inspiration: "Raising awareness about wild cat conservation through accessible educational materials"
    }
  },
  {
    id: 6,
    title: "L Street -- Community Creatives",
    category: "Educational Poster",
    description: "For this community project, I designed a series of visuals celebrating the unique flora and fauna of the locality. Each piece highlights the trees, birds, insects, and small wildlife that shape the neighbourhood's identity. The artworks were created to spark curiosity, encourage residents to notice local biodiversity, and build a sense of shared stewardship. By blending illustration, research, and observation, the project aims to make nature more visible in everyday spaces and inspire deeper engagement with the environment.",
    thumbnail: "/images/gallery/thumbnails/Lstreet.jpg",
    images: ["/images/gallery/Lstreet1.jpg", "/images/gallery/Lstreet2.jpg", "/images/gallery/Lstreet3.jpg", "/images/gallery/Lstreet4.jpg"],
    preview: { x: 30, y: 50, zoom: 1 },
    details: {
      medium: "Digital Design",
      tools: ["Adobe InDesign", "Adobe Illustrator", "Adobe Photoshop"],
      dimensions: "24x36 inches",
      completionDate: "September 2024",
      inspiration: "Raising awareness about wild cat conservation through accessible educational materials"
    }
  },
  {
    id: 7,
    title: "FruitStudies",
    category: "Educational Poster",
    description: "Created during my early days of painting, these fruit studies were a way to slow down and learn through observation. Simple subjects allowed space to focus on colour, texture and technique, laying the groundwork for later work.",
    thumbnail: "/images/gallery/thumbnails/fruit.jpg",
    images: ["/images/gallery/fruit_orange.jpg", "/images/gallery/fruit_papaya.jpg", "/images/gallery/fruit_pomegranate.jpg", "/images/gallery/fruit_tomato.jpg"],
    preview: { x: 30, y: 50, zoom: 1 },
    details: {
      medium: "Digital Design",
      tools: ["Adobe InDesign", "Adobe Illustrator", "Adobe Photoshop"],
      dimensions: "24x36 inches",
      completionDate: "September 2024",
      inspiration: "Raising awareness about wild cat conservation through accessible educational materials"
    }
  },
]

const ProjectPage = () => {
  const { projectId } = useParams()
  const [project, setProject] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  
  const otherProjects = project ? projects.filter(p => p.id !== project.id) : []
  
  const { scrollYProgress } = useScroll()
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])

  // Carousel navigation functions
  const handlePrev = () => {
    if (otherProjects.length === 0) return
    setCurrentIndex((prevIndex) => (prevIndex - 1 + otherProjects.length) % otherProjects.length)
  }

  const handleNext = () => {
    if (otherProjects.length === 0) return
    setCurrentIndex((prevIndex) => (prevIndex + 1) % otherProjects.length)
  }

  // Lightbox functions
  const openLightbox = (index) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    document.body.style.overflow = 'unset'
  }

  const nextLightboxImage = (e) => {
    e?.stopPropagation()
    if (project && project.images) {
      setLightboxIndex((prev) => (prev + 1) % project.images.length)
    }
  }

  const prevLightboxImage = (e) => {
    e?.stopPropagation()
    if (project && project.images) {
      setLightboxIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
    }
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return
      
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextLightboxImage()
      if (e.key === 'ArrowLeft') prevLightboxImage()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, project])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -100])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 0.5, 1])

  useEffect(() => {
    const foundProject = projects.find(p => p.id === parseInt(projectId))
    setProject(foundProject)
    setIsLightboxOpen(false)
    setCurrentIndex(0)
    
    // Scroll to top when project changes
    window.scrollTo(0, 0)
    
    // Update document title
    if (foundProject) {
      document.title = `${foundProject.title} - Smita Portfolio`
    }
  }, [projectId])

  if (!project) {
    return (
      <div className="project-not-found">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="not-found-content"
        >
          <h2>Project Not Found</h2>
          <p>The project you're looking for doesn't exist.</p>
          <Link to="/" className="back-button">
            ← Back to Portfolio
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="project-page">
      {/* Header Section */}
      <section className="project-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="header-content"
          >
            {/* <span className="project-category">{project.category}</span> */}
            <h1 className="project-title">{project.title}</h1>
            <p className="project-description">{project.description}</p>
            
            {/* Project Tags */}
            {/* <div className="project-tags">
              {project.details.tools.map((tool, index) => (
                <span key={index} className="project-tag">
                  {tool}
                </span>
              ))}
              <span className="project-tag">{project.details.medium}</span>
              <span className="project-tag">{project.details.dimensions}</span>
            </div> */}
          </motion.div>
        </div>
      </section>

      {/* Project Gallery Section */}
      {project.images && project.images.length > 0 && (
        <section className="project-gallery">
          <div className="container">
            <div className="images-grid">
              {project.images.map((image, index) => (
                <motion.div
                  key={index}
                  className="gallery-image-item clickable-image"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => openLightbox(index)}
                >
                  <img src={image} alt={`${project.title} view ${index + 1}`} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h3>Client Testimonials</h3>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Smita's attention to detail and artistic vision brought our project to life in ways we couldn't have imagined. The botanical illustrations were scientifically accurate yet beautifully artistic."</p>
              </div>
              <div className="testimonial-author">
                <span className="author-name">Dr. Sarah Chen</span>
                <span className="author-role">Botanical Research Institute</span>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Working with Smita was an absolute pleasure. Her ability to translate complex educational concepts into visually engaging materials made our wild cat conservation campaign incredibly effective."</p>
              </div>
              <div className="testimonial-author">
                <span className="author-name">Michael Rodriguez</span>
                <span className="author-role">Wildlife Conservation NGO</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Other Projects Carousel */}
      <section className="explore-projects">
        <div className="container">
          <h3>Explore Other Projects</h3>
          <div className="carousel-container">
            <div className="carousel-wrapper">
              <div className="carousel">
                {otherProjects.map((otherProject, index) => {
                    // Calculate relative position to center (0)
                    let position = index - currentIndex
                    const length = otherProjects.length
                    
                    // Handle circular positioning
                    if (position > Math.floor(length / 2)) {
                      position = position - length
                    } else if (position < -Math.floor(length / 2)) {
                      position = position + length
                    }
                    
                    const isCenter = position === 0
                    const isLeft = position === -1 || position === -2
                    const isRight = position === 1 || position === 2
                    const isVisible = Math.abs(position) <= 2
                    
                    return (
                      <motion.div
                        key={otherProject.id}
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
                        <Link to={`/project/${otherProject.id}`} className="project-link">
                          <div className="project-image">
                            <motion.img 
                              src={otherProject.thumbnail} 
                              alt={otherProject.title}
                              loading="lazy"
                              style={{ 
                                transformOrigin: '50% 50%',
                                objectPosition: '50% 50%',
                                scale: 1
                              }}
                            />
                            <div className="project-overlay">
                              <span className="view-project">View Project</span>
                            </div>
                          </div>
                          {isCenter && (
                            <div className="project-info">
                              <h4>{otherProject.title}</h4>
                              {/* <span className="project-category">{otherProject.category}</span> */}
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
          </div>
        </div>
      </section>

      {/* Navigation */}
      {/* <nav className="project-navigation">
        <Link to="/" className="nav-home">
          ← Back to Portfolio
        </Link>
        <div className="project-nav-title">
          {project.title}
        </div>
      </nav> */}
      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeLightbox}
          >
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button className="lightbox-close" onClick={closeLightbox}>×</button>
              <button className="lightbox-nav prev" onClick={prevLightboxImage}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <motion.img 
                key={lightboxIndex}
                src={project.images[lightboxIndex]} 
                alt={`${project.title} view ${lightboxIndex + 1}`}
                className="lightbox-image"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              />
              <button className="lightbox-nav next" onClick={nextLightboxImage}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
              <div className="lightbox-counter">
                {lightboxIndex + 1} / {project.images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProjectPage