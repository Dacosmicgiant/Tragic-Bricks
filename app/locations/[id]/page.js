'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaGhost, FaMapMarkerAlt, FaStar, FaClock, FaCamera } from 'react-icons/fa';
import ReviewForm from '@/components/ReviewForm';

export default function LocationDetail({ params }) {
  const [activeImage, setActiveImage] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchLocation();
  }, [params.id]);

  const fetchLocation = async () => {
    try {
      const response = await fetch(`/api/locations/${params.id}`);
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
    return <div className="text-center py-10">Loading...</div>;
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
    return <div className="text-center py-10">Location not found</div>;
  }

  return (
    <div className="min-h-screen bg-haunted-dark pt-16">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image
          src={location.images[activeImage]}
          alt={location.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">{location.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-300">
              <span className="flex items-center">
                <FaGhost className="mr-2" />
                {location.type}
              </span>
              <span className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                {location.address.city}, {location.address.state}
              </span>
              <span className="flex items-center">
                <FaStar className="mr-2 text-accent-teal" />
                {location.averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="flex gap-2 overflow-x-auto pb-4">
          {location.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden ${
                index === activeImage ? 'ring-2 ring-accent-teal' : ''
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
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-haunted-light rounded-lg p-6 mb-8">
              <h2 className="font-serif text-2xl text-white mb-4">About this Location</h2>
              <p className="text-gray-300">{location.description}</p>
            </div>

            {/* Reviews Section */}
            <div className="bg-haunted-light rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl text-white">Reviews</h2>
                {user && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-accent-teal hover:bg-accent-teal/80 text-gray-900 px-4 py-2 rounded-md transition-colors"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {/* Review List */}
              <div className="space-y-6">
                {location.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-700 pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <Image
                          src={review.user.image}
                          alt={review.user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="ml-3">
                          <h4 className="text-white">{review.user.name}</h4>
                          <div className="flex items-center">
                            <div className="flex text-accent-teal">
                              {[...Array(review.rating)].map((_, i) => (
                                <FaStar key={i} className="w-4 h-4" />
                              ))}
                            </div>
                            <span className="ml-2 text-gray-400 text-sm">
                              <FaClock className="inline mr-1" />
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{review.comment}</p>
                    {review.images?.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {review.images.map((image, imgIndex) => (
                          <div key={imgIndex} className="relative w-24 h-24 flex-shrink-0">
                            <Image
                              src={image}
                              alt={`Review image ${imgIndex + 1}`}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-haunted-light rounded-lg p-6 sticky top-24">
              <h3 className="font-serif text-xl text-white mb-4">Location Details</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="w-5 h-5 mr-3 text-accent-teal" />
                  <span>{location.address.street}, {location.address.city}, {location.address.state}</span>
                </div>
                <div className="flex items-center">
                  <FaGhost className="w-5 h-5 mr-3 text-accent-teal" />
                  <span>{location.type}</span>
                </div>
                <div className="flex items-center">
                  <FaCamera className="w-5 h-5 mr-3 text-accent-teal" />
                  <span>{location.images.length} Photos</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-700">
                <button
                  onClick={() => window.open(`https://maps.google.com/?q=${location.address.street}+${location.address.city}+${location.address.state}`, '_blank')}
                  className="w-full bg-accent-teal hover:bg-accent-teal/80 text-gray-900 px-4 py-2 rounded-md transition-colors"
                >
                  View on Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-haunted-light rounded-lg p-6 max-w-2xl w-full mx-4">
            <ReviewForm locationId={location._id} onClose={() => setShowReviewForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
