import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { signInWithGoogle } from "../components/firebaseConfig"; // Importando a função de login
import logo from "../assets/logo-white.png";
import logo_user from "../assets/user.png";
import "../styles/InitialPage.css";
import Cadeado from "../assets/cadeadoLogoBlack.png";

const InitialPage = () => {
  const { userId, setUserId, name, setName, email, setEmail, setAttempts } =
    useAppContext();
  const [error, setError] = useState("");
  const [next, setNext] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verifica se o usuário já está logado na sessionStorage
    const storedUserId = sessionStorage.getItem("userId");
    const storedName = sessionStorage.getItem("userName");
    const storedEmail = sessionStorage.getItem("userEmail");

    if (storedUserId && storedName && storedEmail) {
      setUserId(storedUserId);
      setName(storedName);
      setEmail(storedEmail);
      setAttempts(parseInt(sessionStorage.getItem("attempts"))); // Carrega as tentativas
      setNext(true);
    }
  }, [setUserId, setName, setEmail, setAttempts]);

  const handleGoogleLogin = async () => {
    try {
      // Chamando a função para fazer o login com Google
      const result = await signInWithGoogle(); // Agora retornando o resultado corretamente
      const user = result.user; // Acessando o `user` a partir do resultado

      // Verificando se o usuário foi recuperado
      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      // Atualizando o estado do usuário no contexto e no sessionStorage
      setUser(user);
      setUserId(user.uid);
      setName(user.displayName || "");
      setEmail(user.email || "");
      setAttempts(15); // Inicializa com 15 tentativas

      // Armazenando as informações no sessionStorage
      sessionStorage.setItem("userId", user.uid);
      sessionStorage.setItem("userName", user.displayName || "");
      sessionStorage.setItem("userEmail", user.email || "");
      sessionStorage.setItem("attempts", 15);

      setNext(true); // Redireciona para a página de tentativas
    } catch (error) {
      setError("Erro ao realizar login com Google.");
      console.error("Erro ao fazer login: ", error);
      console.log("Dados do usuário:", user); // Exibindo o estado atual de `user` (que pode ser null)
      console.log("next:", next); // Verificando o valor de `next`
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
