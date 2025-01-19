'use client';

import { useState } from 'react';
import { FaStar, FaCamera, FaTimes } from 'react-icons/fa';
import Image from 'next/image';

export default function ReviewForm({ locationId, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

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

      setImages(prev => [...prev, ...uploadedUrls]);
    } catch (error) {
      setError('Error uploading images. Please try again.');
      console.error('Image upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`/api/locations/${locationId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment,
          images,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      onClose();
    } catch (error) {
      setError('Failed to submit review. Please try again.');
      console.error('Review submission error:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-0 right-0 text-gray-400 hover:text-white transition-colors"
      >
        <FaTimes className="w-6 h-6" />
      </button>

      <h2 className="font-serif text-2xl text-white mb-6">Write a Review</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-gray-300 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-2xl focus:outline-none"
              >
                <FaStar
                  className={`w-8 h-8 ${
                    star <= rating ? 'text-accent-teal' : 'text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-gray-300 mb-2">Your Experience</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={4}
            className="w-full bg-haunted-dark text-gray-300 rounded-md border border-gray-700 p-3 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
            placeholder="Share your experience..."
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-300 mb-2">Add Photos</label>
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
              Choose Photos
            </label>
          </div>

          {uploading && (
            <p className="text-sm text-gray-400 mt-2">Uploading images...</p>
          )}

          {previewImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
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
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="bg-accent-teal hover:bg-accent-teal/80 text-gray-900 px-6 py-2 rounded-md transition-colors disabled:opacity-50"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
}
