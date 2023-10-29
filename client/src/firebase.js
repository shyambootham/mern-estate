// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-cd949.firebaseapp.com",
  projectId: "mern-estate-cd949",
  storageBucket: "mern-estate-cd949.appspot.com",
  messagingSenderId: "501764468589",
  appId: "1:501764468589:web:b8c56e78f92ab5c20e7464",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
