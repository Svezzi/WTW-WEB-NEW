import { Search } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative h-[600px] w-full">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-8 text-4xl font-bold text-white md:text-6xl">
          Discover Amazing Walking Routes
        </h1>
        <p className="mb-12 max-w-2xl text-lg text-gray-200">
          Explore curated walking routes in cities around the world. Find hidden gems and local favorites.
        </p>
        
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            placeholder="Search for Cities"
            className="w-full rounded-full bg-white/10 px-6 py-4 text-lg text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-[#4CAF50] p-2 text-white hover:bg-[#45a049]">
            <Search className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
} 