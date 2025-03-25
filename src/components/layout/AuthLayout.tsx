'use client';

import Link from 'next/link';
import { AuthProvider } from '@/contexts/AuthContext';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#F5F5F5]">
        <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Link 
              href="/"
              className="text-2xl font-bold text-[#4CAF50] hover:text-[#45a049] transition-colors"
            >
              WALK THIS WAY
            </Link>
          </div>
        </header>

        <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
} 