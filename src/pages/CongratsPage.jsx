import React from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import cadeadoLogoWhite from "../assets/cadeadoLogoWhite.png"; // Imagem do logo
import "../styles/CongratsPage.css"; // Importando o CSS

const CongratsPage = () => {
  // Navegação programática
  const navigate = useNavigate(); // Usar o hook useNavigate para navegação

  const handleGoHome = () => {
    return navigate("/"); // Navegar para a página inicial
  };

  return (
    <div className="congrats-page-container">
      <div className="congrats-page-content">
        <img src={cadeadoLogoWhite} alt="Logo" className="congrats-page-logo" />
        <h1 className="congrats-page-title">
          Parabéns! Você acertou o código.
        </h1>

        <button className="congrats-page-button" onClick={handleGoHome}>
          Voltar para a página inicial
        </button>
      </div>
    </div>
  );
};

export default CongratsPage;
