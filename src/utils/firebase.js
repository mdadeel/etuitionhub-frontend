// Firebase configuration for e-tuitionBD
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration - using environment variables for security
// But keeping fallback for development
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "etuition-hub.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "etuition-hub",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "etuition-hub.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "65902682430",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:65902682430:web:c7b18cd70b4c4281774c6f",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-7WHKGN5ZG4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;
