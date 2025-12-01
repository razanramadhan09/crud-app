// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Tambahkan ini
import { getAuth } from "firebase/auth"; // Tambahkan ini (opsional)

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtnJVpd6aJ06UhUlEZ37kMwM9S3T5kWIY",
  authDomain: "crud-895dd.firebaseapp.com",
  projectId: "crud-895dd",
  storageBucket: "crud-895dd.firebasestorage.app",
  messagingSenderId: "1025795448244",
  appId: "1:1025795448244:web:fe0c07c6f4ddd5a121a6e1",
  measurementId: "G-LD95X0YPHK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore Database
const db = getFirestore(app);

// Initialize Firebase Authentication (opsional)
const auth = getAuth(app);

// Export the necessary modules
export { db, auth, analytics }; // Tambahkan ekspor ini
export default app; // Ekspor default jika diperlukan