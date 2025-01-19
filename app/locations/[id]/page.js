'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LocationDetail({ params }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '', images: [] });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
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

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setUploadingImages(true);
    setError('');

    try {
      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);

      // Upload images to Cloudinary
      const uploadedUrls = await Promise.all(files.map(file => uploadImage(file)));
      
      setReviewForm(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
    } catch (error) {
      setError('Error uploading images. Please try again.');
      console.error('Image upload error:', error);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setReviewForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/locations/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error submitting review');
      }

      setLocation(data.location);
      setReviewForm({ rating: 5, comment: '', images: [] });
      setPreviewImages([]);
    } catch (error) {
      setError(error.message);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div>
            {location.images && location.images.length > 0 ? (
              <div className="aspect-w-16 aspect-h-9">
                <Image
                  src={location.images[0]}
                  alt={location.name}
                  width={800}
                  height={600}
                  className="object-cover w-full h-96 rounded-lg"
                />
              </div>
            ) : (
              <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                No image available
              </div>
            )}
            {location.images && location.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {location.images.slice(1).map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`${location.name} ${index + 2}`}
                    width={200}
                    height={200}
                    className="object-cover w-full h-24 rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">{location.name}</h1>
              <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                {location.type}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{location.description}</p>

            <div className="border-t border-gray-200 pt-4">
              <h2 className="text-xl font-semibold mb-2">Location Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Address</p>
                  <p>{location.address.street}</p>
                  <p>{location.address.city}, {location.address.state}</p>
                  <p>{location.address.country}</p>
                </div>
                <div>
                  <p className="text-gray-500">Coordinates</p>
                  <p>Lat: {location.coordinates.latitude}</p>
                  <p>Long: {location.coordinates.longitude}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Rating</h2>
                <div className="flex items-center">
                  <span className="text-2xl text-yellow-400 mr-2">★</span>
                  <span className="text-xl">{location.averageRating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-gray-500">
                Discovered by {location.discoveredBy.username}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6">
          <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
          
          {user && (
            <form onSubmit={handleReviewSubmit} className="mb-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {[5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>{num} stars</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Comment</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    required
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full"
                    disabled={uploadingImages}
                  />
                  {uploadingImages && (
                    <p className="text-sm text-gray-500 mt-2">Uploading images...</p>
                  )}
                  {previewImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            width={200}
                            height={200}
                            className="rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={uploadingImages}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Submit Review
                </button>
              </div>
            </form>
          )}

          <div className="space-y-6">
            {location.reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-medium">{review.user.username}</span>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span>{review.rating}</span>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                {review.images && review.images.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {review.images.map((image, imgIndex) => (
                      <Image
                        key={imgIndex}
                        src={image}
                        alt={`Review image ${imgIndex + 1}`}
                        width={200}
                        height={200}
                        className="rounded-lg object-cover w-full h-24"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {location.reviews.length === 0 && (
              <div className="text-center text-gray-500">
                No reviews yet. {user ? 'Be the first to review!' : 'Sign in to leave a review!'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
