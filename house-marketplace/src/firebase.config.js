// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZKXm0NlEWUBcHYzICzfAOC1uy3xWAZHQ",
  authDomain: "house-marketplace-app-33839.firebaseapp.com",
  projectId: "house-marketplace-app-33839",
  storageBucket: "house-marketplace-app-33839.appspot.com",
  messagingSenderId: "490059382921",
  appId: "1:490059382921:web:7578fe4454f30f49fd0658"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();