import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { signInWithGoogle } from "../components/firebaseConfig";
import logo from "../assets/logo-white.png";
import logo_user from "../assets/user.png";
import "../styles/InitialPage.css";
import Cadeado from "../assets/cadeadoLogoBlack.png";

const InitialPage = () => {
  const { userId, setUserId, name, setName, email, setEmail, setAttempts } =
    useAppContext();

  const [error, setError] = useState("");
  const [next, setNext] = useState(false);
  const [numero, setNumero] = useState("");
  const [cpf, setCPF] = useState("");
  const [showForm, setShowForm] = useState(false); // Controla se exibe os inputs de CPF e telefone

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedName = sessionStorage.getItem("userName");
    const storedEmail = sessionStorage.getItem("userEmail");
    const storedAttempts = sessionStorage.getItem("attempts");

    if (storedUserId && storedName && storedEmail && storedAttempts) {
      setUserId(storedUserId);
      setName(storedName);
      setEmail(storedEmail);
      setAttempts(parseInt(storedAttempts));
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

      // Consulta ao backend para verificar se o usuário já existe
      const response = await fetch(
        `https://seu-backend.com/api/check-user?uid=${user.uid}`
      );
      const data = await response.json();

      if (response.ok && data.exists) {
        // Usuário já cadastrado → prossegue direto
        sessionStorage.setItem("userId", user.uid);
        sessionStorage.setItem("userName", user.displayName);
        sessionStorage.setItem("userEmail", user.email);
        sessionStorage.setItem("attempts", data.attempts);
        setAttempts(data.attempts);
        setNext(true);
      } else {
        // Usuário novo → pede CPF e telefone
        setShowForm(true);
      }
    } catch (error) {
      setError("Erro ao realizar login com Google.");
      console.error("Erro ao fazer login: ", error);
    }
  };

  const handleRegister = async () => {
    if (!numero || !cpf) {
      setError("Preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("https://seu-backend.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: userId,
          name,
          email,
          telefone: numero,
          cpf,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao autenticar no backend");
      }

      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("userName", name);
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("telefone", numero);
      sessionStorage.setItem("cpf", cpf);
      sessionStorage.setItem("attempts", data.attempts);
      setAttempts(data.attempts);
      setNext(true);
    } catch (error) {
      setError("Erro ao registrar usuário.");
      console.error("Erro ao registrar: ", error);
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

            {!showForm ? (
              <div className="initial-page-button">
                <div onClick={handleGoogleLogin}>Entrar com Google</div>
              </div>
            ) : (
              <div className="form-container">
                <label>Número de Celular:</label>
                <input
                  type="tel"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="Digite seu número"
                />

                <label>CPF:</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCPF(e.target.value)}
                  placeholder="Digite seu CPF"
                />

                <button onClick={handleRegister}>Confirmar</button>
              </div>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
          </section>
        </div>
        <footer>
          <p>2025 Código Secreto&copy;</p>
        </footer>
      </main>
    </div>
  );
};

export default InitialPage;
