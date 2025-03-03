import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { signInWithGoogle } from "../components/firebaseConfig"; // Importando a função de login
import logo from "../assets/logo-white.png";
import logo_user from "../assets/user.png";
import "../styles/InitialPage.css";
import { getDoc, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../components/firebaseConfig";
import Cadeado from "../assets/cadeadoLogoBlack.png";

const InitialPage = () => {
  const { userId, setUserId, name, setName, email, setEmail, setAttempts } =
    useAppContext();
  const [error, setError] = useState("");
  const [next, setNext] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Recupera o documento atualizado
    async function pegarDadosDoUsuario() {
      if (!userId) return;
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setAttempts(userData.attempts);
        sessionStorage.setItem("attempts", userData.attempts);
      }
    }
    pegarDadosDoUsuario();
  }, [setAttempts]);

  useEffect(() => {
    // Verifica se o usuário já está logado na sessionStorage
    const storedUserId = sessionStorage.getItem("userId");
    const storedName = sessionStorage.getItem("userName");
    const storedEmail = sessionStorage.getItem("userEmail");
    const storedAttempts = sessionStorage.getItem("attempts");

    if (storedUserId && storedName && storedEmail && storedAttempts) {
      setUserId(storedUserId);
      setName(storedName);
      setEmail(storedEmail);
      setAttempts(parseInt(sessionStorage.getItem("attempts"))); // Carrega as tentativas
      setNext(true);
    }
  }, [setUserId, setName, setEmail, setAttempts]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      if (!user) throw new Error("Usuário não encontrado.");

      setUserId(user.uid);
      setName(user.displayName || "");
      setEmail(user.email || "");

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      let updatedAttempts = 15; // Valor padrão caso não tenha no Firestore

      if (userDoc.exists()) {
        updatedAttempts = userDoc.data().attempts || 15;
      } else {
        await updateDoc(userRef, { attempts: updatedAttempts });
      }

      setAttempts(updatedAttempts);
      sessionStorage.setItem("attempts", updatedAttempts);
      sessionStorage.setItem("userId", user.uid);
      sessionStorage.setItem("userName", user.displayName || "");
      sessionStorage.setItem("userEmail", user.email || "");

      setNext(true);
    } catch (error) {
      setError("Erro ao realizar login com Google.");
      console.error("Erro ao fazer login: ", error);
    }
  };

  if (next) {
    return <Navigate to="/tentativas" />;
  }

  return (
    <div className="container initial-page">
      <main>
        <header></header>
        <div className="respirar">
          <img className="initial-page-logo-img" src={logo} alt="Logo" />
          <section className="content initial-page-content">
            <div className="initial-page-logo">
              <img src={Cadeado} alt="Logo" />
              <h2>Código Secreto</h2>
            </div>
            <div className="initial-page-name">
              <img src={logo_user} alt="Logo" />
              <h3>Usuário</h3>
            </div>
            <div className="initial-page-button">
              <div onClick={handleGoogleLogin}>Entrar com Google</div>
            </div>
          </section>
        </div>
        <footer>
          <p>2025 Código Secreto&copy;</p>
        </footer>
      </main>

      {/*<button onClick={handleGoogleLogin}>Login com Google</button>
      {error && <p style={{ color: "red" }}>{error}</p>} */}
    </div>
  );
};

export default InitialPage;
