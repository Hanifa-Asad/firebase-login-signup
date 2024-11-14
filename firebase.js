import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";;
import { getAuth, createUserWithEmailAndPassword,  signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc,getDocs ,doc, setDoc ,updateDoc,serverTimestamp , arrayUnion, arrayRemove ,deleteDoc, deleteField ,orderBy,query ,where ,onSnapshot, } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js"



const firebaseConfig = {
    apiKey: "AIzaSyCj4cgWB84F2KSReQYI18aMraaLs1PHSss",
    authDomain: "sign-up-4dc9f.firebaseapp.com",
    projectId: "sign-up-4dc9f",
    storageBucket: "sign-up-4dc9f.firebasestorage.app",
    messagingSenderId: "412516384144",
    appId: "1:412516384144:web:a1125e20b0c8e7dce58715",
    measurementId: "G-QW5MH80Z92"
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const db = getFirestore(app);
  export { getAuth, auth, createUserWithEmailAndPassword,  signInWithEmailAndPassword,
     signInWithPopup, GoogleAuthProvider, provider, signOut, getFirestore,db ,collection,
      addDoc,getDocs, doc, setDoc ,updateDoc,serverTimestamp 
    , arrayUnion, arrayRemove ,deleteDoc, deleteField ,orderBy,query ,where ,onSnapshot}