import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// !!! GO TO FIREBASE CONSOLE > PROJECT SETTINGS TO GET THESE KEYS !!!
const firebaseConfig = {
  apiKey: "AIzaSyDiH6_hCBfLWPz9yjxxVk18-f2wJRqMyFo",
  authDomain: "food-application-1263b.firebaseapp.com",
  projectId: "food-application-1263b",
  storageBucket: "food-application-1263b.firebasestorage.app",
  messagingSenderId: "944188032372",
  appId: "1:944188032372:web:896d65d5189e99902c9821"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { database, auth, googleProvider, collection, doc, setDoc };