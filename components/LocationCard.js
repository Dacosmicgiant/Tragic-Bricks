import Image from 'next/image';
import Link from 'next/link';
import { FaGhost, FaMapMarkerAlt, FaStar, FaComment } from 'react-icons/fa';

export default function LocationCard({ location }) {
  return (
    <Link 
      href={`/locations/${location._id}`}
      className="group bg-haunted-light rounded-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={location.images[0] || '/placeholder.jpg'}
          alt={location.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-serif text-xl text-white mb-2 line-clamp-1">{location.name}</h3>
          <div className="flex items-center text-gray-300 text-sm space-x-4">
            <span className="flex items-center">
              <FaMapMarkerAlt className="mr-1" />
              {location.city}, {location.state}
            </span>
            <span className="flex items-center">
              <FaGhost className="mr-1" />
              {location.type}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
          {location.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-gray-300">
            <span className="flex items-center">
              <FaStar className="mr-1 text-accent-teal" />
              {location.rating || '0.0'}
            </span>
            <span className="flex items-center">
              <FaComment className="mr-1 text-accent-teal" />
              {location.reviews?.length || 0}
            </span>
          </div>
          <span className="text-accent-teal">View Details →</span>
        </div>
      </div>
    </Link>
  );
}
