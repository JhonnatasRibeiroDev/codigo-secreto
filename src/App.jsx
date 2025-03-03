import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import InitialPage from "./pages/InitialPage";
import AttemptsPage from "./pages/AttemptsPage";
import RecoverPage from "./pages/RecoverPage";
import CongratsPage from "./pages/CongratsPage";
import GoogleLogin from "./components/GoogleLogin";
import "./App.css";

const Projeto = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<InitialPage />} />
          <Route path="/tentativas" element={<AttemptsPage />} />
          <Route path="/recuperar" element={<RecoverPage />} />
          <Route path="/parabens" element={<CongratsPage />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

//autentica com o google
const TesteGoogle = () => {
  return (
    <div>
      <h1>Bem-vindo ao nosso aplicativo!</h1>
      <GoogleLogin /> {/* Use o componente */}
    </div>
  );
};

const App = () => {
  return <Projeto />;
};

export default App;
