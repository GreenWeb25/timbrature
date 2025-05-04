// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// La configurazione di Firebase per il tuo progetto
const firebaseConfig = {
  apiKey: "AIzaSyCoc3XK1lzAlRPxtD9GSXq2d4bn_LjWn7g",  // Assicurati che queste informazioni siano corrette
  authDomain: "timbratura-b9015.firebaseapp.com",
  projectId: "timbratura-b9015",
  storageBucket: "timbratura-b9015.appspot.com",
  messagingSenderId: "291566241",
  appId: "1:291566241:web:64395404bd49b7cbfff6e0",
};

// Inizializza l'app Firebase
const app = initializeApp(firebaseConfig);

// Ottieni i riferimenti per l'autenticazione e Firestore
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Esporta l'autenticazione, il provider di Google e Firestore per poterli utilizzare altrove
export { auth, provider, db };
