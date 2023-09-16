// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDvTQTq6mUDErxD1QSzWWd7M_N2-AXMcs",
  authDomain: "rankedify.firebaseapp.com",
  projectId: "rankedify",
  storageBucket: "rankedify.appspot.com",
  messagingSenderId: "139647365553",
  appId: "1:139647365553:web:4ce8d58624358ebdb78d90",
  measurementId: "G-V4N6SPKHWF",
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);
