import React from 'react'
import { motion } from 'framer-motion'
import './About.css'

const About = ({ id }) => {
  return (
    <section id={id} className="about-section">
      <div className="container">
        <div className="about-content">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            About Studio Mintleaf
          </motion.h2>
          
          <div className="about-grid">
            <motion.div 
              className="about-image-wrapper"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img src="/images/gallery/Updated_logo_dark.svg" alt="Studio Mintleaf" />
            </motion.div>

            <motion.div 
              className="about-text"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p>
                Studio Mintleaf works in art, illustration and design, with a focus on nature-based subjects and visual communication. Its aim is to create work that encourages awareness, curiosity and connection.
              </p>
              <p>
                Founded by Smita Kaushik, a Bangalore-based creative with a decade of corporate experience and a long-standing interest in art, this studio is her effort to build a more intentional practice and take on projects with a positive social and environmental impact.
              </p>
              <p className="about-social">
                Find her on Instagram <a href="https://www.instagram.com/wildlife_smith" target="_blank" rel="noopener noreferrer">@wildlife_smith</a>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
