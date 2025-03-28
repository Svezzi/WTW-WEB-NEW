'use client';

import { Github, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/layout/AuthLayout';
import { createClient } from '@/utils/supabase';

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get('redirectedFrom') || '/';
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Create profile after signup
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username,
            email,
            created_at: new Date().toISOString(),
            is_verified: false,
          });
        
        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }
      
      // Successful registration
      router.push('/signup-success');
    } catch (error: any) {
      setError(error.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignUp = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectedFrom=${redirectPath}`,
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      setError(error.message || 'Failed to sign up with GitHub');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 text-[#1B4965]">
            Create your account
          </h2>
        </div>

        <div className="mt-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-[#333333]"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-[#333333] shadow-sm placeholder:text-gray-400 focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                />
              </div>
            </div>
            
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-[#333333]"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-[#333333] shadow-sm placeholder:text-gray-400 focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-[#333333]"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-gray-200 px-3 py-2 text-[#333333] shadow-sm placeholder:text-gray-400 focus:border-[#4CAF50] focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-[#4CAF50] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#45a049] focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Sign up'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGithubSignUp}
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-[#333333] shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Github className="h-5 w-5" />
                GitHub
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="font-medium text-[#4CAF50] hover:text-[#45a049]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
} 