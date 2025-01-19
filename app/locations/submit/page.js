'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaCamera, FaTimes, FaGhost } from 'react-icons/fa';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function SubmitLocation() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    type: 'haunted',
    description: '',
    street: '',
    city: '',
    state: '',
    country: '',
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/register?redirect=/locations/submit');
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    setError('');

    try {
      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...previews]);

      // Upload images to Cloudinary
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to upload image');
          }

          const data = await response.json();
          return data.url;
        })
      );

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (error) {
      setError('Error uploading images. Please try again.');
      console.error('Image upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit location');
      }

      const data = await response.json();
      router.push(`/locations/${data.location._id}`);
    } catch (error) {
      setError('Failed to submit location. Please try again.');
      console.error('Location submission error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-haunted-dark pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-haunted-light rounded-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <FaGhost className="w-8 h-8 text-accent-teal" />
            <h1 className="font-serif text-3xl text-white">Submit a Location</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Location Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full bg-haunted-dark text-gray-300 rounded-md border border-gray-700 p-3 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                  placeholder="Enter location name"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-haunted-dark text-gray-300 rounded-md border border-gray-700 p-3 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                >
                  <option value="haunted">Haunted</option>
                  <option value="abandoned">Abandoned</option>
                  <option value="historical">Historical</option>
                  <option value="mysterious">Mysterious</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={4}
                  className="w-full bg-haunted-dark text-gray-300 rounded-md border border-gray-700 p-3 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                  placeholder="Describe the location and its history..."
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-white">Location Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Street Address</label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                    required
                    className="w-full bg-haunted-dark text-gray-300 rounded-md border border-gray-700 p-3 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    required
                    className="w-full bg-haunted-dark text-gray-300 rounded-md border border-gray-700 p-3 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">State/Province</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    required
                    className="w-full bg-haunted-dark text-gray-300 rounded-md border border-gray-700 p-3 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    required
                    className="w-full bg-haunted-dark text-gray-300 rounded-md border border-gray-700 p-3 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-gray-300 mb-2">Location Photos</label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center gap-2 bg-haunted-dark text-gray-300 rounded-md border border-gray-700 p-3 cursor-pointer hover:border-accent-teal transition-colors"
                >
                  <FaCamera className="w-5 h-5" />
                  Upload Photos
                </label>
              </div>

              {uploading && (
                <p className="text-sm text-gray-400 mt-2">Uploading images...</p>
              )}

              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <p className="text-accent-rust">{error}</p>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="bg-accent-teal hover:bg-accent-teal/80 text-gray-900 px-6 py-2 rounded-md transition-colors disabled:opacity-50"
              >
                Submit Location
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
