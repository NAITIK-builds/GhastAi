/**
 * firebase.js - Firebase initialization and cloud client for Ghost AI
 */
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, update, remove, onValue } from "firebase/database";

// User's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBwwQNOdwhJ7XpJvXkgoZEdCmbfNS7Uolk",
  authDomain: "ghastai.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DB_URL || "https://ghastai-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ghastai",
  storageBucket: "ghastai.firebasestorage.app",
  messagingSenderId: "41639471644",
  appId: "1:41639471644:web:94502b85974869c9614dd9",
  measurementId: "G-YKCJMHC83Y"
};

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

let db = null;
let dbCheckDone = false;
let dbValid = false;

/**
 * Checks whether the configured Realtime Database exists on Firebase
 * without triggering unhandled WebSocket connection warnings.
 */
export async function isRealtimeDbAvailable() {
  if (dbCheckDone) return dbValid;
  try {
    const url = `${firebaseConfig.databaseURL}/.json?shallow=true`;
    const res = await fetch(url, { method: 'GET' }).catch(() => null);
    // 404 indicates the database is not yet created in the Firebase console
    if (res && res.status !== 404) {
      dbValid = true;
    } else {
      dbValid = false;
    }
  } catch (e) {
    dbValid = false;
  }
  dbCheckDone = true;
  return dbValid;
}

/**
 * Returns the Realtime Database instance only when verified, preventing
 * premature connection warnings on uncreated databases.
 */
export async function getDbInstance() {
  const isAvailable = await isRealtimeDbAvailable();
  if (isAvailable && !db) {
    try {
      db = getDatabase(app);
    } catch (e) {}
  }
  return isAvailable ? db : null;
}

export { db, ref, get, set, update, remove, onValue };
