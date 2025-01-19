'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaGhost, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      router.push('/profile');
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
      console.error('Login error:', error);
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
            <h1 className="font-serif text-3xl text-white">Welcome Back</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            {error && (
              <div className="text-accent-rust text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-teal hover:bg-accent-teal/80 text-gray-900 py-2 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            <p className="text-center text-gray-400">
              Don't have an account?{' '}
              <Link href="/register" className="text-accent-teal hover:text-accent-teal/80 transition-colors">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
