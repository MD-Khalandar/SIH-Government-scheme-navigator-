import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBWVfePykMrxKV61QH1eubv97nr4PZt4jg",
  authDomain: "sih-schemes.firebaseapp.com",
  projectId: "sih-schemes",
  storageBucket: "sih-schemes.firebasestorage.app",
  messagingSenderId: "159355157489",
  appId: "1:159355157489:web:74c63bf38b17b64b276250"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);