'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { FaGhost, FaSearch, FaUserCircle } from 'react-icons/fa';

export default function Navigation() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-haunted-dark/95 backdrop-blur-sm' : 'bg-haunted-dark'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-accent-teal hover:text-accent-teal/80 transition-colors"
            >
              <FaGhost className="h-6 w-6 animate-ghost-float" />
              <span className="font-serif text-xl font-bold">TragicBricks</span>
            </Link>

            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-accent-teal px-3 py-2 rounded-md text-sm transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/locations"
                  className="text-gray-300 hover:text-accent-teal px-3 py-2 rounded-md text-sm transition-colors"
                >
                  Locations
                </Link>
                <Link
                  href="/report"
                  className="text-gray-300 hover:text-accent-teal px-3 py-2 rounded-md text-sm transition-colors"
                >
                  Report
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-accent-teal px-3 py-2 rounded-md text-sm transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search locations..."
                  className="bg-haunted-light text-gray-300 pl-10 pr-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal"
                />
              </div>

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 text-gray-300 hover:text-accent-teal transition-colors"
                  >
                    <FaUserCircle className="h-5 w-5" />
                    <span>{user.username}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-accent-rust hover:bg-accent-rust/80 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-accent-teal transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-accent-teal hover:bg-accent-teal/80 text-gray-900 px-4 py-2 rounded-md transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-accent-teal"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-haunted-light">
          <Link
            href="/about"
            className="text-gray-300 hover:text-accent-teal block px-3 py-2 rounded-md text-base"
          >
            About Us
          </Link>
          <Link
            href="/locations"
            className="text-gray-300 hover:text-accent-teal block px-3 py-2 rounded-md text-base"
          >
            Locations
          </Link>
          <Link
            href="/report"
            className="text-gray-300 hover:text-accent-teal block px-3 py-2 rounded-md text-base"
          >
            Report
          </Link>
          <Link
            href="/contact"
            className="text-gray-300 hover:text-accent-teal block px-3 py-2 rounded-md text-base"
          >
            Contact
          </Link>
          {user ? (
            <>
              <Link
                href="/profile"
                className="text-gray-300 hover:text-accent-teal block px-3 py-2 rounded-md text-base"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="w-full text-left text-gray-300 hover:text-accent-teal block px-3 py-2 rounded-md text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-300 hover:text-accent-teal block px-3 py-2 rounded-md text-base"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-gray-300 hover:text-accent-teal block px-3 py-2 rounded-md text-base"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
