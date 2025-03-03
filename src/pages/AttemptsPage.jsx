import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { signOut } from "firebase/auth";
import cadeadoLogoWhite from "../assets/cadeadoLogoWhite.png";
import cadeado3d from "../assets/cadeado3D.png";
import seta from "../assets/setaGradiente.png";
import { auth } from "../components/firebaseConfig";
import { getDoc, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../components/firebaseConfig";
import "../styles/AttemptsPage.css";

const CODE_LENGTH = 6;
const SECRET_CODE = import.meta.env.VITE_SECRET_CODE; // Código secreto de 6 dígitos

const AttemptsPage = () => {
  const { attempts, setAttempts, userId, email, name } = useAppContext();
  const [input, setInput] = useState(Array(CODE_LENGTH).fill(0));
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    if (!userId || !email || !name) {
      setLoggedOut(true);
    }
  }, [userId, email, name]);

  // Torne esta função assíncrona para usar 'await' corretamente
  const handleSubmit = async () => {
    if (input.join("") === SECRET_CODE) {
      return <Navigate to="/parabens" />;
    }
    // Decrementar o valor no banco de dados do Firestore
    const userRef = doc(db, "users", userId);

    // Atualiza o valor de 'attempts' no Firestore
    await updateDoc(userRef, {
      attempts: increment(-1),
    });

    // Recupera o documento atualizado
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const updatedAttempts = userData.attempts;
      sessionStorage.setItem("attempts", updatedAttempts); // Armazenar no sessionStorage
      setAttempts(updatedAttempts); // Atualiza o estado global
    }

    // Resetar o input após o envio
    setInput(Array(CODE_LENGTH).fill(0));
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      sessionStorage.clear();
      setLoggedOut(true);
    } catch (error) {
      console.error("Erro ao deslogar:", error.message);
    }
  };

  const updateNumber = (index, delta) => {
    setInput((prev) => {
      const newInput = [...prev];
      newInput[index] = (newInput[index] + delta + 10) % 10;
      return newInput;
    });
  };

  if (attempts <= 0) return <Navigate to="/recuperar" />;
  if (loggedOut) return <Navigate to="/" />;

  return (
    <div className="attempts-page">
      <main>
        <header className="attempts-page-header">
          <button onClick={handleSignOut}>Sair</button>
        </header>
        <section className="attempts-page-container">
          <div className="attempts-logo">
            <img width={37} src={cadeadoLogoWhite} alt="Logo" />
            <h2>Código Secreto</h2>
          </div>
          <section className="attempts-page-section">
            <img src={cadeado3d} alt="Cadeado 3D" />
            <div className="tentativas">
              <p>Tentativas: {attempts}</p>
            </div>
            <div className="valvulas">
              {input.map((num, index) => (
                <div key={index} className="valvulas-item">
                  <div className="setas" onClick={() => updateNumber(index, 1)}>
                    <img className="setaUp" src={seta} alt="Seta" />
                  </div>
                  <input type="text" value={num} disabled />
                  <div
                    className="setas"
                    onClick={() => updateNumber(index, -1)}>
                    <img className="setaDown" src={seta} alt="Seta" />
                  </div>
                </div>
              ))}
            </div>
            <button className="confirmar" onClick={handleSubmit}>
              Confirmar
            </button>
          </section>
        </section>
        <footer className="attempts-page-footer">
          <p>2025 Código Secreto&copy;</p>
        </footer>
      </main>
    </div>
  );
};

export default AttemptsPage;
