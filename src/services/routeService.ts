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

interface FirestoreRoute extends Omit<RouteData, 'id'> {
  userId: string;
  createdAt: any;
  updatedAt: any;
}

interface FirestoreRouteWithId extends FirestoreRoute {
  id: string;
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

      // Prepare the data
      const firestoreData: FirestoreRoute = {
        title: routeData.title,
        description: routeData.description,
        category: routeData.category,
        stops: routeData.stops,
        duration: routeData.duration,
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
      const routeRef = doc(db, 'routes', routeId);
      await updateDoc(routeRef, {
        ...routeData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating route:', error);
      throw error;
    }
  },

  // Delete a route
  async deleteRoute(routeId: string): Promise<void> {
    try {
      const routeRef = doc(db, 'routes', routeId);
      await deleteDoc(routeRef);
    } catch (error) {
      console.error('Error deleting route:', error);
      throw error;
    }
  },

  // Get a single route by ID
  async getRoute(routeId: string): Promise<FirestoreRoute | null> {
    try {
      const routeRef = doc(db, 'routes', routeId);
      const routeSnap = await getDoc(routeRef);
      
      if (routeSnap.exists()) {
        return routeSnap.data() as FirestoreRoute;
      }
      return null;
    } catch (error) {
      console.error('Error getting route:', error);
      throw error;
    }
  },

  // Get all routes for a user
  async getUserRoutes(userId: string): Promise<FirestoreRouteWithId[]> {
    try {
      const q = query(
        collection(db, 'routes'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...(doc.data() as FirestoreRoute),
        id: doc.id
      }));
    } catch (error) {
      console.error('Error getting user routes:', error);
      throw error;
    }
  },

  // Get featured routes
  async getFeaturedRoutes(limitCount: number = 6): Promise<FirestoreRouteWithId[]> {
    try {
      const q = query(
        collection(db, 'routes'),
        where('featured', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...(doc.data() as FirestoreRoute),
        id: doc.id
      }));
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
  }): Promise<FirestoreRouteWithId[]> {
    try {
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
        ...(doc.data() as FirestoreRoute),
        id: doc.id
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
    } catch (error) {
      console.error('Error searching routes:', error);
      throw error;
    }
  }
}; 