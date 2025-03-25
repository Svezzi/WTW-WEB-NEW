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
  const [currentIndex, setCurrentIndex] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const itemWidth = container.children[0].clientWidth;
      const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;
      
      if (direction === 'left') {
        setCurrentIndex((prev) => (prev === 0 ? cities.length - 1 : prev - 1));
      } else {
        setCurrentIndex((prev) => (prev === cities.length - 1 ? 0 : prev + 1));
      }

      const newScrollPosition = container.scrollLeft + scrollAmount;
      
      // If we're at the end and going right, or at the start and going left, reset position
      if (newScrollPosition > container.scrollWidth - container.clientWidth || newScrollPosition < 0) {
        container.scrollTo({
          left: direction === 'right' ? 0 : container.scrollWidth - container.clientWidth,
          behavior: 'instant'
        });
      } else {
        container.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <section className="relative w-full bg-transparent -mt-48">
      <div className="mx-auto max-w-full px-16">
        <h2 className="mb-10 text-4xl md:text-5xl lg:text-6xl font-street text-center text-white">Top Cities</h2>
        
        <div className="relative">
          {/* Left Arrow - Always visible */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-12 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          {/* Right Arrow - Always visible */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-12 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="grid auto-cols-[calc(33.333%-1rem)] grid-flow-col gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
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