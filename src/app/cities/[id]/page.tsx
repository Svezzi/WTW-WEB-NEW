'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface Expert {
  name: string;
  title: string;
  image: string;
  description: string;
  routes: number;
}

interface Category {
  title: string;
  image: string;
  description: string;
  link: string;
  value: string;
}

const berlinExperts: Expert[] = [
  {
    name: 'Lena Müller',
    title: 'Vintage fashion curator & foodie',
    image: '/images/Local 2.jpg',
    description: 'Knows all the best vintage shops and local eateries',
    routes: 12
  },
  {
    name: 'Dennis Weber',
    title: 'Urban explorer & photographer',
    image: '/images/webimage-BF382495-FF39-4B62-8EF84884D4DABE4B-620x413.jpg',
    description: 'Captures Berlin\'s hidden corners and urban landscapes',
    routes: 18
  },
  {
    name: 'Anna Schmidt',
    title: 'History & architecture expert',
    image: '/images/svessikriss_Tokyo_street_Photography_Canon_EOS_90D_with_a_Canon_91cff273-49ba-4851-a512-123c136ded98.png',
    description: 'Guides through Berlin\'s architectural marvels and historical sites',
    routes: 14
  },
  {
    name: 'Max Fischer',
    title: 'Nightlife & music scene guru',
    image: '/images/Local 9.jpg',
    description: 'Knows the best spots for Berlin\'s legendary nightlife',
    routes: 16
  },
  {
    name: 'Sophie Wagner',
    title: 'Cultural events specialist',
    image: '/images/Umbella-Street.jpg',
    description: 'Curates routes through Berlin\'s vibrant cultural scene',
    routes: 13
  },
  {
    name: 'Julia Becker',
    title: 'Alternative culture guide',
    image: '/images/Local 8.jpg',
    description: 'Expert in Berlin\'s underground and alternative scenes',
    routes: 17
  },
  {
    name: 'Thomas Krause',
    title: 'Food market specialist',
    image: '/images/Local 7.jpg',
    description: 'Knows every food market and street food spot in Berlin',
    routes: 11
  },
  {
    name: 'Marie Winter',
    title: 'Parks & gardens curator',
    image: '/images/Local 1.jpg',
    description: 'Specializes in Berlin\'s green spaces and urban gardens',
    routes: 14
  },
  {
    name: 'Felix Hoffmann',
    title: 'Music venue expert',
    image: '/images/Local 4.jpg',
    description: 'Guides through Berlin\'s diverse music scene',
    routes: 16
  },
  {
    name: 'Hannah Klein',
    title: 'Art Gallery Curator',
    image: '/images/Local 10.jpg',
    description: 'Expert in contemporary art and gallery exhibitions',
    routes: 15
  }
];

const categories: Category[] = [
  {
    title: 'Vintage Treasures',
    image: '/images/BerlinVintageTreasures.jpg',
    description: 'Discover hidden gems in Berlin\'s best vintage shops and flea markets',
    link: '/cities/berlin/vintage',
    value: 'vintage-treasures'
  },
  {
    title: 'After Dark',
    image: '/images/BerlinAfterDark.jpg',
    description: 'Experience Berlin\'s legendary nightlife and evening culture',
    link: '/cities/berlin/after-dark',
    value: 'after-dark'
  },
  {
    title: 'Alternative Culture',
    image: '/images/BerlinAlternativeCulture.jpg',
    description: 'Explore underground scenes and counter-culture spots',
    link: '/cities/berlin/alternative',
    value: 'alternative-culture'
  },
  {
    title: 'Food And LocalEats',
    image: '/images/BerlinStreetFoodAndLocalEats.jpg',
    description: 'Taste your way through Berlin\'s diverse culinary landscape',
    link: '/cities/berlin/food',
    value: 'food-and-local-eats'
  },
  {
    title: 'Street Art And Murals',
    image: '/images/BerlinStreetArtAndMurals.jpg',
    description: 'Tour the city\'s most impressive urban art and graffiti',
    link: '/cities/berlin/street-art',
    value: 'street-art-and-murals'
  },
  {
    title: 'Local Legends And History',
    image: '/images/BerlingLocalLegendsAndHistory.jpg',
    description: 'Walk through Berlin\'s rich history and fascinating stories',
    link: '/cities/berlin/history',
    value: 'local-legends-and-history'
  }
];

export default function CityPage({ params }: { params: { id: string } }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftTriggerRef = useRef<HTMLDivElement>(null);
  const rightTriggerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    const leftTrigger = leftTriggerRef.current;
    const rightTrigger = rightTriggerRef.current;
    
    if (!container || !leftTrigger || !rightTrigger) return;

    const scrollSpeed = 10;

    const startScrolling = (direction: 'left' | 'right') => {
      stopScrolling(); // Clear any existing interval first
      scrollIntervalRef.current = setInterval(() => {
        if (direction === 'left') {
          container.scrollLeft += scrollSpeed;
          if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
            container.scrollLeft = 0;
          }
        } else {
          container.scrollLeft -= scrollSpeed;
          if (container.scrollLeft <= 0) {
            container.scrollLeft = container.scrollWidth - container.clientWidth;
          }
        }
      }, 16);
    };

    const stopScrolling = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = undefined;
      }
    };

    const handleLeftTrigger = () => startScrolling('right');
    const handleRightTrigger = () => startScrolling('left');

    leftTrigger.addEventListener('mouseenter', handleLeftTrigger);
    leftTrigger.addEventListener('mouseleave', stopScrolling);
    
    rightTrigger.addEventListener('mouseenter', handleRightTrigger);
    rightTrigger.addEventListener('mouseleave', stopScrolling);
    
    container.addEventListener('mouseenter', stopScrolling);

    return () => {
      leftTrigger.removeEventListener('mouseenter', handleLeftTrigger);
      leftTrigger.removeEventListener('mouseleave', stopScrolling);
      rightTrigger.removeEventListener('mouseenter', handleRightTrigger);
      rightTrigger.removeEventListener('mouseleave', stopScrolling);
      container.removeEventListener('mouseenter', stopScrolling);
      stopScrolling();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#111827]">
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full">
        <Image
          src="/images/BERLIN2.jpg"
          alt="Berlin skyline with TV Tower (Fernsehturm) at dusk"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-4 left-4">
          <Link 
            href="/cities"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
        </div>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden my-auto">
          <h1 className="text-[20rem] md:text-[30rem] lg:text-[40rem] font-street text-white leading-none tracking-[2rem] px-4 translate-y-[10%]" style={{ letterSpacing: '0.2em' }}>BERLIN</h1>
        </div>
      </section>

      {/* Experts Section */}
      <section className="px-24 py-12">
        <div className="relative mb-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-street text-center text-white">Our Berlin Experts</h2>
          <Link 
            href="/cities/berlin/experts"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[#4CAF50] font-medium transition-colors duration-300 hover:text-[#3d8b40] flex items-center gap-2"
          >
            See All
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </Link>
        </div>
        <div className="relative">
          {/* Scroll trigger areas */}
          <div 
            ref={leftTriggerRef}
            className="absolute left-0 top-0 z-20 w-[100px] h-full bg-gradient-to-r from-[#111827] via-[#111827]/80 to-transparent cursor-pointer flex items-center justify-center group" 
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-white/50 group-hover:text-white/80 transition-opacity"
            >
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </div>
          <div 
            ref={rightTriggerRef}
            className="absolute right-0 top-0 z-20 w-[100px] h-full bg-gradient-to-l from-[#111827] via-[#111827]/80 to-transparent cursor-pointer flex items-center justify-center group" 
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-white/50 group-hover:text-white/80 transition-opacity"
            >
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>

          <div ref={containerRef} className="hide-scrollbar overflow-x-auto scroll-smooth">
            <div className="flex">
              {/* First set of cards */}
              {berlinExperts.map((expert) => (
                <div key={expert.name} className="group w-[300px] flex-none p-4">
                  <div className="flex flex-col bg-[#1F2937] rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="relative aspect-[3/2] w-full">
                      <Image
                        src={expert.image}
                        alt={expert.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4 flex flex-col">
                      <h3 className="text-xl font-semibold text-white">{expert.name}</h3>
                      <p className="text-[#4CAF50] text-sm">{expert.title}</p>
                      <div className="flex justify-between items-center text-gray-400 text-sm mt-2">
                        <span>Berlin</span>
                        <span>{expert.routes} routes created</span>
                      </div>
                      <button className="mt-4 w-full bg-[#4CAF50] text-white py-3 rounded-lg text-center font-medium transition-colors duration-300 hover:bg-[#3d8b40]">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless scrolling */}
              {berlinExperts.map((expert) => (
                <div key={`${expert.name}-duplicate`} className="group w-[300px] flex-none p-4">
                  <div className="flex flex-col bg-[#1F2937] rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                    <div className="relative aspect-[3/2] w-full">
                      <Image
                        src={expert.image}
                        alt={expert.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4 flex flex-col">
                      <h3 className="text-xl font-semibold text-white">{expert.name}</h3>
                      <p className="text-[#4CAF50] text-sm">{expert.title}</p>
                      <div className="flex justify-between items-center text-gray-400 text-sm mt-2">
                        <span>Berlin</span>
                        <span>{expert.routes} routes created</span>
                      </div>
                      <button className="mt-4 w-full bg-[#4CAF50] text-white py-3 rounded-lg text-center font-medium transition-colors duration-300 hover:bg-[#3d8b40]">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-street text-center text-white w-full">Categories</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={`/search?category=${category.value}`}
              className="group relative overflow-hidden rounded-xl"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                  <p className="mt-2 text-gray-200">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
} 