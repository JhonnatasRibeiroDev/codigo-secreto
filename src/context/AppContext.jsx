import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [name, setName] = useState(localStorage.getItem("userName"));
  const [email, setEmail] = useState(localStorage.getItem("userEmail"));
  const [attempts, setAttempts] = useState(
    parseInt(localStorage.getItem("attempts")) || 15
  );

  useEffect(() => {
    if (!userId) {
      const newUserId = crypto.randomUUID();
      localStorage.setItem("userId", newUserId);
      setUserId(newUserId);
    }
  }, [userId]);

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
