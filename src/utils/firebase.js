import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyCkv4qPS4mcZcg7c14_a5CE9PRr4l7nJrQ",
  authDomain: "siska-pemko-medan.firebaseapp.com",
  projectId: "siska-pemko-medan",
  storageBucket: "siska-pemko-medan.firebasestorage.app",
  messagingSenderId: "918892241989",
  appId: "1:918892241989:web:b203674969f9caa3fa6f2c",
  measurementId: "G-SYCYLPQE48"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);  // <-- PASTIKAN INI DIEKSPOR
export const appId = 'andapinter-bkad-medan';