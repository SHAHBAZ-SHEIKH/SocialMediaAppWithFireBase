 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
 import { getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword ,
  onAuthStateChanged ,
  signOut} 
  from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

 import { 
  getFirestore,
  doc, 
  setDoc,
  collection, 
  addDoc,
  getDoc,
  query,
  getDocs,
  deleteDoc ,
  updateDoc
  
   } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
   import { 
    getStorage ,
    uploadBytesResumable,
    getDownloadURL,
    ref
    
     } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

 
 const firebaseConfig = {
    apiKey: "AIzaSyC56dQFMU3Jg4C_mdtzjHSPN4nOe0FnV4o",
    authDomain: "phone-6aa72.firebaseapp.com",
    projectId: "phone-6aa72",
    storageBucket: "phone-6aa72.appspot.com",
    messagingSenderId: "963576307016",
    appId: "1:963576307016:web:8459e5e8e8c8425172e77d"
  };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);

 // Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const storage = getStorage(app);


export{
    auth,
    createUserWithEmailAndPassword,
    db,
    doc, 
    setDoc,
    collection, 
    addDoc,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    getDoc,
    signOut,
    storage,
    uploadBytesResumable,
    getDownloadURL,
    ref,
    query,
    getDocs,
    deleteDoc ,
    updateDoc
}
