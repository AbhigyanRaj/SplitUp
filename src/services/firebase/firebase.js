// Firebase core and services
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier, signInWithPopup, signInWithPhoneNumber } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQZWAwabBde4IYp0DOv_Y3N3WNVDAUnD4",
  authDomain: "splitup-6e09c.firebaseapp.com",
  projectId: "splitup-6e09c",
  storageBucket: "splitup-6e09c.firebasestorage.app",
  messagingSenderId: "73484504596",
  appId: "1:73484504596:web:b850eb3951f572edfd6101",
  measurementId: "G-S07GC5V9P4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Providers
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider, RecaptchaVerifier, signInWithPopup, signInWithPhoneNumber }; 