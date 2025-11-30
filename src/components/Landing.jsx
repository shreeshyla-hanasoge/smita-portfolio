import { motion } from 'framer-motion'

const Landing = ({ id }) => {
  return (
    <section id={id} className="landing-section">
      <div className="hero-media">
        <img
          src="/images/gallery/hero_image.png"
          alt="Hero background"
        />
      </div>

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
