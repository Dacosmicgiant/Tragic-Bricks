'use client';

import { useState } from 'react';
import { FaExclamationTriangle, FaCamera, FaMapMarkerAlt } from 'react-icons/fa';

export default function ReportPage() {
  const [formData, setFormData] = useState({
    locationName: '',
    locationId: '',
    reportType: '',
    description: '',
    images: [],
    contactEmail: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setFormData({
        ...formData,
        images: Array.from(files)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'Submitting report...' });

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus({
        type: 'success',
        message: 'Report submitted successfully! We\'ll review it shortly.'
      });
      setFormData({
        locationName: '',
        locationId: '',
        reportType: '',
        description: '',
        images: [],
        contactEmail: ''
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to submit report. Please try again later.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-haunted-dark">
      {/* Hero Section */}
      <section className="relative py-20 bg-haunted-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-5xl text-white mb-6">Report a Location</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Help us maintain the integrity of our platform by reporting locations that need attention.
            </p>
          </div>
        </div>
      </section>

      {/* Report Form */}
      <section className="py-16 bg-haunted-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-haunted-dark p-8 rounded-lg">
            <div className="flex items-center justify-center mb-8">
              <FaExclamationTriangle className="text-accent-teal w-8 h-8 mr-3" />
              <h2 className="font-serif text-2xl text-white">Submit a Report</h2>
            </div>

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
                <label htmlFor="locationName" className="block text-gray-300 mb-2">Location Name</label>
                <input
                  type="text"
                  id="locationName"
                  name="locationName"
                  value={formData.locationName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-haunted-light border border-gray-600 text-white focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                  placeholder="Enter the location name"
                />
              </div>

              <div>
                <label htmlFor="locationId" className="block text-gray-300 mb-2">Location ID (if known)</label>
                <input
                  type="text"
                  id="locationId"
                  name="locationId"
                  value={formData.locationId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-haunted-light border border-gray-600 text-white focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                  placeholder="Optional: Enter the location ID"
                />
              </div>

              <div>
                <label htmlFor="reportType" className="block text-gray-300 mb-2">Report Type</label>
                <select
                  id="reportType"
                  name="reportType"
                  value={formData.reportType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-haunted-light border border-gray-600 text-white focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                >
                  <option value="">Select a report type</option>
                  <option value="inaccurate">Inaccurate Information</option>
                  <option value="inappropriate">Inappropriate Content</option>
                  <option value="dangerous">Dangerous Conditions</option>
                  <option value="closed">Location No Longer Accessible</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-gray-300 mb-2">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-2 rounded-lg bg-haunted-light border border-gray-600 text-white focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                  placeholder="Please provide detailed information about your report"
                ></textarea>
              </div>

              <div>
                <label htmlFor="images" className="block text-gray-300 mb-2">Supporting Images</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  onChange={handleChange}
                  multiple
                  accept="image/*"
                  className="w-full px-4 py-2 rounded-lg bg-haunted-light border border-gray-600 text-white focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                />
                <p className="text-sm text-gray-400 mt-2">Optional: Upload images to support your report</p>
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-gray-300 mb-2">Contact Email</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-haunted-light border border-gray-600 text-white focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                  placeholder="Enter your email for follow-up"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-accent-teal hover:bg-accent-teal/80 text-gray-900 font-medium py-3 rounded-lg transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
