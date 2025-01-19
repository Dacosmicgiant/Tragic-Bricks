'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaGhost, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(formData.username, formData.email, formData.password);
      router.push('/profile');
    } catch (error) {
      setError('Failed to create account. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-haunted-dark pt-24 pb-12">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="bg-haunted-light rounded-lg p-6 md:p-8 shadow-xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <FaGhost className="w-8 h-8 text-accent-teal" />
            <h1 className="font-serif text-3xl text-white">Join TragicBricks</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  required
                  className="w-full bg-haunted-dark text-gray-300 pl-10 pr-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                  placeholder="Choose a username"
                />
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full bg-haunted-dark text-gray-300 pl-10 pr-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                  placeholder="your@email.com"
                />
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  className="w-full bg-haunted-dark text-gray-300 pl-10 pr-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                  placeholder="••••••••"
                />
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  className="w-full bg-haunted-dark text-gray-300 pl-10 pr-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                  placeholder="••••••••"
                />
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {error && (
              <div className="text-accent-rust text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-teal hover:bg-accent-teal/80 text-gray-900 py-2 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-center text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-accent-teal hover:text-accent-teal/80 transition-colors">
                Log in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
