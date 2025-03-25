import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Use environment variables or fallback to empty strings to prevent build errors
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD025uuHovCd69fSm6jikAYZG-h-sXVV-E",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "walk-this-way-bbc01.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "walk-this-way-bbc01",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "walk-this-way-bbc01.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "865978847050",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:865978847050:web:f60a3201da69519077bbb3",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-D3JDN4RLSP"
};

// Validate Firebase config
const validateConfig = () => {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ] as const;

  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  if (missingFields.length > 0) {
    console.warn(`Missing Firebase configuration fields: ${missingFields.join(', ')}. Using fallback values.`);
  }
};

let app: FirebaseApp;
let auth: any = null;
let db: any = null;
let analytics: any = null;

try {
  validateConfig();
  
  // Initialize Firebase
  if (typeof window !== 'undefined') {
    // Only initialize Firebase on the client side
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    
    // Initialize services
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Initialize Analytics
    isSupported().then(yes => {
      if (yes) {
        analytics = getAnalytics(app);
        console.log('Firebase Analytics initialized');
      }
    }).catch(error => {
      console.error('Error initializing Firebase Analytics:', error);
    });
    
    console.log('Firebase initialized successfully');
  } else {
    console.log('Firebase initialization skipped on server side');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // Don't throw the error, just log it to prevent build failures
}

export { app, auth, db, analytics }; 