'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/sign-in"
          className="text-gray-300 hover:text-white"
        >
          LOG IN
        </Link>
        <Link
          href="/sign-up"
          className="rounded bg-[#FF4400] px-4 py-2 font-medium text-white hover:bg-[#E63E00]"
        >
          SIGN UP
        </Link>
      </div>
    );
  }

  const displayName = user.user_metadata?.username || user.email;
  const firstLetter = displayName ? displayName[0].toUpperCase() : 'U';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-300 hover:text-white"
      >
        <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt={displayName || 'User'}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <span className="text-white">{firstLetter}</span>
          )}
        </div>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-[#1F2937] shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
              {displayName}
            </div>
            
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#374151] hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </Link>
            
            <Link
              href="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#374151] hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
            
            <button
              className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#374151] hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 