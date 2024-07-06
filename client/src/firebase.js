// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2bkMeRoCMWG3eLq3xZl68b-7rhGX0fPo",
  authDomain: "clicky-1952d.firebaseapp.com",
  projectId: "clicky-1952d",
  storageBucket: "clicky-1952d.appspot.com",
  messagingSenderId: "797458448066",
  appId: "1:797458448066:web:714ec50aacc40f4f70855b",
  measurementId: "G-X6K1X014RS",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);
