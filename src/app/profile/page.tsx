'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { routeService } from '@/services/routeService';
import { RouteData } from '@/config/googleMapsConfig';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Clock } from 'lucide-react';

interface FirestoreRoute extends Omit<RouteData, 'id'> {
  id: string;
  createdAt: Date;
  image?: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [routes, setRoutes] = useState<FirestoreRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin?redirectedFrom=/profile');
      return;
    }

    const fetchUserRoutes = async () => {
      try {
        const userRoutes = await routeService.getUserRoutes(user.uid);
        setRoutes(userRoutes as FirestoreRoute[]);
      } catch (error) {
        console.error('Error fetching user routes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoutes();
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#111827] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-12 rounded-lg bg-[#1F2937] p-8 border border-gray-800">
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-[#FF4400]">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || 'Profile'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#374151] text-2xl font-bold text-white">
                  {(user.email?.[0] || 'U').toUpperCase()}
                </div>
              )}
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-white">
                {user.displayName || 'User Profile'}
              </h1>
              <p className="mt-1 text-gray-400">{user.email}</p>
              <div className="mt-4 flex gap-4">
                <Link
                  href="/settings"
                  className="rounded-md bg-[#374151] px-4 py-2 text-sm font-medium text-white hover:bg-[#4B5563] transition-colors"
                >
                  Edit Profile
                </Link>
                <Link
                  href="/create-route"
                  className="rounded-md bg-[#FF4400] px-4 py-2 text-sm font-medium text-white hover:bg-[#E63E00] transition-colors"
                >
                  Create New Route
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* User's Routes */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-white">My Routes</h2>
          
          {loading ? (
            <div className="text-center text-gray-400">Loading routes...</div>
          ) : routes.length === 0 ? (
            <div className="rounded-lg bg-[#1F2937] p-8 text-center border border-gray-800">
              <p className="text-gray-400">You haven't created any routes yet.</p>
              <Link
                href="/create-route"
                className="mt-4 inline-block rounded-md bg-[#FF4400] px-6 py-2 text-sm font-medium text-white hover:bg-[#E63E00] transition-colors"
              >
                Create Your First Route
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {routes.map((route) => (
                <Link
                  key={route.id}
                  href={`/routes/${route.id}`}
                  className="group overflow-hidden rounded-lg border border-gray-800 bg-[#1F2937] transition-all duration-300 hover:border-gray-700 hover:shadow-xl"
                >
                  <div className="relative h-48">
                    {route.image ? (
                      <Image
                        src={route.image}
                        alt={route.title || 'Route'}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#374151]">
                        <MapPin className="h-12 w-12 text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white">
                      {route.title || 'Untitled Route'}
                    </h3>
                    
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        {route.stops?.length || 0} stops
                      </div>
                      {route.duration && (
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {route.duration} min
                        </div>
                      )}
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                      {route.description || 'No description provided'}
                    </p>
                    
                    <div className="mt-4 flex items-center justify-between border-t border-gray-700 pt-4">
                      <span className="text-sm text-gray-400">
                        {new Date(route.createdAt).toLocaleDateString()}
                      </span>
                      <button className="rounded-md bg-[#FF4400] px-4 py-1 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                        View Route →
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 