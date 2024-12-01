// client/src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function ProtectedRoute({ isAllowed, redirectPath = "/admin", children }) {
  const { authData } = useContext(AuthContext);

  if (!authData.token) {
    // Gebruiker is niet ingelogd
    return <Navigate to={redirectPath} replace />;
  }

  if (!isAllowed) {
    // Gebruiker is ingelogd maar niet geautoriseerd
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
