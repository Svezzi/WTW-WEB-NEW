'use client';

import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from "next/image";
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import CityCarousel from '@/components/features/CityCarousel';
import RouteGrid from '@/components/features/RouteGrid';
import Link from 'next/link';

export default function Home() {
  const routesScrollRef = useRef<HTMLDivElement>(null);
  const localsScrollRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const locals = [
    {
      image: '/images/Local 8.jpg',
      name: 'Emma Wilson',
      title: 'Street Photography Expert',
      routes: 24,
      location: 'London'
    },
    {
      image: '/images/Local 2.jpg',
      name: 'Isabella Romano',
      title: 'Food & Culture Guide',
      routes: 18,
      location: 'Rome'
    },
    {
      image: '/images/060294b27f354634a3998f4111f0d502.jpg',
      name: 'Maria Santos',
      title: 'History & Architecture Expert',
      routes: 15,
      location: 'Lisbon'
    },
    {
      image: '/images/webimage-BF382495-FF39-4B62-8EF84884D4DABE4B-620x413.jpg',
      name: 'James Chen',
      title: 'Urban Explorer',
      routes: 21,
      location: 'Singapore'
    },
    {
      image: '/images/Umbella-Street.jpg',
      name: 'Anna Kowalsky',
      title: 'Cultural Heritage Guide',
      routes: 16,
      location: 'Krakow'
    },
    {
      image: '/images/Local 5.jpg',
      name: 'Takashi Yamamoto',
      title: 'Night Photography Expert',
      routes: 19,
      location: 'Tokyo'
    },
    {
      image: '/images/svessikriss_Tokyo_street_Photography_Canon_EOS_90D_with_a_Canon_91cff273-49ba-4851-a512-123c136ded98.png',
      name: 'Sophie Laurent',
      title: 'Street Life Curator',
      routes: 22,
      location: 'Paris'
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full">
        <Image
          src="/images/hero-section-2.png"
          alt="Hero background"
          fill
          priority
          sizes="100vw"
          quality={100}
          className="object-cover object-[center_85%]"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#111827]/30 to-[#111827] from-30% via-60% to-85%" />
        <div className="absolute inset-0 flex flex-col px-16 md:px-32" style={{ paddingTop: '15vh' }}>
          <div className="flex flex-col">
            <div className="text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl font-street">
              IF YOU STRAY OFF THE BEATEN PATH,
            </div>
            <div className="text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl font-street">
              THE CITY TELLS YOU A DIFFERENT STORY
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-xl sm:text-2xl text-gray-200 whitespace-pre-line">
            Handcrafted city walks, secret spots, and local favorites{'\n'}-mapped by the people who actually live there
          </p>
        </div>
        
        <div className="absolute bottom-[45%] left-0 w-full px-16 md:px-32">
          <form onSubmit={handleSearch} className="flex items-center gap-3 rounded-full bg-white/10 p-4 backdrop-blur-sm max-w-3xl">
            <Search className="ml-3 h-8 w-8 text-gray-300" />
            <input
              type="text"
              placeholder="Search for Cities"
              className="flex-1 bg-transparent px-4 py-2 text-xl text-white placeholder-gray-300 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-full bg-[#FF4400] px-10 py-4 text-lg font-medium text-white hover:bg-[#E63E00]"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* City Carousel Section */}
      <CityCarousel />

      {/* Map Section */}
      <section className="relative w-full bg-[#111827]">
        <div className="mx-auto w-full">
          <div className="relative h-[400px]">
            <Image
              src="/images/Map1.png"
              alt="Route map through Paris"
              fill
              className="object-cover object-center"
            />
            {/* Blue overlay */}
            <div className="absolute inset-0 bg-[#1B4965]/30" />
            {/* Gradient overlays for better blending */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#111827] to-transparent opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent opacity-40" />
            {/* Quote Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-[90%] text-center px-8">
                <p className="text-4xl font-medium text-white md:text-5xl lg:text-6xl whitespace-pre-line leading-tight drop-shadow-[0_4px_3px_rgba(0,0,0,0.4)]">
                  "But hey, it's about the journey{'\n'}not the destination, right Jerry?"
                </p>
                <p className="mt-6 text-2xl text-gray-200 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                  — Rick Sanchez
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spots Section */}
      <section className="relative w-full bg-[#111827]">
        <div className="mx-auto w-full py-16">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold text-gray-100 font-street sm:text-5xl md:text-6xl lg:text-7xl">Featured Routes</h2>
            <p className="mt-4 text-xl text-gray-300 sm:text-2xl md:text-3xl">Explore hidden paths and urban secrets curated by local insiders.</p>
          </div>
          
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => {
                if (routesScrollRef.current) {
                  const scrollAmount = -400;
                  routesScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
              }}
              className="absolute -left-12 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/70"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => {
                if (routesScrollRef.current) {
                  const scrollAmount = 400;
                  routesScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
              }}
              className="absolute -right-12 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/70"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Scrolling container for routes */}
            <div 
              ref={routesScrollRef}
              className="hide-scrollbar flex w-full overflow-x-auto scroll-smooth"
            >
              <div className="flex border-t border-b border-gray-800">
                <RouteGrid />
                <RouteGrid />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative w-full bg-[#111827] mt-16">
        <div className="mx-auto w-full">
          <div className="relative h-[600px]">
            <Image
              src="/images/photo section 2.png"
              alt="Urban street photography"
              fill
              className="object-cover"
            />
            {/* Quote Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="max-w-[90%] text-center px-8">
                <p className="text-4xl font-medium text-white md:text-5xl lg:text-6xl whitespace-pre-line leading-tight drop-shadow-[0_4px_3px_rgba(0,0,0,0.4)]">
                  "Do not go where the path may lead,{'\n'}go instead where there is no path and leave a trail."
                </p>
                <p className="mt-6 text-2xl text-gray-200 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                  — Ralph Waldo Emerson
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Spotters Section */}
      <section className="relative w-full bg-[#111827] py-16">
        <div className="mx-auto w-full max-w-[90vw] lg:max-w-[85vw] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-100 font-street sm:text-5xl md:text-6xl lg:text-7xl">
              Meet Our Locals
            </h2>
            <p className="mt-4 text-xl text-gray-300 sm:text-2xl md:text-3xl">
              Some damn cool people who know their shit.
            </p>
          </div>

          <div className="relative mt-12">
            {/* Gradient shadows for scroll effect */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 w-[120px] h-full bg-gradient-to-r from-[#111827] to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 w-[120px] h-full bg-gradient-to-l from-[#111827] to-transparent" />

            {/* Scrolling container for locals */}
            <div 
              ref={localsScrollRef}
              className="hide-scrollbar flex w-full overflow-x-auto scroll-smooth"
            >
              <div className="flex border-t border-b border-gray-800">
                {/* First set of cards */}
                <div className="flex">
                  {locals.map((local) => (
                    <div key={local.name} className="group w-[300px] flex-none p-4">
                      <div className="overflow-hidden rounded-lg border border-gray-800 bg-[#1F2937] shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                        <div className="relative h-48">
          <Image
                            src={local.image}
                            alt={local.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-100">{local.name}</h3>
                          <p className="text-sm text-[#4CAF50]">{local.title}</p>
                          <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                            <span>{local.location}</span>
                            <span>{local.routes} routes created</span>
                          </div>
                          <Link 
                            href={`/profile/${local.name.toLowerCase().replace(' ', '-')}`}
                            className="mt-4 block w-full rounded-md bg-[#4CAF50] px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-[#45a049]"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Second set of cards (duplicate) */}
                <div className="flex">
                  {locals.map((local) => (
                    <div key={`${local.name}-duplicate`} className="group w-[300px] flex-none p-4">
                      <div className="overflow-hidden rounded-lg border border-gray-800 bg-[#1F2937] shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                        <div className="relative h-48">
          <Image
                            src={local.image}
                            alt={local.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-100">{local.name}</h3>
                          <p className="text-sm text-[#4CAF50]">{local.title}</p>
                          <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                            <span>{local.location}</span>
                            <span>{local.routes} routes created</span>
                          </div>
                          <Link 
                            href={`/profile/${local.name.toLowerCase().replace(' ', '-')}`}
                            className="mt-4 block w-full rounded-md bg-[#4CAF50] px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-[#45a049]"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}