import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDUstkmgKDHKP_FDeRc9UDQ_J36p5FaEBA",
  authDomain: "smartbuilding-ca986.firebaseapp.com",
  projectId: "smartbuilding-ca986",
  storageBucket: "smartbuilding-ca986.firebasestorage.app",
  messagingSenderId: "1044131746163",
  appId: "1:1044131746163:web:710a22fb52d3b341193506",
  measurementId: "G-LYJ83BS34L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
