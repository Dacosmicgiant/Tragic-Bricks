'use client';

import LocationCard from '@/components/LocationCard';
import { FaGhost, FaBuilding, FaStar, FaClock } from 'react-icons/fa';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-haunted-dark">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Haunted mansion"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-haunted-dark/90 via-haunted-dark/70 to-haunted-dark"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 animate-fade-down">
            Discover the Untold Stories
          </h1>
          <p className="text-xl text-gray-300 mb-8 animate-fade-up">
            Explore haunted locations and abandoned places with a community of urban explorers
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/locations/submit"
              className="bg-accent-teal hover:bg-accent-teal/80 text-gray-900 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Submit a Location
            </a>
            <a
              href="/locations"
              className="border border-accent-teal text-accent-teal hover:bg-accent-teal/10 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Explore Places
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-haunted-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-white mb-12 text-center">Explore by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: FaGhost, title: 'Haunted', count: '157+', link: '/locations?type=haunted' },
              { icon: FaBuilding, title: 'Abandoned', count: '243+', link: '/locations?type=abandoned' },
              { icon: FaStar, title: 'Most Reviewed', count: 'Top 50', link: '/locations?sort=reviews' },
              { icon: FaClock, title: 'Recently Added', count: 'New', link: '/locations?sort=recent' },
            ].map((category) => (
              <a
                key={category.title}
                href={category.link}
                className="group bg-haunted-dark p-6 rounded-lg hover:bg-primary-900 transition-colors"
              >
                <category.icon className="h-8 w-8 text-accent-teal mb-4 group-hover:animate-ghost-float" />
                <h3 className="text-xl text-white mb-2">{category.title}</h3>
                <p className="text-gray-400">{category.count} locations</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Locations */}
      <section className="py-16 bg-haunted-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-white mb-12 text-center">Featured Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Location cards will be dynamically populated here */}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-gradient-to-b from-haunted-dark to-haunted-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl text-white mb-8">Join Our Community</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with fellow explorers, share your experiences, and discover the mysteries that await.
          </p>
          <a
            href="/register"
            className="inline-block bg-accent-teal hover:bg-accent-teal/80 text-gray-900 px-8 py-4 rounded-md font-medium transition-colors"
          >
            Get Started Today
          </a>
        </div>
      </section>
    </div>
  );
}
