'use client';

import { MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Route {
  id: number;
  name: string;
  image: string;
  category: string;
  rating: number;
  location: string;
  duration: string;
  description: string;
  difficulty?: string;
}

interface RouteGridProps {
  searchQuery?: string;
  filters?: Record<string, string[]>;
}

const routes: Route[] = [
  {
    id: 1,
    name: 'Tokyo Twilight: Neon Alleys & Hidden Izakayas',
    image: '/images/TokyoTwilight.png',
    category: 'Night & Food',
    rating: 4.8,
    location: 'Tokyo',
    duration: '4-5 hours',
    description: 'Journey through glowing streets to secret local spots',
    difficulty: 'easy'
  },
  {
    id: 2,
    name: 'Roman Mornings: Cafes, Markets & Ancient Paths',
    image: '/images/RomanMorningsCafesMarketsandAncientPaths.png',
    category: 'Culture & Food',
    rating: 4.7,
    location: 'Rome',
    duration: '3-4 hours',
    description: 'Start with espresso, end with hidden trattorias',
    difficulty: 'moderate'
  },
  {
    id: 3,
    name: 'Manhattan After Dark: Jazz Clubs & Speakeasies',
    image: '/images/ManhattenAfterDark.png',
    category: 'Nightlife',
    rating: 4.9,
    location: 'New York',
    duration: '5-6 hours',
    description: 'From live music venues to secret cocktail bars',
    difficulty: 'easy'
  },
  {
    id: 4,
    name: 'East London Tales: Markets, Street Art & Pubs',
    image: '/images/London.jpg',
    category: 'Art & Culture',
    rating: 4.6,
    location: 'London',
    duration: '4-5 hours',
    description: 'Explore local markets and artistic neighborhoods',
    difficulty: 'moderate'
  },
  {
    id: 5,
    name: 'Le Marais Meander: Boutiques, Bistros & Gardens',
    image: '/images/LeMaraisMeander.png',
    category: 'Shopping & Food',
    rating: 4.5,
    location: 'Paris',
    duration: '3-4 hours',
    description: 'Shop, dine, and relax in historic Paris',
    difficulty: 'easy'
  },
  {
    id: 6,
    name: 'Hidden Montmartre Walk',
    image: '/images/MontmartreMagic.png',
    category: 'Art & Culture',
    rating: 4.7,
    location: 'Paris',
    duration: '4-5 hours',
    description: 'Discover the artistic soul of Montmartre',
    difficulty: 'challenging'
  },
  {
    id: 7,
    name: 'Kreuzberg Chronicles: Art, Beats & Street Eats',
    image: '/images/KreuzbergChronicles.png',
    category: 'Art & Music',
    rating: 4.8,
    location: 'Berlin',
    duration: '5-6 hours',
    description: 'Discover Berlin\'s creative heart and soul'
  },
  {
    id: 8,
    name: 'Soho Secrets: Vinyl, Vintage & Vibrant Bites',
    image: '/images/SohoSecrets.png',
    category: 'Culture & Shopping',
    rating: 4.9,
    location: 'London',
    duration: '4-5 hours',
    description: 'Record stores, retro shops, and hidden cafes'
  },
  {
    id: 9,
    name: 'Montmartre Magic: Artists, Cafes & Viewpoints',
    image: '/images/MontmartreMagic.png',
    category: 'Art & Culture',
    rating: 4.6,
    location: 'Paris',
    duration: '3-4 hours',
    description: 'From painter squares to panoramic views'
  },
  {
    id: 10,
    name: 'Marina Bay Moments: Hawkers, Art & Architecture',
    image: '/images/MarinaBayMoments.png',
    category: 'Food & Design',
    rating: 4.7,
    location: 'Singapore',
    duration: '4-5 hours',
    description: 'Local flavors meet modern landmarks'
  },
  {
    id: 11,
    name: "Romantic Evening in Paris",
    image: "/images/LeMaraisSunsetStart.jpg",
    category: "Night & Romance",
    rating: 4.8,
    location: "Paris",
    duration: "2.5 hours",
    description: "Experience the magic of Paris as the sun sets"
  },
  {
    id: 12,
    name: "Berlin Vintage Treasures: Second Hand Shopping Tour",
    image: "/images/BerlinVintageTreasures.jpg",
    category: "vintage-treasures",
    rating: 4.8,
    location: "Berlin",
    duration: "3.5 hours",
    description: "Discover Berlin's best vintage shops and flea markets",
    difficulty: "easy"
  }
];

export default function RouteGrid({ searchQuery, filters }: RouteGridProps) {
  // Filter routes based on search query and filters
  const filteredRoutes = routes.filter(route => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText = `${route.name} ${route.location} ${route.category} ${route.description}`.toLowerCase();
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // Apply active filters
    if (filters && Object.keys(filters).length > 0) {
      for (const [filterKey, filterValues] of Object.entries(filters)) {
        if (filterValues.length === 0) continue;

        switch (filterKey) {
          case 'Duration':
            const [hours] = route.duration.split(' ')[0].split('-').map(Number);
            const hasValidDuration = filterValues.some(value => {
              if (value === 'short' && hours <= 2) return true;
              if (value === 'medium' && hours > 2 && hours <= 4) return true;
              if (value === 'long' && hours > 4) return true;
              return false;
            });
            if (!hasValidDuration) return false;
            break;

          case 'Rating':
            const hasValidRating = filterValues.some(value => {
              if (value === '4.8plus' && route.rating >= 4.8) return true;
              if (value === '4.5plus' && route.rating >= 4.5) return true;
              if (value === '4plus' && route.rating >= 4.0) return true;
              return false;
            });
            if (!hasValidRating) return false;
            break;

          case 'Category':
            const hasValidCategory = filterValues.some(value => 
              route.category.toLowerCase() === value.toLowerCase()
            );
            if (!hasValidCategory) return false;
            break;

          case 'Difficulty':
            if (route.difficulty && !filterValues.includes(route.difficulty)) return false;
            break;
        }
      }
    }

    return true;
  });

  return (
    <>
      {filteredRoutes.map((route) => (
        <Link
          key={route.id}
          href={`/routes/${route.id === 11 ? 'romantic-evening-in-paris' : route.id === 12 ? 'berlin-vintage-treasures' : route.id === 3 ? 'techno-trail' : route.id === 7 ? 'kreuzberg-nightlife' : route.id === 5 ? 'romantic-evening-in-paris' : route.id === 9 ? 'romantic-evening-in-paris' : route.id === 6 ? 'romantic-evening-in-paris' : route.id === 2 ? 'romantic-evening-in-paris' : route.id === 1 ? 'berlin-vintage-treasures' : route.id === 8 ? 'techno-trail' : route.id === 4 ? 'berlin-vintage-treasures' : route.id === 10 ? 'romantic-evening-in-paris' : 'berlin-vintage-treasures'}`}
          className="flex-none w-[400px] cursor-pointer"
        >
          <div className="group overflow-hidden rounded-lg border border-gray-800 bg-[#1F2937] shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
            <div className="relative h-80">
              <Image
                src={route.image}
                alt={route.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 rounded-full bg-[#1F2937] px-2 py-1 text-sm font-medium text-gray-200">
                {route.category}
              </div>
            </div>
            
            <div className="flex flex-col h-[250px] p-6">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xl font-semibold leading-tight text-gray-100 line-clamp-2">{route.name}</h3>
                <div className="flex items-center flex-shrink-0">
                  <Star className="h-5 w-5 text-[#4CAF50]" />
                  <span className="ml-1 text-base text-gray-300">{route.rating}</span>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between text-base text-gray-400">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  {route.location}
                </div>
                <div className="text-gray-400">
                  {route.duration}
                </div>
              </div>
              
              <p className="mt-3 text-base text-gray-400 line-clamp-3">{route.description}</p>
              
              <button className="mt-auto w-full rounded-md bg-[#4CAF50] px-4 py-2.5 text-base font-medium text-white transition-colors hover:bg-[#45a049]">
                View Details
              </button>
            </div>
          </div>
        </Link>
      ))}
      {filteredRoutes.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-400">No routes found matching your criteria. Try adjusting your filters or search term.</p>
        </div>
      )}
    </>
  );
} 