import { motion } from 'framer-motion'

const Landing = ({ id }) => {
  return (
    <section id={id} className="landing-section">
      <div className="hero-video">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hero-video-element"
        >
          <source src="/smita_hero_video_2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
        
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
      </div>
    </section>
  )
}

export default Landing
