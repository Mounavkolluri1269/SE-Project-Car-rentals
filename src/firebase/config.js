// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRsWpWvbBnRedoOWp_ZENi_nfPE93eaVA",
  authDomain: "car-rentals-a85ac.firebaseapp.com",
  projectId: "car-rentals-a85ac",
  storageBucket: "car-rentals-a85ac.firebasestorage.app",
  messagingSenderId: "26766024507",
  appId: "1:26766024507:web:e9e88e595149937875211e",
  measurementId: "G-VEQBL93G23",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { app, db, auth };
