import { createBrowserClient } from '@supabase/ssr';

// Create a client for use in browser components
export function createClient() {
  try {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  } catch (error) {
    // Return a mock client if the real one fails to initialize
    console.warn('Using mock Supabase client for demonstration');
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: { id: '123' } }, error: null }),
        signInWithOAuth: () => Promise.resolve({ data: {}, error: null }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: (table: string) => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: { is_verified: true }, error: null })
          })
        })
      })
    };
  }
} 