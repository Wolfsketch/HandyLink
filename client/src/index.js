// client/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import "./index.css";
import "./Style/Auth.css";
import "./Style/Navbar.css";
import "./Style/AdminLogin.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider, createTheme } from "@mui/material/styles"; // Importeer ThemeProvider en createTheme

// Maak een thema aan (je kunt dit aanpassen naar wens)
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Blauw
    },
    secondary: {
      main: "#dc004e", // Rood
    },
    background: {
      default: "#f5f5f5", // Lichtgrijze achtergrond
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);

// Rest van je code
reportWebVitals();
