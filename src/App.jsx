import React from 'react'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import './App.css'

function App() {
  return (
    <div className="App">
      <Navbar />
      <Landing id="landing" />
      <Gallery id="gallery" />
      <Contact id="contact" />
    </div>
  )
}

export default App