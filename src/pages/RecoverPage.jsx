import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

const RecoverPage = () => {
  const { setAttempts } = useAppContext();
  const [code, setCode] = useState("");

  const handleRecover = () => {
    if (code === "RESET123") {
      setAttempts(15);
      window.location.href = "/tentativas";
    }
  };

  return (
    <div>
      <h1>Digite o código de recuperação:</h1>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleRecover}>Recuperar</button>
    </div>
  );
};

export default RecoverPage;
