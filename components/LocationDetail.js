'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaGhost, FaMapMarkerAlt, FaStar, FaClock } from 'react-icons/fa';
import ReviewForm from '@/components/ReviewForm';
import { useAuth } from '@/context/AuthContext';
import { use } from 'react';

export default function LocationDetail({ params }) {
  const id = use(Promise.resolve(params.id));
  const [activeImage, setActiveImage] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchLocation();
  }, [id]);

  const fetchLocation = async () => {
    try {
      const response = await fetch(`/api/locations/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error fetching location');
      }

      setLocation(data.location);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading location details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Location not found
        </div>
      </div>
    );
  }

  const handleImageClick = (index) => {
    setActiveImage(index);
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      const response = await fetch(`/api/locations/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error submitting review');
      }

      // Update location with new review
      setLocation(prevLocation => ({
        ...prevLocation,
        reviews: [...prevLocation.reviews, data.review]
      }));
      setShowReviewForm(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image
          src={location.images[activeImage]}
          alt={location.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl text-white mb-4 font-bold">{location.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-300">
              <span className="flex items-center">
                <FaGhost className="mr-2 text-red-500" />
                <span className="capitalize">{location.type}</span>
              </span>
              <span className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                {location.address.city}, {location.address.state}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="flex gap-2 overflow-x-auto pb-4">
              {location.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden ${
                    index === activeImage ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${location.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Description */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl text-white mb-4">About this Location</h2>
              <p className="text-gray-300">{location.description}</p>
            </div>

            {/* Reviews Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-white">Reviews</h2>
                {user && !showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {showReviewForm && (
                <div className="mb-6">
                  <ReviewForm
                    onSubmit={handleReviewSubmit}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}

              <div className="space-y-6">
                {location.reviews?.map((review) => (
                  <div key={review._id} className="border-b border-gray-700 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-300">{review.user.username}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <FaClock className="mr-1" />
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-8">
              <h3 className="text-xl text-white mb-4">Location Details</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="w-5 h-5 mt-1 text-blue-500" />
                  <div>
                    <p>{location.address.street}</p>
                    <p>{location.address.city}, {location.address.state}</p>
                    <p>{location.address.country}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaGhost className="w-5 h-5 text-red-500" />
                  <span className="capitalize">{location.type}</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-700">
                <button
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(
                    `${location.address.street} ${location.address.city} ${location.address.state} ${location.address.country}`
                  )}`, '_blank')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  View on Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
