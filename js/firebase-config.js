// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoylt3gTjOmyDXUeAV6u0mXUVSjc7XbvQ",
  authDomain: "shipping-c7b07.firebaseapp.com",
  projectId: "shipping-c7b07",
  storageBucket: "shipping-c7b07.appspot.com",
  messagingSenderId: "102651132513",
  appId: "1:102651132513:web:22fae5c9ac02f61ce80820"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 