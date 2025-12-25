import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import About from './components/About'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import ProjectPage from './components/ProjectPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Landing id="landing" />
              <Gallery id="gallery" />
              <About id="about" />
              <Contact id="contact" />
            </>
          } />
          <Route path="/project/:projectId" element={<ProjectPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App