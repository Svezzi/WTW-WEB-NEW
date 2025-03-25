'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if not authenticated
  if (!loading && !user) {
    router.push('/auth/signin?redirectedFrom=/settings');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const displayName = formData.get('displayName') as string;

    try {
      // Update profile logic will go here
      // For now, just show a success message
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111827]">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF4400]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111827] py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-[#1F2937] p-8 border border-gray-800">
          <h1 className="text-2xl font-bold text-white">Account Settings</h1>
          <p className="mt-2 text-gray-400">Manage your profile and preferences</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-300"
              >
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                defaultValue={user?.displayName || ''}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-[#374151] px-3 py-2 text-white shadow-sm focus:border-[#FF4400] focus:outline-none focus:ring-1 focus:ring-[#FF4400]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={user?.email || ''}
                disabled
                className="mt-1 block w-full rounded-md border border-gray-700 bg-[#2C3544] px-3 py-2 text-gray-400 shadow-sm"
              />
              <p className="mt-1 text-sm text-gray-500">
                Email cannot be changed
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-500">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-500/10 p-4 text-sm text-green-500">
                {success}
              </div>
            )}

            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="flex items-center justify-center rounded-md bg-[#FF4400] px-4 py-2 text-sm font-medium text-white hover:bg-[#E63E00] disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 rounded-lg bg-[#1F2937] p-8 border border-gray-800">
          <h2 className="text-xl font-bold text-red-500">Danger Zone</h2>
          <p className="mt-2 text-gray-400">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            type="button"
            className="mt-6 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
} 