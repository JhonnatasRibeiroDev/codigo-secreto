// GoogleLogin.js
import React, { useState } from "react";
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "./firebaseConfig"; // Importando a configuração do Firebase

const auth = getAuth(app); // Inicializa a autenticação com o Firebase

const GoogleLogin = () => {
  const [user, setUser] = useState(null); // Armazenar o usuário autenticado

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider(); // Criando o provedor de autenticação do Google

    try {
      const result = await signInWithPopup(auth, provider); // Realiza o login com o Google
      const user = result.user; // Obtém os dados do usuário após o login bem-sucedido
      console.log("Usuário logado com o Google:", user);
      setUser(user); // Armazena o usuário no estado
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Usuário deslogado com sucesso");
      setUser(null); // Limpa o usuário do estado
    } catch (error) {
      console.error("Erro ao deslogar:", error.message);
    }
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>Login com Google</button>
      {user && (
        <div>
          <p>Bem-vindo, {user.displayName}!</p>
          <img src={user.photoURL} alt="User Profile" />
          <button onClick={handleSignOut}>Deslogar</button>
        </div>
      )}
    </div>
  );
};

export default GoogleLogin;
