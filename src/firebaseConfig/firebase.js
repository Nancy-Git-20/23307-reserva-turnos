
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDfhW0DytU6iQOomO2gQX7BFiNoAsocpWE",
  authDomain: "fir-cac23307-b.firebaseapp.com",
  projectId: "fir-cac23307-b",
  storageBucket: "fir-cac23307-b.appspot.com",
  messagingSenderId: "672042849607",
  appId: "1:672042849607:web:4663b45a724e0b942ae862"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);