import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import './ProjectPage.css'

// Project data (moved from Gallery for shared access)
export const projects = [
  {
    id: 6,
    title: "African Tulip Illustration",
    category: "Illustration",
    description: "Detailed botanical artwork capturing the vivid forms and delicate structures of the African Tulip flower. This illustration showcases meticulous attention to botanical accuracy while maintaining artistic expression through careful line work and color application.",
    thumbnail: "/images/gallery/african_tulip%20copy.jpg",
    images: ["/images/gallery/african_tulip%20copy.jpg"],
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
    id: 7,
    title: "Indian Tulip Illustration",
    category: "Illustration",
    description: "Botanical illustration of the Indian Tulip featuring intricate line work and subtle color gradients. This piece demonstrates advanced technical drawing skills combined with a deep understanding of plant anatomy and morphology.",
    thumbnail: "/images/gallery/Indian_tulip%20copy.jpg",
    images: ["/images/gallery/Indian_tulip%20copy.jpg"],
    preview: { x: 0, y: -200, zoom: 1.5 },
    details: {
      medium: "Digital Painting",
      tools: ["Adobe Photoshop", "Wacom Tablet"],
      dimensions: "3500x4500px",
      completionDate: "October 2024",
      inspiration: "Celebrating the native Indian Tulip tree and its cultural significance in Indian flora"
    }
  },
  {
    id: 8,
    title: "Know Your Wild Cats (English)",
    category: "Educational Poster",
    description: "Comprehensive educational poster featuring various wild cat species with detailed information about their habitats, behaviors, and conservation status. This project combines scientific accuracy with engaging visual design to create an informative and aesthetically pleasing educational resource.",
    thumbnail: "/images/gallery/know_your_wild_cats_eng.jpg",
    images: ["/images/gallery/know_your_wild_cats_eng.jpg"],
    preview: { x: 30, y: 50, zoom: 1.8 },
    details: {
      medium: "Digital Design",
      tools: ["Adobe InDesign", "Adobe Illustrator", "Adobe Photoshop"],
      dimensions: "24x36 inches",
      completionDate: "September 2024",
      inspiration: "Raising awareness about wild cat conservation through accessible educational materials"
    }
  }
]

const ProjectPage = () => {
  const { projectId } = useParams()
  const [project, setProject] = useState(null)
  
  const { scrollYProgress } = useScroll()
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -100])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 0.5, 1])

  useEffect(() => {
    const foundProject = projects.find(p => p.id === parseInt(projectId))
    setProject(foundProject)
    
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
      {/* Hero Section with Parallax */}
      <section className="project-hero">
        <motion.div 
          className="hero-background"
          style={{ scale: heroScale, opacity: heroOpacity }}
        />
        
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-text"
          >
            <span className="project-category">{project.category}</span>
            <h1 className="project-title">{project.title}</h1>
            <p className="project-description">{project.description}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-image"
          >
            <img 
              src={project.images[0]} 
              alt={project.title}
              className="main-project-image"
            />
          </motion.div>
        </div>
        
        <motion.div 
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="scroll-line"></div>
          <span>Scroll to explore</span>
        </motion.div>
      </section>

      {/* Project Details Section */}
      <motion.section 
        className="project-details"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="container">
          <div className="details-grid">
            {/* Project Information */}
            <div className="info-card">
              <h3>Project Details</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Medium:</span>
                  <span className="info-value">{project.details.medium}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tools:</span>
                  <span className="info-value">{project.details.tools.join(', ')}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Dimensions:</span>
                  <span className="info-value">{project.details.dimensions}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Completed:</span>
                  <span className="info-value">{project.details.completionDate}</span>
                </div>
              </div>
            </div>

            {/* Inspiration */}
            <div className="inspiration-card">
              <h3>Inspiration</h3>
              <p>{project.details.inspiration}</p>
            </div>

            {/* Technical Details */}
            <div className="technical-card">
              <h3>Technical Approach</h3>
              <div className="tech-features">
                <div className="tech-feature">
                  <div className="feature-icon">🎨</div>
                  <div className="feature-content">
                    <h4>Color Theory</h4>
                    <p>Careful color palette selection to enhance visual appeal and convey emotion</p>
                  </div>
                </div>
                <div className="tech-feature">
                  <div className="feature-icon">✏️</div>
                  <div className="feature-content">
                    <h4>Precision Drawing</h4>
                    <p>Meticulous attention to anatomical accuracy and fine details</p>
                  </div>
                </div>
                <div className="tech-feature">
                  <div className="feature-icon">🔍</div>
                  <div className="feature-content">
                    <h4>Research-Driven</h4>
                    <p>Thorough research ensures scientific accuracy in all illustrations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <motion.div 
            className="project-cta"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3>Interested in similar work?</h3>
            <p>Let's discuss how we can bring your creative vision to life</p>
            <div className="cta-buttons">
              <Link to="/#contact" className="cta-button primary">
                Get in Touch
              </Link>
              <Link to="/#gallery" className="cta-button secondary">
                View More Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Navigation */}
      <nav className="project-navigation">
        <Link to="/" className="nav-home">
          ← Back to Portfolio
        </Link>
        <div className="project-nav-title">
          {project.title}
        </div>
      </nav>
    </div>
  )
}

export default ProjectPage