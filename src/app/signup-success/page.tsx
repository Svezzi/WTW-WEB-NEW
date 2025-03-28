'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import AuthLayout from '@/components/layout/AuthLayout';

export default function SignUpSuccess() {
  return (
    <AuthLayout>
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-[#4CAF50]" />
          <h2 className="mt-4 text-2xl font-bold text-[#1B4965]">
            Account Created Successfully
          </h2>
          <p className="mt-2 text-gray-600">
            Your account has been created successfully. You can now sign in with your new credentials.
          </p>
          <div className="mt-6">
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-md bg-[#4CAF50] px-5 py-2 text-sm font-medium text-white hover:bg-[#45a049] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-offset-2"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
} 