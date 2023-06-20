// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQoqpons3t-ijZriR4LzAFeMIFGOhU6gs",
  authDomain: "student-management-9e021.firebaseapp.com",
  projectId: "student-management-9e021",
  storageBucket: "student-management-9e021.appspot.com",
  messagingSenderId: "783892625040",
  appId: "1:783892625040:web:d3a724cb899fb1cccd0a15",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export default db;
