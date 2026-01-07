import React, { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { motion } from 'framer-motion'
import './Contact.css'

const Contact = ({ id }) => {
  const form = useRef()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [emailError, setEmailError] = useState('')

  const validateEmail = (email) => {
    // Regex for stricter email validation
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }

  const handleEmailChange = (e) => {
    const email = e.target.value;
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  }

  const sendEmail = (e) => {
    e.preventDefault()

    // Final validation before submission
    const formData = new FormData(form.current);
    const userEmail = formData.get('user_email');
    
    if (!validateEmail(userEmail)) {
      setEmailError('Please enter a valid email address');
      setStatus({ type: 'error', message: 'Please fix the errors before sending.' });
      return;
    }

    setLoading(true)
    setEmailError('')
    setStatus({ type: '', message: '' })

    // Environment variables for EmailJS
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      console.error('EmailJS environment variables are missing')
      setStatus({ type: 'error', message: 'Configuration Error: Please check your environment variables.' })
      setLoading(false)
      return
    }

    // Prepare the data and fix "Bare CR" issue for strict SMTP servers (like GoDaddy)
    // formData is already defined above
    const templateParams = {
      user_name: formData.get('user_name'),
      user_email: formData.get('user_email'),
      // Replace bare CRs and normalize line endings
      message: formData.get('message').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then(() => {
        setLoading(false)
        setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' })
        form.current.reset()
        setTimeout(() => setStatus({ type: '', message: '' }), 5000)
      }, (error) => {
        setLoading(false)
        setStatus({ type: 'error', message: 'Failed to send message. Please try again.' })
        console.error(error)
      })
  }

  return (
    <section id={id} className="contact-section">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="contact-title"
        >
          Let's Create Together
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="contact-subtitle"
        >
          We’re on the lookout for fresh, fun opportunities to create, experiment, and collaborate. If you have projects where a mix of colour, creativity, and storytelling could make a difference, we would love to get involved!
        </motion.p>

        <div className="contact-content">
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="contact-item">
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div className="contact-details">
                {/* <h3>Email</h3> */}
                <a href="mailto:smita@studiomintleaf.in" className="contact-link">
                  smita@studiomintleaf.in
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="contact-details">
                {/* <h3>Location</h3> */}
                <span className="contact-text">Bangalore, India</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="contact-form"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <form className="form" ref={form} onSubmit={sendEmail}>
              <div className="form-group">
                <input 
                  type="text" 
                  name="user_name"
                  placeholder="Your Name" 
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <input 
                  type="email" 
                  name="user_email"
                  placeholder="Your Email" 
                  className={`form-input ${emailError ? 'input-error' : ''}`}
                  onChange={handleEmailChange}
                  required
                />
                {emailError && <span className="error-text">{emailError}</span>}
              </div>
              
              <div className="form-group">
                <textarea 
                  name="message"
                  placeholder="Tell us about your project" 
                  className="form-textarea"
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="form-submit" disabled={loading}>
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>

              {status.message && (
                <div className={`status-message ${status.type}`}>
                  {status.message}
                </div>
              )}
            </form>
          </motion.div>
        </div>

        <motion.div 
          className="footer"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p>&copy; 2026 Studio Mintleaf. All rights reserved.</p>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact