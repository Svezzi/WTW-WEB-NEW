'use client';

import { Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import RouteGrid from '@/components/features/RouteGrid';
import routes from '@/data/routes';
import Image from 'next/image';
import Link from 'next/link';

interface Filter {
  label: string;
  options: { value: string; label: string }[];
}

const filters: Filter[] = [
  {
    label: 'Duration',
    options: [
      { value: 'short', label: '1-2 hours' },
      { value: 'medium', label: '2-4 hours' },
      { value: 'long', label: '4+ hours' }
    ],
  },
  {
    label: 'Rating',
    options: [
      { value: '4.8plus', label: '4.8+ Stars' },
      { value: '4.5plus', label: '4.5+ Stars' },
      { value: '4plus', label: '4.0+ Stars' }
    ],
  },
  {
    label: 'Category',
    options: [
      { value: 'vintage-treasures', label: 'Vintage Treasures' },
      { value: 'after-dark', label: 'After Dark' },
      { value: 'alternative-culture', label: 'Alternative Culture' },
      { value: 'food-and-local-eats', label: 'Food And LocalEats' },
      { value: 'street-art-and-murals', label: 'Street Art And Murals' },
      { value: 'local-legends-and-history', label: 'Local Legends And History' }
    ]
  },
  {
    label: 'Difficulty',
    options: [
      { value: 'easy', label: 'Easy (Flat terrain)' },
      { value: 'moderate', label: 'Moderate (Some hills)' },
      { value: 'challenging', label: 'Challenging (Steep areas)' }
    ],
  }
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') ?? '');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  // Initialize filters from URL params
  useEffect(() => {
    const newFilters: Record<string, string[]> = {};
    
    // Handle the special case for category parameter
    const categoryParam = searchParams?.get('category');
    if (categoryParam) {
      newFilters['Category'] = [categoryParam];
    }
    
    // Handle other filter parameters
    filters.forEach(filter => {
      const paramValue = searchParams?.get(filter.label.toLowerCase());
      if (paramValue && filter.label !== 'Category') { // Skip category as we handled it above
        newFilters[filter.label] = paramValue.split(',');
      }
    });

    setActiveFilters(newFilters);
    setSearchQuery(searchParams?.get('q') ?? '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams();
  };

  const handleFilterChange = (filterLabel: string, optionValue: string, checked: boolean) => {
    setActiveFilters(prev => {
      const currentValues = prev[filterLabel] || [];
      const newValues = checked
        ? [...currentValues, optionValue]
        : currentValues.filter(value => value !== optionValue);
      
      return newValues.length
        ? { ...prev, [filterLabel]: newValues }
        : Object.fromEntries(Object.entries(prev).filter(([key]) => key !== filterLabel));
    });
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set('q', searchQuery);
    }

    Object.entries(activeFilters).forEach(([key, values]) => {
      params.set(key.toLowerCase(), values.join(','));
    });

    router.push(`/search?${params.toString()}`);
  };

  // Check if a filter option is active
  const isFilterActive = (filterLabel: string, optionValue: string) => {
    return activeFilters[filterLabel]?.includes(optionValue) || false;
  };

  // Effect to update search when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateSearchParams();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [activeFilters]);

  // Filter routes based on active filters and search query
  const filteredRoutes = routes.filter(route => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText = `${route.title} ${route.description} ${route.categories.join(' ')}`.toLowerCase();
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // Filter by category
    if (activeFilters.Category?.length > 0) {
      const hasValidCategory = activeFilters.Category.some(value => 
        route.categories.some(cat => cat.toLowerCase() === value.toLowerCase())
      );
      if (!hasValidCategory) return false;
    }

    // Filter by duration
    if (activeFilters.Duration?.length > 0) {
      const [hours] = route.duration.split(' ')[0].split('-').map(Number);
      const hasValidDuration = activeFilters.Duration.some(value => {
        if (value === 'short' && hours <= 2) return true;
        if (value === 'medium' && hours > 2 && hours <= 4) return true;
        if (value === 'long' && hours > 4) return true;
        return false;
      });
      if (!hasValidDuration) return false;
    }

    // Filter by difficulty
    if (activeFilters.Difficulty?.length > 0) {
      if (!activeFilters.Difficulty.includes(route.difficulty)) return false;
    }

    // Filter by rating
    if (activeFilters.Rating?.length > 0) {
      const hasValidRating = activeFilters.Rating.some(value => {
        if (value === '4.8plus' && route.rating >= 4.8) return true;
        if (value === '4.5plus' && route.rating >= 4.5) return true;
        if (value === '4plus' && route.rating >= 4.0) return true;
        return false;
      });
      if (!hasValidRating) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#111827]">
      {/* Search Header */}
      <div className="sticky top-16 z-40 border-b border-gray-800 bg-[#111827] shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <form onSubmit={(e) => {
            e.preventDefault();
            const params = new URLSearchParams();
            if (searchQuery) {
              params.set('q', searchQuery);
            }
            router.push(`/search?${params.toString()}`);
          }} className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 rounded-md border border-gray-700 bg-[#1F2937] px-4 py-2 text-sm font-medium text-gray-200 shadow-sm hover:bg-[#374151] lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            
            <div className="flex flex-1 items-center gap-2 rounded-md border border-gray-700 bg-[#1F2937] px-3 py-2">
              <SearchIcon className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for walking routes by name, location, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-0 bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-0"
              />
            </div>
            <button
              type="submit"
              className="hidden rounded-md bg-[#FF4400] px-6 py-2 text-sm font-medium text-white hover:bg-[#E63E00] sm:block"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-full transform overflow-y-auto bg-[#1F2937] transition duration-300 ease-in-out lg:relative lg:inset-auto lg:w-72 lg:transform-none lg:rounded-lg lg:border lg:border-gray-800 ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            <div className="sticky top-0 z-10 border-b border-gray-800 bg-[#1F2937] p-4 lg:rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Filter Routes</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="rounded-md p-2 text-gray-400 hover:bg-[#374151] hover:text-gray-200 lg:hidden"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-400">Refine your search results</p>
            </div>

            <div className="p-4">
              {filters.map((filter) => (
                <div key={filter.label} className="mb-6 last:mb-0">
                  <h3 className="mb-3 font-medium text-white">{filter.label}</h3>
                  <div className="space-y-3">
                    {filter.options.map((option) => (
                      <label 
                        key={option.value} 
                        className="flex cursor-pointer items-center rounded-md p-2 hover:bg-[#374151]"
                      >
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={isFilterActive(filter.label, option.value)}
                            onChange={(e) => handleFilterChange(filter.label, option.value, e.target.checked)}
                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-600 bg-[#1F2937] checked:border-[#FF4400] checked:bg-[#FF4400] hover:border-[#FF4400]"
                          />
                          <svg
                            className="pointer-events-none absolute h-4 w-4 opacity-0 peer-checked:opacity-100"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="ml-3 text-sm text-gray-300 hover:text-white">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">Walking Routes</h1>
              <p className="mt-1 text-sm text-gray-400">
                {searchQuery 
                  ? `Showing routes matching "${searchQuery}"`
                  : "Discover unique walking experiences in cities worldwide"}
              </p>
              {Object.keys(activeFilters).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(activeFilters).map(([filterLabel, values]) => (
                    values.map(value => (
                      <span
                        key={`${filterLabel}-${value}`}
                        className="inline-flex items-center rounded-full bg-[#374151] px-3 py-1 text-sm text-gray-200"
                      >
                        {filters.find(f => f.label === filterLabel)?.options.find(o => o.value === value)?.label}
                        <button
                          onClick={() => handleFilterChange(filterLabel, value, false)}
                          className="ml-2 text-gray-400 hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ))}
                </div>
              )}
            </div>

            {/* Routes Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRoutes.map((route) => (
                <Link 
                  key={route.id} 
                  href={`/routes/${route.id}`}
                  className="group relative overflow-hidden rounded-lg bg-[#1F2937] transition-transform duration-300 hover:scale-[1.02]"
                >
                  <div className="relative aspect-[3/2] w-full">
                    <Image
                      src={route.image}
                      alt={route.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  </div>
                  <div className="relative p-4">
                    <h3 className="text-xl font-semibold text-white">{route.title}</h3>
                    <p className="mt-1 text-sm text-gray-300">{route.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center text-sm text-gray-300">
                          <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                          </svg>
                          {route.duration === 'short' ? '1-2h' : route.duration === 'medium' ? '2-4h' : '4h+'}
                        </span>
                        <span className="flex items-center text-sm text-gray-300">
                          <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                          </svg>
                          {route.rating}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Image
                          src={route.creator.image}
                          alt={route.creator.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span className="text-sm text-gray-300">{route.creator.name}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}