'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface City {
  id: number;
  name: string;
  image: string;
}

const cities: City[] = [
  {
    id: 1,
    name: 'Berlin',
    image: '/images/Berlin.jpg'
  },
  {
    id: 2,
    name: 'Paris',
    image: '/images/Paris.jpg'
  },
  {
    id: 3,
    name: 'New York',
    image: '/images/NewYork.jpeg'
  },
  {
    id: 4,
    name: 'London',
    image: '/images/London.jpg'
  },
  {
    id: 5,
    name: 'Tokyo',
    image: '/images/Tokyo.jpg'
  },
  {
    id: 6,
    name: 'Copenhagen',
    image: '/images/Copenhagen.jpg'
  }
];

export default function CityCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons(); // Initial check
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScrollButtons);
      }
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full bg-transparent -mt-48">
      <div className="mx-auto max-w-full px-16">
        <h2 className="mb-10 text-4xl md:text-5xl lg:text-6xl font-street text-center text-white">Top Cities</h2>
        
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute -left-12 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/70"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute -right-12 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/70"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="grid grid-cols-6 gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
          >
            {cities.map((city) => (
              <Link
                key={city.id}
                href={`/cities/${city.id}`}
                className="group relative aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-4xl font-bold text-white">{city.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 