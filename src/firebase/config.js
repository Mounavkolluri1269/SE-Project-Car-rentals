// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKXQNqhRb9FVwXFsuxWBBWzOFUxPI4C0w",
  authDomain: "car-rentals-ee0b9.firebaseapp.com",
  databaseURL: "https://car-rentals-ee0b9-default-rtdb.firebaseio.com",
  projectId: "car-rentals-ee0b9",
  storageBucket: "car-rentals-ee0b9.firebasestorage.app",
  messagingSenderId: "100071742553",
  appId: "1:100071742553:web:644711e4ce9695931ce548",
  measurementId: "G-X2DB3T0PBR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { app, db, auth };
