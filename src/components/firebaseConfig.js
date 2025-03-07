// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Referências para autenticação e Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Função para autenticar com Google
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Resultado do login com Google: ", result); // Verifica o retorno de `signInWithPopup`
    const user = result.user;
    const userRef = doc(db, "users", user.uid);

    // Verifica se o usuário já existe no Firestore
    const userDoc = await getDoc(userRef);
    let attempts = 15; // Valor padrão de tentativas

    if (!userDoc.exists()) {
      // Se não existir, cria um novo documento
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        attempts: attempts, // Inicia com 15 tentativas
      });
      console.log("Usuário novo criado");
    } else {
      // Se já existir, recupera as tentativas do Firestore
      const userData = userDoc.data();
      attempts = userData.attempts || 15; // Caso não tenha o campo attempts, inicia com 15
      console.log("Usuário já registrado, tentativas recuperadas:", attempts);
    }

    // Armazena as informações no sessionStorage
    sessionStorage.setItem("userId", user.uid);
    sessionStorage.setItem("userName", user.displayName);
    sessionStorage.setItem("userEmail", user.email);
    sessionStorage.setItem("attempts", attempts);

    return result; // Retorna o `result` completo
  } catch (error) {
    console.error("Erro ao fazer login com Google:", error);
    throw error; // Lança o erro para ser tratado em `handleGoogleLogin`
  }
};

export { app, signInWithGoogle, auth, db };
