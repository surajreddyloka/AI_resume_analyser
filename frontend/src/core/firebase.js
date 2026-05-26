import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  projectId: "ai-resume-analyser-3d069",
  appId: "1:502065552140:web:87be2cb214714e7f31c729",
  storageBucket: "ai-resume-analyser-3d069.firebasestorage.app",
  apiKey: "AIzaSyD4rBhwQG8I6cYDTUHZ2wuQiHSf5hQOiSI",
  authDomain: "ai-resume-analyser-3d069.firebaseapp.com",
  messagingSenderId: "502065552140",
  measurementId: "G-QVMSMN1EVE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup };
