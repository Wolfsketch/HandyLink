// client/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(() => {
    // Probeer authData op te halen uit localStorage
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const user = JSON.parse(localStorage.getItem("user"));
    return token
      ? {
          token,
          isAdmin,
          user,
          rememberMe: true,
        }
      : {
          token: null,
          isAdmin: false,
          user: null,
          rememberMe: false,
        };
  });

  useEffect(() => {
    if (authData.rememberMe) {
      // Sla authData op in localStorage
      localStorage.setItem("token", authData.token);
      localStorage.setItem("isAdmin", authData.isAdmin);
      localStorage.setItem("user", JSON.stringify(authData.user));
    } else {
      // Verwijder authData uit localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("user");
    }
  }, [authData]);

  return (
    <AuthContext.Provider value={{ authData, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
}
