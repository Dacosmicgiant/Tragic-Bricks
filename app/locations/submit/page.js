'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaCamera, FaTimes, FaGhost } from 'react-icons/fa';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function SubmitLocation() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    type: 'haunted',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: ''
    },
    coordinates: {
      latitude: '',
      longitude: ''
    },
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/register?redirect=/locations/submit');
    }

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
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
            headers: {
              'Authorization': `Bearer ${token}`
            },
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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          coordinates: {
            latitude: parseFloat(formData.coordinates.latitude),
            longitude: parseFloat(formData.coordinates.longitude)
          }
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit location');
      }

      const data = await response.json();
      router.push(`/locations/${data.location._id}`);
    } catch (error) {
      setError('Error submitting location. Please try again.');
      console.error('Submit error:', error);
    }
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleCoordinatesChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-haunted-dark pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-haunted-light p-6 rounded-lg shadow-xl">
          <div className="flex items-center justify-center mb-8">
            <FaGhost className="text-accent-teal w-8 h-8 mr-3" />
            <h1 className="font-serif text-3xl text-white">Submit a Location</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-accent-rust/20 border border-accent-rust text-accent-rust rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <label htmlFor="name" className="block text-gray-300 mb-2">
                Location Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-haunted-dark text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-gray-300 mb-2">
                Location Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full bg-haunted-dark text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal"
              >
                <option value="haunted">Haunted</option>
                <option value="abandoned">Abandoned</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full bg-haunted-dark text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal"
                required
              />
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="street" className="block text-gray-300 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  id="street"
                  value={formData.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className="w-full bg-haunted-dark text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="w-full bg-haunted-dark text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal"
                  required
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-gray-300 mb-2">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className="w-full bg-haunted-dark text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal"
                  required
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-gray-300 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  value={formData.address.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  className="w-full bg-haunted-dark text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal"
                  required
                />
              </div>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-gray-300 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  step="any"
                  value={formData.coordinates.latitude}
                  onChange={(e) => handleCoordinatesChange('latitude', e.target.value)}
                  className="w-full bg-haunted-dark text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal"
                  required
                />
              </div>

              <div>
                <label htmlFor="longitude" className="block text-gray-300 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  step="any"
                  value={formData.coordinates.longitude}
                  onChange={(e) => handleCoordinatesChange('longitude', e.target.value)}
                  className="w-full bg-haunted-dark text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal"
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-gray-300 mb-2">
                Images
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="relative aspect-square bg-haunted-dark border-2 border-dashed border-gray-700 rounded-md hover:border-accent-teal transition-colors cursor-pointer flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={uploading}
                  />
                  <div className="text-center">
                    <FaCamera className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <span className="text-sm text-gray-500">
                      {uploading ? 'Uploading...' : 'Add Images'}
                    </span>
                  </div>
                </label>
              </div>
              <p className="text-sm text-gray-500">
                Upload at least one image of the location. You can upload multiple images.
              </p>
            </div>

            <button
              type="submit"
              disabled={uploading || formData.images.length === 0}
              className="w-full bg-accent-teal hover:bg-accent-teal/80 text-gray-900 py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Location
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
