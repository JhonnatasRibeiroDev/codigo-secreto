import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));
  const [name, setName] = useState(sessionStorage.getItem("userName"));
  const [email, setEmail] = useState(sessionStorage.getItem("userEmail"));
  const [attempts, setAttempts] = useState(
    parseInt(sessionStorage.getItem("attempts")) || 15
  );

  useEffect(() => {
    localStorage.setItem("attempts", attempts);
  }, [attempts]);

  return (
    <AppContext.Provider
      value={{
        userId,
        setUserId,
        name,
        setName,
        email,
        setEmail,
        attempts,
        setAttempts,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
