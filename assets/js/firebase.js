import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDa4XAodIoKBkcWBB5JQLgIuPEQ7QH8S9c",
  authDomain: "gettv-7764b.firebaseapp.com",
  projectId: "gettv-7764b",
  storageBucket: "gettv-7764b.firebasestorage.app",
  messagingSenderId: "1053726335379",
  appId: "1:1053726335379:web:3e1f5b34d27fe1d1af0866",
  measurementId: "G-9536JWSFXN",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage, collection, addDoc, getDocs, doc, deleteDoc };