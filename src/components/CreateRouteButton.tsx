'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Route } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/utils/supabase';

type CreateRouteButtonProps = {
  className?: string;
  showIcon?: boolean;
  variant?: 'primary' | 'secondary' | 'minimal';
  size?: 'small' | 'medium' | 'large';
};

export default function CreateRouteButton({
  className = '',
  showIcon = true,
  variant = 'primary',
  size = 'medium',
}: CreateRouteButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const supabase = createClient();

  // Get styles based on variant
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#FF4400] hover:bg-[#E63E00] text-white';
      case 'secondary':
        return 'bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-600';
      case 'minimal':
        return 'bg-transparent hover:bg-gray-100 text-indigo-600';
      default:
        return 'bg-[#FF4400] hover:bg-[#E63E00] text-white';
    }
  };

  // Get styles based on size
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'py-1 px-3 text-sm';
      case 'medium':
        return 'py-2 px-4 text-base';
      case 'large':
        return 'py-3 px-6 text-lg';
      default:
        return 'py-2 px-4 text-base';
    }
  };

  const handleClick = async () => {
    console.log('Create Route button clicked');
    setIsCheckingStatus(true);
    
    try {
      console.log('Current user from auth context:', user);
      
      // If no user in context, check session directly
      if (!user) {
        console.log('No user in context, checking session');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log('No active session, redirecting to sign in');
          router.push('/sign-in?redirectedFrom=/create-route');
          return;
        }
      }
      
      // Get the user ID either from context or session
      const userId = user?.id;
      console.log('User ID:', userId);
      
      if (!userId) {
        console.log('No user ID available, redirecting to sign in');
        router.push('/sign-in?redirectedFrom=/create-route');
        return;
      }
      
      // Check if user is verified
      console.log('Checking if user is verified');
      const { data: userData, error } = await supabase
        .from('profiles')
        .select('is_verified')
        .eq('id', userId)
        .single();
      
      console.log('Verification query result:', { userData, error });
      
      if (error) {
        console.error('Error checking verification status:', error);
        
        // If the error is because the profile doesn't exist (404), create one
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating one');
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              username: user?.user_metadata?.username || user?.email?.split('@')[0] || 'user',
              email: user?.email,
              created_at: new Date().toISOString(),
              is_verified: false,
            });
          
          if (insertError) {
            console.error('Error creating profile:', insertError);
            return;
          }
          
          // Redirect to verification page after creating profile
          router.push('/verification-required');
          return;
        }
        
        return;
      }
      
      console.log('Is user verified?', userData?.is_verified);
      
      if (userData?.is_verified) {
        // Verified - go to route creation
        console.log('User is verified, redirecting to create-route');
        router.push('/create-route');
      } else {
        // Not verified - go to application page
        console.log('User is not verified, redirecting to verification-required');
        router.push('/verification-required');
      }
    } catch (error) {
      console.error('Error in create route navigation:', error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isCheckingStatus}
      className={`rounded-md font-medium transition duration-150 ease-in-out flex items-center justify-center ${getVariantClasses()} ${getSizeClasses()} ${className}`}
    >
      {showIcon && <Route size={size === 'small' ? 16 : size === 'large' ? 24 : 20} className={size === 'small' ? 'mr-1' : 'mr-2'} />}
      Create Route
      {isCheckingStatus && (
        <svg className="animate-spin ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
    </button>
  );
} 