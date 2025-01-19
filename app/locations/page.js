'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LocationCard from '@/components/LocationCard';
import { FaFilter, FaSearch, FaGhost, FaBuilding, FaHistory, FaQuestion, FaPlus } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    sort: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const searchParams = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const type = searchParams.get('type');
    const sort = searchParams.get('sort');
    if (type) setFilters(prev => ({ ...prev, type }));
    if (sort) setFilters(prev => ({ ...prev, sort }));
    fetchLocations();
  }, [searchParams]);

  const fetchLocations = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.sort) queryParams.append('sort', filters.sort);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`/api/locations?${queryParams.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error fetching locations');
      }

      setLocations(data.locations);
    } catch (error) {
      setError('Failed to fetch locations');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLocations();
  };

  const typeIcons = {
    haunted: FaGhost,
    abandoned: FaBuilding,
    historical: FaHistory,
    mysterious: FaQuestion,
  };

  return (
    <div className="min-h-screen bg-haunted-dark pt-24">
      {/* Search and Filter Bar */}
      <div className="bg-haunted-light border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearch} className="w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="Search locations..."
                  className="w-full md:w-96 bg-haunted-dark text-gray-300 pl-10 pr-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </form>

            <div className="flex items-center gap-4">
              {user && (
                <Link
                  href="/locations/submit"
                  className="flex items-center gap-2 bg-accent-teal hover:bg-accent-teal/80 text-gray-900 px-4 py-2 rounded-md transition-colors"
                >
                  <FaPlus className="w-4 h-4" />
                  Submit Location
                </Link>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-gray-300 hover:text-accent-teal transition-colors"
              >
                <FaFilter />
                Filters
              </button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => {
                    setFilters(prev => ({ ...prev, type: e.target.value }));
                    fetchLocations();
                  }}
                  className="w-full bg-haunted-dark text-gray-300 px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                >
                  <option value="">All Types</option>
                  <option value="haunted">Haunted</option>
                  <option value="abandoned">Abandoned</option>
                  <option value="historical">Historical</option>
                  <option value="mysterious">Mysterious</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => {
                    setFilters(prev => ({ ...prev, sort: e.target.value }));
                    fetchLocations();
                  }}
                  className="w-full bg-haunted-dark text-gray-300 px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                >
                  <option value="">Most Relevant</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="recent">Recently Added</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-accent-teal">Loading...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-accent-rust">{error}</div>
        ) : locations.length === 0 ? (
          <div className="text-center py-12">
            <FaGhost className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No locations found</h3>
            <p className="text-gray-400 mb-4">
              Try adjusting your filters or search terms
            </p>
            {!user && (
              <p className="text-gray-400">
                <Link href="/register" className="text-accent-teal hover:text-accent-teal/80 transition-colors">
                  Register
                </Link>{' '}
                or{' '}
                <Link href="/login" className="text-accent-teal hover:text-accent-teal/80 transition-colors">
                  Log in
                </Link>{' '}
                to submit locations
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((location) => (
              <LocationCard key={location._id} location={location} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
