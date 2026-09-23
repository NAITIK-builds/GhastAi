/**
 * firebase.js - Firebase initialization and cloud client for Ghost AI
 */
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, update, remove, onValue } from "firebase/database";

// User's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBwwQNOdwhJ7XpJvXkgoZEdCmbfNS7Uolk",
  authDomain: "ghastai.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DB_URL || "https://ghastai-default-rtdb.firebaseio.com",
  projectId: "ghastai",
  storageBucket: "ghastai.firebasestorage.app",
  messagingSenderId: "41639471644",
  appId: "1:41639471644:web:94502b85974869c9614dd9",
  measurementId: "G-YKCJMHC83Y"
};

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
let db = null;
try {
  db = getDatabase(app);
} catch (err) {
  console.warn("[Firebase] Could not initialize Realtime Database instance:", err);
}

export { db, ref, get, set, update, remove, onValue };
