'use client';

import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'Sending message...' });

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus({
        type: 'success',
        message: 'Message sent successfully! We\'ll get back to you soon.'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-haunted-dark">
      {/* Hero Section */}
      {/* <section className="relative py-20 bg-haunted-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-5xl text-white mb-6">Contact Us</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions or concerns? We're here to help. Reach out to us using any of the methods below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-haunted-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-haunted-dark p-6 rounded-lg text-center">
              <FaEnvelope className="w-8 h-8 text-accent-teal mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">Email</h3>
              <p className="text-gray-300">info@tragicbricks.com</p>
            </div>
            <div className="bg-haunted-dark p-6 rounded-lg text-center">
              <FaPhone className="w-8 h-8 text-accent-teal mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">Phone</h3>
              <p className="text-gray-300">+1 (555) 123-4567</p>
            </div>
            <div className="bg-haunted-dark p-6 rounded-lg text-center">
              <FaMapMarkerAlt className="w-8 h-8 text-accent-teal mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">Location</h3>
              <p className="text-gray-300">San Francisco, CA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-haunted-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-haunted-light p-8 rounded-lg">
            <h2 className="font-serif text-3xl text-white mb-8 text-center">Send us a Message</h2>
            
            {status.message && (
              <div className={`mb-6 p-4 rounded-lg ${
                status.type === 'success' ? 'bg-green-900 text-green-200' :
                status.type === 'error' ? 'bg-red-900 text-red-200' :
                'bg-blue-900 text-blue-200'
              }`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-haunted-dark border border-gray-600 text-white focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-haunted-dark border border-gray-600 text-white focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-haunted-dark border border-gray-600 text-white focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-300 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-2 rounded-lg bg-haunted-dark border border-gray-600 text-white focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-accent-teal hover:bg-accent-teal/80 text-gray-900 font-medium py-3 rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
