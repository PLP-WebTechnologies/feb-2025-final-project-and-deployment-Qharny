import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';

// Your Firebase configuration
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
const auth = getAuth(app);

// Login function
export async function loginAdmin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
}

// Check auth state
export function checkAuthState(callback) {
    return onAuthStateChanged(auth, callback);
}

// Add this function to check if user is admin
export function isAdmin(user) {
    // You can define admin emails in an array
    const adminEmails = ['kabuteydeborah@gmail.com'];
    return user && adminEmails.includes(user.email);
}

// Add this to handle admin visibility
export function updateAdminVisibility(user) {
    const adminLinks = document.querySelectorAll('.admin-link');
    adminLinks.forEach(link => {
        link.style.display = isAdmin(user) ? 'block' : 'none';
    });
} 