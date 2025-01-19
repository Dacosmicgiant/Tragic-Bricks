'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ type: '', query: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchLocations();
  }, [filter]);

  const fetchLocations = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filter.type) queryParams.append('type', filter.type);
      if (filter.query) queryParams.append('query', filter.query);

      const response = await fetch(`/api/locations?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error fetching locations');
      }

      setLocations(data.locations);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Haunted Locations</h1>
        {user && (
          <Link
            href="/locations/submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Submit Location
          </Link>
        )}
      </div>

      <div className="mb-8 flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            name="query"
            placeholder="Search locations..."
            value={filter.query}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          name="type"
          value={filter.type}
          onChange={handleFilterChange}
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Types</option>
          <option value="abandoned">Abandoned</option>
          <option value="haunted">Haunted</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => (
          <Link
            key={location._id}
            href={`/locations/${location._id}`}
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {location.images[0] && (
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={location.images[0]}
                  alt={location.name}
                  className="object-cover w-full h-48"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">{location.name}</h2>
                <span className="px-2 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
                  {location.type}
                </span>
              </div>
              <p className="text-gray-600 mb-2 line-clamp-2">{location.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>By {location.discoveredBy.username}</span>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span>{location.averageRating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {locations.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No locations found. {user ? 'Be the first to submit one!' : 'Sign in to submit locations!'}
        </div>
      )}
    </div>
  );
}
