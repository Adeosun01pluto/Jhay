// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEzBavrozlvMHlT7NdvQxH5SWGa-637G8",
  authDomain: "jhayexchange-65002.firebaseapp.com",
  projectId: "jhayexchange-65002",
  storageBucket: "jhayexchange-65002.appspot.com",
  messagingSenderId: "693666315536",
  appId: "1:693666315536:web:3c5347c7038682a3cc7995",
  measurementId: "G-5KKDV2P66X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app)

export const googleProvider = new(GoogleAuthProvider)
export {app, auth, db}