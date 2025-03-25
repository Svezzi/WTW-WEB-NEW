'use client';

import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from "next/image";
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CityCarousel from '@/components/features/CityCarousel';
import RouteGrid from '@/components/features/RouteGrid';
import Link from 'next/link';

export default function Home() {
  const routesScrollRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState<'left' | 'right' | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  
  // Auto-scroll when hovering over edges
  const startScrolling = (direction: 'left' | 'right') => {
    setIsScrolling(direction);
  };
  
  const stopScrolling = () => {
    setIsScrolling(null);
  };

  // Handle automatic scrolling for routes
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;
    const scrollSpeed = 8;

    if (isScrolling) {
      scrollInterval = setInterval(() => {
        if (routesScrollRef.current) {
          const scrollAmount = isScrolling === 'left' ? -scrollSpeed : scrollSpeed;
          routesScrollRef.current.scrollLeft += scrollAmount;

          // Reset scroll position when reaching the end
          const scrollWidth = routesScrollRef.current.scrollWidth;
          const containerWidth = routesScrollRef.current.clientWidth;
          const scrollPosition = routesScrollRef.current.scrollLeft;

          if (scrollPosition + containerWidth >= scrollWidth) {
            routesScrollRef.current.scrollLeft = 0;
          } else if (scrollPosition <= 0 && isScrolling === 'left') {
            routesScrollRef.current.scrollLeft = scrollWidth - containerWidth;
          }
        }
      }, 16);
    }

    return () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
    };
  }, [isScrolling]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
          
          <div className="relative"
               onMouseEnter={() => setIsPaused(true)}
               onMouseLeave={() => {
                 setIsPaused(false);
                 setIsScrolling(null);
               }}>
            {/* Left fade and scroll trigger */}
            <div 
              className="absolute inset-y-0 left-0 z-20 w-[150px] cursor-pointer bg-gradient-to-r from-[#111827] via-[#111827]/80 to-transparent flex items-center justify-start pl-8"
              onMouseEnter={() => {
                setIsPaused(true);
                startScrolling('left');
              }}
              onMouseLeave={() => {
                setIsPaused(false);
                stopScrolling();
              }}
            >
              <ChevronLeft className="h-12 w-12 text-white/70" />
            </div>
            
            {/* Right fade and scroll trigger */}
            <div 
              className="absolute inset-y-0 right-0 z-20 w-[150px] cursor-pointer bg-gradient-to-l from-[#111827] via-[#111827]/80 to-transparent flex items-center justify-end pr-8"
              onMouseEnter={() => {
                setIsPaused(true);
                startScrolling('right');
              }}
              onMouseLeave={() => {
                setIsPaused(false);
                stopScrolling();
              }}
            >
              <ChevronRight className="h-12 w-12 text-white/70" />
            </div>
            
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
    </div>
  );
}