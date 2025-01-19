'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import LocationCard from '@/components/LocationCard';
import { FaFilter, FaSearch, FaGhost, FaBuilding, FaHistory, FaQuestion, FaPlus } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const currentType = searchParams.get('type') || 'all';
  const currentSort = searchParams.get('sort') || 'recent';

  useEffect(() => {
    fetchLocations();
  }, [searchParams]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (currentType && currentType !== 'all') {
        queryParams.append('type', currentType);
      }
      if (currentSort) {
        queryParams.append('sort', currentSort);
      }
      if (searchInput) {
        queryParams.append('search', searchInput);
      }

      const response = await fetch(`/api/locations?${queryParams.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error fetching locations');
      }

      setLocations(data.locations);
      setError('');
    } catch (error) {
      setError('Failed to fetch locations');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type) => {
    const params = new URLSearchParams(searchParams);
    if (type === 'all') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    router.push(`/locations?${params.toString()}`);
  };

  const handleSortChange = (sort) => {
    const params = new URLSearchParams(searchParams);
    if (sort) {
      params.set('sort', sort);
    } else {
      params.delete('sort');
    }
    router.push(`/locations?${params.toString()}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLocations();
  };

  return (
    <div className="min-h-screen bg-haunted-dark pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif text-white">Explore Locations</h1>
          {user && (
            <Link
              href="/locations/submit"
              className="flex items-center bg-accent-teal hover:bg-accent-teal/80 text-gray-900 px-4 py-2 rounded-md transition-colors"
            >
              <FaPlus className="mr-2" />
              Add Location
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-haunted-light p-4 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search locations..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-haunted-dark text-white rounded-md border border-gray-700 focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </form>

            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleTypeChange('all')}
                className={`px-3 py-1 rounded-md ${
                  currentType === 'all'
                    ? 'bg-accent-teal text-gray-900'
                    : 'bg-haunted-dark text-gray-300 hover:bg-haunted-dark/80'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleTypeChange('haunted')}
                className={`px-3 py-1 rounded-md ${
                  currentType === 'haunted'
                    ? 'bg-accent-teal text-gray-900'
                    : 'bg-haunted-dark text-gray-300 hover:bg-haunted-dark/80'
                }`}
              >
                Haunted
              </button>
              <button
                onClick={() => handleTypeChange('abandoned')}
                className={`px-3 py-1 rounded-md ${
                  currentType === 'abandoned'
                    ? 'bg-accent-teal text-gray-900'
                    : 'bg-haunted-dark text-gray-300 hover:bg-haunted-dark/80'
                }`}
              >
                Abandoned
              </button>
            </div>

            {/* Sort Filter */}
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-haunted-dark text-white rounded-md border border-gray-700 px-3 py-2 focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
            >
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Locations Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-teal"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No locations found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => (
              <LocationCard key={location._id} location={location} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
