// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBG9hSiIewb3KKdl8mETiWFgbJ81KYqJDA",
  authDomain: "cammt-b8746.firebaseapp.com",
  projectId: "cammt-b8746",
  storageBucket: "cammt-b8746.firebasestorage.app",
  messagingSenderId: "735271738397",
  appId: "1:735271738397:web:20f5d2c18592efbe23faf4",
  measurementId: "G-4VWQJBGPGJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export class AuthService {
  constructor() {
    this.auth = auth;
  }

  // Sign up new user
  async signUp(email, password, username = '') {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Update profile with username if provided
      if (username) {
        await updateProfile(user, {
          displayName: username
        });
      }

      // Store user info in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', user.email);
      if (username) {
        localStorage.setItem('userName', username);
      }

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || username,
        photoURL: user.photoURL
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign in existing user
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Store user info in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', user.email);
      if (user.displayName) {
        localStorage.setItem('userName', user.displayName);
      }
      if (user.photoURL) {
        localStorage.setItem('userAvatar', user.photoURL);
      }

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign out user
  async signOut() {
    try {
      await signOut(this.auth);
      
      // Clear localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userAvatar');
      
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Get current user
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(this.auth, callback);
  }

  // Handle Firebase auth errors
  handleAuthError(error) {
    const errorMessages = {
      'auth/user-not-found': 'No user found with this email address.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/invalid-credential': 'Invalid email or password.'
    };

    return new Error(errorMessages[error.code] || error.message);
  }
}