'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { routeService } from '@/services/routeService';
import { createBrowserClient } from '@supabase/ssr';
import { MapPin, User, Edit, Map, Clock, Route, Loader2 } from 'lucide-react';
import { RouteData } from '@/config/googleMapsConfig';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [userRoutes, setUserRoutes] = useState<RouteData[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    bio: '',
    city: '',
    avatar_url: ''
  });

  // Create Supabase client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch user data and routes on component mount
  useEffect(() => {
    async function loadUserData() {
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          window.location.href = '/sign-in';
      return;
    }

        setUser(session.user);
        
        // Get user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileData) {
          setProfile(profileData);
          setProfileData({
            username: profileData.username || '',
            bio: profileData.bio || '',
            city: profileData.city || '',
            avatar_url: profileData.avatar_url || ''
          });
        }
        
        // Get user routes
        const routes = await routeService.getUserRoutes(session.user.id);
        setUserRoutes(routes);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserData();
  }, [supabase]);

  // Handle profile form submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profileData.username,
          bio: profileData.bio,
          city: profileData.city,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local profile state
      setProfile({
        ...profile,
        ...profileData
      });
      
      // Exit edit mode
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Handle profile form input changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">You need to sign in</h1>
        <Link 
          href="/sign-in" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                {isEditingProfile ? (
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                    
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={profileData.username}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={profileData.city}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
            </div>
            
            <div>
                      <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700">Avatar URL</label>
                      <input
                        id="avatar_url"
                        name="avatar_url"
                        type="text"
                        value={profileData.avatar_url}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                          {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-8 w-8 text-indigo-600" />
                          )}
                        </div>
                        <div className="ml-4">
                          <h2 className="text-xl font-bold">{profile?.username || user.email}</h2>
                          <p className="text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="text-gray-500 hover:text-indigo-600"
                        aria-label="Edit profile"
                      >
                        <Edit size={20} />
                      </button>
                    </div>
                    
                    {profile?.bio && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">About</h3>
                        <p className="text-gray-800">{profile.bio}</p>
                      </div>
                    )}
                    
                    {profile?.city && (
                      <div className="flex items-center mb-4">
                        <MapPin size={16} className="text-gray-500 mr-2" />
                        <span className="text-gray-800">{profile.city}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Routes created</span>
                        <span className="font-semibold">{userRoutes.length}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Verified explorer</span>
                        <span className={`font-semibold ${profile?.is_verified ? 'text-green-600' : 'text-gray-500'}`}>
                          {profile?.is_verified ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    
                    {!profile?.is_verified && (
                      <div className="mt-6">
                <Link
                          href="/verification-required"
                          className="block w-full text-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-2 px-4 rounded-md font-medium"
                >
                          Apply for Verification
                </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Routes Section */}
          <div className="w-full md:w-2/3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Routes</h2>
              {profile?.is_verified && (
                <Link
                  href="/create-route"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center"
                >
                  <Route size={18} className="mr-2" />
                  Create New Route
                </Link>
              )}
        </div>

            {userRoutes.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <Map className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No routes yet</h3>
                <p className="text-gray-500 mb-6">
                  {profile?.is_verified 
                    ? "You haven't created any routes yet. Start creating your first route!" 
                    : "You need to be a verified explorer to create routes."}
                </p>
                
                {profile?.is_verified ? (
              <Link
                href="/create-route"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md inline-flex items-center"
              >
                    <Route size={18} className="mr-2" />
                Create Your First Route
              </Link>
          ) : (
                <Link
                    href="/verification-required"
                    className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-2 px-4 rounded-md inline-flex items-center font-medium"
                  >
                    Apply for Verification
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userRoutes.map(route => (
                  <Link href={`/routes/${route.id}`} key={route.id}>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                      <div className="h-40 bg-gray-200 relative">
                        {/* This would ideally be a route thumbnail or map preview */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <Map className="h-10 w-10 text-gray-400" />
                      </div>
                        <div className="absolute top-3 right-3 bg-white py-1 px-2 rounded text-xs font-medium">
                          {route.category}
                        </div>
                  </div>
                  
                  <div className="p-4">
                        <h3 className="font-bold text-lg mb-1 text-gray-900 line-clamp-1">{route.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{route.description}</p>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-1" />
                          <span>
                            {route.duration 
                              ? `${Math.round(route.duration / 60)} min` 
                              : 'Duration not set'}
                          </span>
                          <span className="mx-2">•</span>
                          <MapPin size={14} className="mr-1" />
                          <span>{route.stops?.length || 0} stops</span>
                        </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
} 