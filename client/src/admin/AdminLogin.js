// client/src/admin/AdminLogin.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const { setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleCheckboxChange = (e) =>
    setCredentials({ ...credentials, rememberMe: e.target.checked });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Valideer de inloggegevens
    if (credentials.username === "admin" && credentials.password === "admin") {
      // Stel de authData in
      setAuthData({
        token: "dummy-admin-token",
        isAdmin: true,
        user: { username: "admin", role: "Admin" },
        rememberMe: credentials.rememberMe,
      });
      navigate("/admin/dashboard");
    } else {
      setError("Ongeldige gebruikersnaam of wachtwoord");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-form">
        <h2>Admin Inloggen</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Gebruikersnaam</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Gebruikersnaam"
            />
          </div>
          <div className="form-group">
            <label>Wachtwoord</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Wachtwoord"
            />
          </div>
          <div className="form-group remember-me">
            <label>
              <input
                type="checkbox"
                name="rememberMe"
                checked={credentials.rememberMe}
                onChange={handleCheckboxChange}
              />
              Onthoud mij
            </label>
          </div>
          <button type="submit" className="login-button">
            Inloggen
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
