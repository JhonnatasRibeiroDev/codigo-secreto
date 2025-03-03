import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import "../styles/RecoverPage.css";
import { signOut } from "firebase/auth";
import { auth, db } from "../components/firebaseConfig";
import { getDoc, doc, updateDoc, increment } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const RecoverPage = () => {
  const { setAttempts, userId, email, name, attempts } = useAppContext();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loggedOut, setLoggedOut] = useState(false);
  const navigate = useNavigate();

  // Função para recuperar tentativas
  const handleRecover = async () => {
    if (code === "RESET123") {
      try {
        if (!userId) {
          setMessage("Usuário não autenticado.");
          return;
        }

        // Referência do documento do usuário
        const userRef = doc(db, "users", userId);

        // Atualiza o número de tentativas no Firestore
        await updateDoc(userRef, {
          attempts: increment(15), // Adiciona +15 tentativas
        });

        // Atualiza localmente
        setAttempts((prev) => prev + 15);
        sessionStorage.setItem("attempts", attempts + 15);

        navigate("/tentativas"); // Redireciona para a página de tentativas
      } catch (error) {
        console.error("Erro ao recuperar tentativas:", error);
        setMessage("Erro ao recuperar tentativas. Tente novamente.");
      }
    } else {
      setMessage("Código inválido. Tente novamente.");
    }
  };

  // Função para deslogar
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      sessionStorage.clear();
      setLoggedOut(true);
      navigate("/");
    } catch (error) {
      console.error("Erro ao deslogar:", error.message);
    }
  };

  // Recupera os dados do usuário no Firestore
  useEffect(() => {
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
  }, [setAttempts, userId]);

  // Redireciona para "/tentativas" se o usuário já tiver tentativas disponíveis
  useEffect(() => {
    if (attempts > 0) {
      navigate("/tentativas");
    }
  }, [attempts, navigate]);

  // Se o usuário não estiver logado, redireciona para a página inicial
  useEffect(() => {
    if (!userId || !email || !name) {
      setLoggedOut(true);
      navigate("/");
    }
  }, [userId, email, name, navigate]);

  return (
    <div className="recover-page-container">
      <header className="recover-page-header">
        <button className="recover-page-logout" onClick={handleSignOut}>
          Sair
        </button>
      </header>
      <h1 className="recover-page-title">Digite o código de recuperação:</h1>
      <input
        className="recover-page-input"
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Código de recuperação"
      />
      <button className="recover-page-button" onClick={handleRecover}>
        Recuperar
      </button>
      {message && <p className="recover-page-message">{message}</p>}
    </div>
  );
};

export default RecoverPage;
