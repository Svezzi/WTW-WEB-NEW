'use client';

import { Search, Star, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface City {
  id: number;
  name: string;
  image: string;
  description: string;
  routeCount: number;
  rating: number;
  country: string;
}

const cities: City[] = [
  {
    id: 1,
    name: 'New York',
    image: '/images/NewYork.jpeg',
    description: 'The city that never sleeps, offering endless entertainment and cultural experiences.',
    routeCount: 48,
    rating: 4.8,
    country: 'United States'
  },
  {
    id: 2,
    name: 'Paris',
    image: '/images/Paris.jpg',
    description: 'The City of Light, famous for its art, cuisine, and romantic atmosphere.',
    routeCount: 42,
    rating: 4.7,
    country: 'France'
  },
  {
    id: 3,
    name: 'Tokyo',
    image: '/images/Tokyo.jpg',
    description: 'A fascinating blend of ultra-modern and traditional Japanese culture.',
    routeCount: 35,
    rating: 4.9,
    country: 'Japan'
  },
  {
    id: 4,
    name: 'London',
    image: '/images/London.jpg',
    description: 'A historic city with a vibrant modern culture and diverse neighborhoods.',
    routeCount: 45,
    rating: 4.6,
    country: 'United Kingdom'
  },
  {
    id: 5,
    name: 'Rome',
    image: '/images/Rome.webp',
    description: 'Known for its stunning architecture, beaches, and vibrant street life.',
    routeCount: 28,
    rating: 4.7,
    country: 'Italy'
  },
  {
    id: 6,
    name: 'Berlin',
    image: '/images/Berlin.jpg',
    description: 'The Eternal City, filled with ancient history and modern Italian lifestyle.',
    routeCount: 32,
    rating: 4.8,
    country: 'Germany'
  },
  {
    id: 7,
    name: 'Amsterdam',
    image: '/images/Amsterdam.jpg',
    description: 'A charming city known for its canals, cycling culture, and museums.',
    routeCount: 25,
    rating: 4.6,
    country: 'Netherlands'
  },
  {
    id: 8,
    name: 'Barcelona',
    image: '/images/Barcelona.jpg',
    description: 'Known for its stunning architecture, beaches, and vibrant street life.',
    routeCount: 28,
    rating: 4.7,
    country: 'Spain'
  }
];

export default function CitiesPage() {
  return (
    <div className="min-h-screen bg-[#111827]">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src="/images/Hero Section 2.png"
          alt="City skyline"
          fill
          priority
          className="object-cover object-[center_45%]"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#111827]/50 to-[#111827] from-40% via-70% to-90%" />
        <div className="absolute inset-0 flex flex-col items-center px-4 text-center" style={{ paddingTop: '15vh' }}>
          <h1 className="max-w-4xl text-4xl font-bold text-white sm:text-5xl">
            Discover Local Routes
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-200">
            Explore curated walking routes in cities around the world
          </p>
          
          <div className="mt-8 flex w-full max-w-md items-center gap-2 rounded-full bg-white/10 p-2 backdrop-blur-sm">
            <Search className="ml-2 h-6 w-6 text-gray-300" />
            <input
              type="text"
              placeholder="Search for a city..."
              className="flex-1 border-0 bg-transparent px-2 text-white placeholder-gray-300 focus:outline-none focus:ring-0"
            />
            <button className="rounded-full bg-[#FF4400] px-6 py-2 text-sm font-medium text-white hover:bg-[#E63E00]">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="relative mx-auto max-w-[95%] px-4 -mt-64 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {cities.map((city) => (
            <Link
              key={city.id}
              href={`/cities/${city.id}`}
              className="group overflow-hidden rounded-lg bg-[#1F2937] border border-gray-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              <div className="relative h-64">
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-5 left-5 text-white">
                  <h2 className="text-2xl font-bold">{city.name}</h2>
                  <div className="flex items-center text-base text-gray-300 mt-2">
                    <MapPin className="mr-2 h-5 w-5" />
                    {city.country}
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                <p className="text-gray-300 text-base line-clamp-2">{city.description}</p>
                
                <div className="mt-5 flex items-center justify-between border-t border-gray-700 pt-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-[#FF4400]" />
                    <span className="ml-2 text-base font-medium text-gray-300">
                      {city.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-base text-gray-400">
                    {city.routeCount} routes
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
} 