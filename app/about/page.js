'use client';

import { FaGhost, FaUserFriends, FaMapMarkedAlt } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-haunted-dark">
      {/* Hero Section */}
      <section className="relative py-20 bg-haunted-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-5xl text-white mb-6">About TragicBricks</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Uncovering the mysteries and stories behind abandoned and haunted places around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-haunted-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-haunted-dark p-6 rounded-lg h-full">
                <FaGhost className="w-12 h-12 text-accent-teal mx-auto mb-4" />
                <h3 className="text-xl text-white mb-4">Our Mission</h3>
                <p className="text-gray-300">
                  To document and preserve the history of forgotten places while respecting their stories and significance.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-haunted-dark p-6 rounded-lg h-full">
                <FaUserFriends className="w-12 h-12 text-accent-teal mx-auto mb-4" />
                <h3 className="text-xl text-white mb-4">Community</h3>
                <p className="text-gray-300">
                  Building a respectful community of urban explorers, historians, and paranormal enthusiasts.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-haunted-dark p-6 rounded-lg h-full">
                <FaMapMarkedAlt className="w-12 h-12 text-accent-teal mx-auto mb-4" />
                <h3 className="text-xl text-white mb-4">Documentation</h3>
                <p className="text-gray-300">
                  Creating a comprehensive database of locations with verified information and user experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-haunted-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  TragicBricks was born from a passion for urban exploration and a deep respect for historical preservation. 
                  What started as a small group of enthusiasts has grown into a global community.
                </p>
                <p>
                  Our platform serves as a bridge between the past and present, connecting people with the hidden stories 
                  that lie within abandoned structures and reportedly haunted locations.
                </p>
                <p>
                  We believe in responsible exploration and documentation, ensuring that these places and their stories 
                  are preserved for future generations.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/images/about-hero.jpg')",
                  filter: "brightness(0.7)"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Guidelines Section */}
      <section className="py-16 bg-gradient-to-b from-haunted-dark to-haunted-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-white mb-8 text-center">Our Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-haunted-dark p-6 rounded-lg">
              <h3 className="text-xl text-white mb-4">Respect the Location</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Never vandalize or damage property</li>
                <li>Take only photographs, leave only footprints</li>
                <li>Respect private property and no-trespassing signs</li>
                <li>Preserve the history and integrity of the location</li>
              </ul>
            </div>
            <div className="bg-haunted-dark p-6 rounded-lg">
              <h3 className="text-xl text-white mb-4">Community Standards</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Share accurate and verified information</li>
                <li>Be respectful to other community members</li>
                <li>Report dangerous or hazardous conditions</li>
                <li>Support and encourage responsible exploration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
