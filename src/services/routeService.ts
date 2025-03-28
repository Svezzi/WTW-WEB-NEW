import { 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  getDoc,
  serverTimestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { RouteData } from '@/config/googleMapsConfig';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface FirestoreRoute extends Omit<RouteData, 'id'> {
  userId: string;
  createdAt: any;
  updatedAt: any;
}

interface FirestoreRouteWithId extends FirestoreRoute {
  id: string;
}

interface SupabaseRoute extends Omit<RouteData, 'id'> {
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export const routeService = {
  // Create a new route
  async createRoute(userId: string, routeData: RouteData): Promise<string> {
    try {
      console.log('Starting createRoute with:', { userId });
      
      // Input validation
      if (!userId) {
        throw new Error('User ID is required');
      }

      if (!routeData.title || !routeData.description || !routeData.category) {
        throw new Error('Missing required route data');
      }

      if (!routeData.stops || routeData.stops.length < 2) {
        throw new Error('Route must have at least 2 stops');
      }

      // Try Supabase first, fall back to Firebase if needed
      try {
        // Convert directions to a string for storage
        const directionsJson = routeData.directions ? JSON.stringify(routeData.directions) : null;
        
        // Prepare Supabase data
        const supabaseData: SupabaseRoute = {
          title: routeData.title,
          description: routeData.description,
          category: routeData.category,
          stops: routeData.stops,
          duration: routeData.duration,
          distance: routeData.distance,
          user_id: userId
        };
        
        // Store in Supabase
        const { data, error } = await supabase
          .from('routes')
          .insert([supabaseData])
          .select('id');
        
        if (error) {
          throw error;
        }
        
        if (data && data[0] && data[0].id) {
          return data[0].id;
        } else {
          throw new Error('No ID returned from Supabase');
        }
      } catch (supabaseError) {
        console.error('Supabase storage failed, falling back to Firebase:', supabaseError);
        
        // Prepare the data for Firebase fallback
        const firestoreData: FirestoreRoute = {
          title: routeData.title,
          description: routeData.description,
          category: routeData.category,
          stops: routeData.stops,
          duration: routeData.duration,
          distance: routeData.distance,
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        console.log('Prepared Firestore data:', firestoreData);

        // Get reference to routes collection
        const routesRef = collection(db, 'routes');
        console.log('Got reference to routes collection');

        // Add the document
        console.log('Attempting to add document...');
        const docRef = await addDoc(routesRef, firestoreData);
        console.log('Document added successfully with ID:', docRef.id);

        return docRef.id;
      }
    } catch (error: any) {
      console.error('Detailed error in createRoute:', {
        error,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      throw new Error(`Failed to create route: ${error.message}`);
    }
  },

  // Update an existing route
  async updateRoute(routeId: string, routeData: Partial<RouteData>): Promise<void> {
    try {
      // Try Supabase first, fall back to Firebase if needed
      try {
        // Prepare the update data
        const updateData = {
          ...routeData,
          updated_at: new Date().toISOString()
        };
        
        // Update in Supabase
        const { error } = await supabase
          .from('routes')
          .update(updateData)
          .eq('id', routeId);
          
        if (error) {
          throw error;
        }
      } catch (supabaseError) {
        console.error('Supabase update failed, falling back to Firebase:', supabaseError);
        
        // Fallback to Firebase
        const routeRef = doc(db, 'routes', routeId);
        await updateDoc(routeRef, {
          ...routeData,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error updating route:', error);
      throw error;
    }
  },

  // Delete a route
  async deleteRoute(routeId: string): Promise<void> {
    try {
      // Try Supabase first, fall back to Firebase if needed
      try {
        // Delete from Supabase
        const { error } = await supabase
          .from('routes')
          .delete()
          .eq('id', routeId);
          
        if (error) {
          throw error;
        }
      } catch (supabaseError) {
        console.error('Supabase delete failed, falling back to Firebase:', supabaseError);
        
        // Fallback to Firebase
        const routeRef = doc(db, 'routes', routeId);
        await deleteDoc(routeRef);
      }
    } catch (error) {
      console.error('Error deleting route:', error);
      throw error;
    }
  },

  // Get a single route by ID
  async getRoute(routeId: string): Promise<RouteData | null> {
    try {
      // Try Supabase first, fall back to Firebase if needed
      try {
        // Get from Supabase
        const { data, error } = await supabase
          .from('routes')
          .select('*')
          .eq('id', routeId)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          return {
            id: data.id,
            title: data.title,
            description: data.description,
            category: data.category,
            stops: data.stops,
            duration: data.duration,
            distance: data.distance
          };
        }
        
        return null;
      } catch (supabaseError) {
        console.error('Supabase fetch failed, falling back to Firebase:', supabaseError);
        
        // Fallback to Firebase
        const routeRef = doc(db, 'routes', routeId);
        const routeSnap = await getDoc(routeRef);
        
        if (routeSnap.exists()) {
          const data = routeSnap.data() as FirestoreRoute;
          return {
            id: routeSnap.id,
            title: data.title,
            description: data.description,
            category: data.category,
            stops: data.stops,
            duration: data.duration,
            distance: data.distance
          };
        }
        
        return null;
      }
    } catch (error) {
      console.error('Error getting route:', error);
      throw error;
    }
  },

  // Get all routes for a user
  async getUserRoutes(userId: string): Promise<RouteData[]> {
    try {
      // Try Supabase first, fall back to Firebase if needed
      try {
        // Get from Supabase
        const { data, error } = await supabase
          .from('routes')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          return data.map(route => ({
            id: route.id,
            title: route.title,
            description: route.description,
            category: route.category,
            stops: route.stops,
            duration: route.duration,
            distance: route.distance
          }));
        }
        
        return [];
      } catch (supabaseError) {
        console.error('Supabase fetch failed, falling back to Firebase:', supabaseError);
        
        // Fallback to Firebase
        const q = query(
          collection(db, 'routes'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as FirestoreRoute),
        }));
      }
    } catch (error) {
      console.error('Error getting user routes:', error);
      throw error;
    }
  },

  // Get featured routes
  async getFeaturedRoutes(limitCount: number = 6): Promise<RouteData[]> {
    try {
      // Try Supabase first, fall back to Firebase if needed
      try {
        // Get from Supabase
        const { data, error } = await supabase
          .from('routes')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(limitCount);
          
        if (error) {
          throw error;
        }
        
        if (data) {
          return data.map(route => ({
            id: route.id,
            title: route.title,
            description: route.description,
            category: route.category,
            stops: route.stops,
            duration: route.duration,
            distance: route.distance
          }));
        }
        
        return [];
      } catch (supabaseError) {
        console.error('Supabase fetch failed, falling back to Firebase:', supabaseError);
        
        // Fallback to Firebase
        const q = query(
          collection(db, 'routes'),
          where('featured', '==', true),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as FirestoreRoute)
        }));
      }
    } catch (error) {
      console.error('Error getting featured routes:', error);
      throw error;
    }
  },

  // Search routes
  async searchRoutes(searchParams: {
    query?: string;
    category?: string;
    location?: string;
    limit?: number;
  }): Promise<RouteData[]> {
    try {
      // Try Supabase first
      try {
        let supabaseQuery = supabase.from('routes').select('*');
        
        if (searchParams.category) {
          supabaseQuery = supabaseQuery.eq('category', searchParams.category);
        }
        
        if (searchParams.location) {
          supabaseQuery = supabaseQuery.eq('location', searchParams.location);
        }
        
        if (searchParams.limit) {
          supabaseQuery = supabaseQuery.limit(searchParams.limit);
        }
        
        const { data, error } = await supabaseQuery;
        
        if (error) {
          throw error;
        }
        
        let routes = data || [];
        
        // Client-side text search if query parameter is provided
        if (searchParams.query && routes.length > 0) {
          const searchQuery = searchParams.query.toLowerCase();
          routes = routes.filter(route => 
            route.title?.toLowerCase().includes(searchQuery) || 
            route.description?.toLowerCase().includes(searchQuery)
          );
        }
        
        return routes.map(route => ({
          id: route.id,
          title: route.title,
          description: route.description,
          category: route.category,
          stops: route.stops,
          duration: route.duration,
          distance: route.distance
        }));
        
      } catch (supabaseError) {
        console.error('Supabase search failed, falling back to Firebase:', supabaseError);
        
        // Fallback to Firebase
        let q = query(collection(db, 'routes'));
        
        if (searchParams.category) {
          q = query(q, where('category', '==', searchParams.category));
        }
        
        if (searchParams.location) {
          q = query(q, where('location', '==', searchParams.location));
        }
        
        if (searchParams.limit) {
          q = query(q, limit(searchParams.limit));
        }
        
        const querySnapshot = await getDocs(q);
        const routes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as FirestoreRoute)
        }));
        
        // Client-side text search
        if (searchParams.query) {
          const searchQuery = searchParams.query.toLowerCase();
          return routes.filter(route => 
            route.title?.toLowerCase().includes(searchQuery) ||
            route.description?.toLowerCase().includes(searchQuery)
          );
        }
        
        return routes;
      }
    } catch (error) {
      console.error('Error searching routes:', error);
      throw error;
    }
  },
  
  // Verify if a user can create routes
  async canUserCreateRoutes(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_verified')
        .eq('id', userId)
        .single();
        
      if (error) {
        throw error;
      }
      
      return !!data?.is_verified;
    } catch (error) {
      console.error('Error checking user verification status:', error);
      return false;
    }
  },
  
  // Submit verification request
  async submitVerificationRequest(userId: string, requestData: {
    name: string;
    city: string;
    socialLinks?: string;
    experience: string;
    motivation: string;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('verification_requests')
        .insert([
          {
            user_id: userId,
            name: requestData.name,
            city: requestData.city,
            social_links: requestData.socialLinks,
            experience: requestData.experience,
            motivation: requestData.motivation,
            status: 'pending'
          }
        ]);
        
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error submitting verification request:', error);
      throw error;
    }
  }
}; 