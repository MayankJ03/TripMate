// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_g8oIBVg50sPQ8a6FlS8gc8QZp9h9LIQ",
  authDomain: "tripmate-2e0b8.firebaseapp.com",
  projectId: "tripmate-2e0b8",
  storageBucket: "tripmate-2e0b8.firebasestorage.app",
  messagingSenderId: "671136955458",
  appId: "1:671136955458:web:9aeeb523d632ffd9ebc1db",
  measurementId: "G-017DFLS0J4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
// const analytics = getAnalytics(app);