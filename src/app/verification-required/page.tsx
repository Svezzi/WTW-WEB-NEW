'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, Clock } from 'lucide-react';
import { createClient } from '@/utils/supabase';

export default function VerificationRequired() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicationStatus, setApplicationStatus] = useState<'none' | 'pending' | 'approved'>('none');
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    city: '',
    reason: '',
  });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuthAndStatus() {
      try {
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          router.push('/sign-in?redirectedFrom=/verification-required');
          return;
        }
        
        // Check if application exists
        const { data: application, error } = await supabase
          .from('route_creator_applications')
          .select('status')
          .eq('user_id', session.user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw error;
        }
        
        if (application) {
          setApplicationStatus(application.status === 'approved' ? 'approved' : 'pending');
          
          // If already approved, redirect to route creation
          if (application.status === 'approved') {
            // Update user profile
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ is_verified: true })
              .eq('id', session.user.id);
              
            if (updateError) {
              console.error('Error updating profile:', updateError);
            }
            
            router.push('/create-route');
            return;
          }
        }
        
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error checking status:', error);
        setError('Failed to load your application status');
        setIsLoading(false);
      }
    }
    
    checkAuthAndStatus();
  }, [router, supabase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        router.push('/sign-in?redirectedFrom=/verification-required');
        return;
      }
      
      // Create application
      const { error } = await supabase
        .from('route_creator_applications')
        .insert({
          user_id: session.user.id,
          full_name: formData.fullName,
          bio: formData.bio,
          city: formData.city,
          reason: formData.reason,
          status: 'pending',
          created_at: new Date().toISOString(),
        });
      
      if (error) {
        throw error;
      }
      
      setApplicationStatus('pending');
    } catch (error: any) {
      setError(error.message || 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white p-8 shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-[#4CAF50]" />
            <p className="mt-4 text-lg text-gray-600">Loading your status...</p>
          </div>
        ) : applicationStatus === 'pending' ? (
          <div className="text-center">
            <Clock className="mx-auto h-16 w-16 text-[#FF9800]" />
            <h2 className="mt-4 text-2xl font-bold text-[#1B4965]">
              Application Under Review
            </h2>
            <p className="mt-4 text-gray-600">
              Your application to become a route creator is currently under review.
              We'll notify you once it's approved. This typically takes 1-2 business days.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#1B4965] sm:text-3xl">
                Become a Route Creator
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Share your local knowledge and create unique walking routes for others to explore
              </p>
            </div>
            
            {error && (
              <div className="mt-6 rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  style={{ color: 'black', fontWeight: 500 }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Your City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  style={{ color: 'black', fontWeight: 500 }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Short Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  required
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us a bit about yourself..."
                  style={{ color: 'black', fontWeight: 500 }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                />
              </div>
              
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  Why do you want to create routes?
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows={4}
                  required
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Share your passion for your city and why you want to create walking routes..."
                  style={{ color: 'black', fontWeight: 500 }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                />
              </div>
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center rounded-md bg-[#4CAF50] px-6 py-3 text-base font-medium text-white hover:bg-[#45a049] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
} 