'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

const categories = [
  {
    name: 'Art & Culture',
    image: '/images/graffiti1.jpg',
    description: 'Discover museums, galleries, street art, and cultural landmarks',
    routeCount: 45,
    popularCities: ['Paris', 'London', 'Berlin'],
    highlights: ['Street Art Tours', 'Museum Routes', 'Cultural Districts']
  },
  {
    name: 'Food & Drink',
    image: '/images/La Marais Food Tour.png',
    description: 'Explore local cuisine, markets, cafes, and hidden gems',
    routeCount: 38,
    popularCities: ['Tokyo', 'Rome', 'Singapore'],
    highlights: ['Food Markets', 'Coffee Trails', 'Evening Tapas']
  },
  {
    name: 'History & Architecture',
    image: '/images/Roman Mornings, Cafes, Markets and Ancient Paths.png',
    description: 'Walk through time and architectural wonders',
    routeCount: 42,
    popularCities: ['Rome', 'Paris', 'London'],
    highlights: ['Ancient Ruins', 'Gothic Quarter', 'Modern Design']
  },
  {
    name: 'Nature & Parks',
    image: '/images/Secret Garden Path.jpg',
    description: 'Find urban oases and scenic walking paths',
    routeCount: 35,
    popularCities: ['Vancouver', 'Sydney', 'Singapore'],
    highlights: ['Urban Parks', 'Waterfront Walks', 'Garden Tours']
  },
  {
    name: 'Night & Romance',
    image: '/images/Tokyo Twilight.png',
    description: 'Experience the magic of cities after dark',
    routeCount: 28,
    popularCities: ['Paris', 'Venice', 'New York'],
    highlights: ['Sunset Views', 'Evening Strolls', 'City Lights']
  },
  {
    name: 'Shopping & Markets',
    image: '/images/East London Tales.png',
    description: 'Browse local markets, boutiques, and artisan shops',
    routeCount: 32,
    popularCities: ['London', 'Tokyo', 'Istanbul'],
    highlights: ['Vintage Shops', 'Local Markets', 'Fashion Districts']
  }
];

export default function CategoriesPage() {
  const router = useRouter();
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827]">
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full">
        <Image
          src="/images/get-inspired-abstract-street-photography-9_f7faa07b610546f3abe96d5bd7841d32.jpg"
          alt="Categories hero"
          fill
          priority
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="max-w-4xl text-4xl font-bold text-white sm:text-5xl">
            Explore Routes by Category
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-200">
            Find the perfect walking route based on your interests
          </p>
          
          <form onSubmit={handleSearch} className="mt-8 flex w-full max-w-md items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-full bg-white/10 p-2 backdrop-blur-sm">
              <Search className="ml-2 h-6 w-6 text-gray-300" />
              <input
                name="search"
                type="text"
                placeholder="Search categories..."
                className="flex-1 border-0 bg-transparent px-2 text-white placeholder-gray-300 focus:outline-none focus:ring-0"
              />
            </div>
            <button 
              type="submit"
              className="rounded-full bg-[#FF4400] px-6 py-2 text-sm font-medium text-white hover:bg-[#E63E00]"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/search?category=${encodeURIComponent(category.name.toLowerCase().replace(' & ', '-'))}`}
              className="group relative overflow-hidden rounded-lg border border-gray-800 bg-[#1F2937] hover:border-gray-700 transition-all duration-300"
            >
              <div className="relative h-64">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{category.routeCount} routes</span>
                    <span className="rounded-full bg-[#FF4400] px-4 py-1 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                      Explore Routes →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
} 