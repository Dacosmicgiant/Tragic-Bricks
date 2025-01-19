'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaGhost, FaUser, FaEnvelope, FaCamera, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLocations, setUserLocations] = useState([]);
  const router = useRouter();
  const { user, updateProfile, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    setFormData({
      username: user.username || '',
      email: user.email || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
    });

    fetchUserLocations();
  }, [user]);

  const fetchUserLocations = async () => {
    try {
      const response = await fetch(`/api/locations?userId=${user._id}`);
      const data = await response.json();
      setUserLocations(data.locations);
    } catch (error) {
      console.error('Error fetching user locations:', error);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, avatar: data.url }));
    } catch (error) {
      setError('Error uploading avatar. Please try again.');
      console.error('Avatar upload error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-haunted-dark pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-haunted-light rounded-lg shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-accent-teal/20 to-accent-rust/20">
            <div className="absolute -bottom-16 left-8">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-haunted-light">
                {formData.avatar ? (
                  <Image
                    src={formData.avatar}
                    alt={formData.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-haunted-dark flex items-center justify-center">
                    <FaUser className="w-12 h-12 text-gray-500" />
                  </div>
                )}
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <FaCamera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-serif text-3xl text-white">{formData.username}'s Profile</h1>
              <div className="space-x-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-accent-rust hover:text-accent-rust/80 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 text-accent-rust text-sm">{error}</div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    required
                    className="w-full bg-haunted-dark text-gray-300 px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full bg-haunted-dark text-gray-300 px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full bg-haunted-dark text-gray-300 px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent-teal hover:bg-accent-teal/80 text-gray-900 py-2 rounded-md transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-gray-400 text-sm mb-1">Email</h2>
                  <p className="text-gray-300">{formData.email}</p>
                </div>

                {formData.bio && (
                  <div>
                    <h2 className="text-gray-400 text-sm mb-1">Bio</h2>
                    <p className="text-gray-300">{formData.bio}</p>
                  </div>
                )}
              </div>
            )}

            {/* User's Locations */}
            <div className="mt-12">
              <h2 className="font-serif text-2xl text-white mb-6">My Locations</h2>
              {userLocations.length === 0 ? (
                <div className="text-center py-12 bg-haunted-dark rounded-lg">
                  <FaMapMarkerAlt className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No locations yet</h3>
                  <p className="text-gray-400 mb-4">
                    Start sharing your haunted discoveries with the community
                  </p>
                  <button
                    onClick={() => router.push('/locations/submit')}
                    className="bg-accent-teal hover:bg-accent-teal/80 text-gray-900 px-6 py-2 rounded-md transition-colors"
                  >
                    Submit a Location
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userLocations.map((location) => (
                    <div
                      key={location._id}
                      className="bg-haunted-dark rounded-lg overflow-hidden cursor-pointer hover:ring-1 hover:ring-accent-teal transition-all"
                      onClick={() => router.push(`/locations/${location._id}`)}
                    >
                      <div className="relative h-48">
                        {location.images[0] ? (
                          <Image
                            src={location.images[0]}
                            alt={location.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-haunted-dark flex items-center justify-center">
                            <FaGhost className="w-12 h-12 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-medium mb-2">{location.name}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2">{location.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
