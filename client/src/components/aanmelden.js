import React, { useState } from "react";
import axios from "axios";

function Aanmelden() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    trustDevice: false,
  });

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    role: "Client",
    name: "",
    skills: "",
    hourlyRate: "",
    location: "",
  });

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", loginData);
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    let skillsArray = [];
    if (registerData.skills) {
      skillsArray = registerData.skills.split(",").map((skill) => skill.trim());
    }

    const userData = {
      ...registerData,
      skills: registerData.role === "Professional" ? skillsArray : [],
      hourlyRate:
        registerData.role === "Professional" ? registerData.hourlyRate : null,
    };

    try {
      const res = await axios.post("/api/auth/register", userData);
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Login Sectie */}
        <div className="col-md-6">
          <h2>Inloggen</h2>
          <h3>Vul hier je accountgegevens in</h3>
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label>E-mailadres</label>
              <input
                type="email"
                className="form-control auth-input"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <label>Wachtwoord</label>
              <a href="/wachtwoord-vergeten" className="text-muted">
                Wachtwoord vergeten?
              </a>
            </div>

            <div className="form-group">
              <input
                type="password"
                className="form-control"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
            </div>

            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="trustDevice"
                  checked={loginData.trustDevice}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      trustDevice: e.target.checked,
                    })
                  }
                />
                <label className="form-check-label">
                  Vertrouw dit apparaat
                </label>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Aanmelden
            </button>
          </form>

          <div className="social-login mt-4">
            <h3>Of inloggen via</h3>
            <div className="d-flex flex-column">
              <button className="btn-facebook mb-2">Facebook</button>
              <button className="btn-google mb-2">Google</button>
              <button className="btn-apple mb-2">Apple</button>
              <button className="btn-hotmail mb-2">Hotmail</button>
            </div>
          </div>
        </div>

        {/* Registratie Sectie */}
        <div className="col-md-6">
          <h2>Account Aanmaken</h2>
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div className="form-group">
              <label>E-mailadres</label>
              <input
                type="email"
                className="form-control auth-input"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Wachtwoord</label>
              <input
                type="password"
                className="form-control auth-input"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Naam</label>
              <input
                type="text"
                className="form-control auth-input"
                name="name"
                value={registerData.name}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Rol</label>
              <select
                className="form-control auth-select"
                name="role"
                value={registerData.role}
                onChange={handleRegisterChange}
                required
              >
                <option value="Client">Particulier</option>
                <option value="Professional">Professional</option>
              </select>
            </div>
            {registerData.role === "Professional" && (
              <>
                <div className="form-group">
                  <label>Vaardigheden (gescheiden door komma's)</label>
                  <input
                    type="text"
                    className="form-control auth-input"
                    name="skills"
                    value={registerData.skills}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Uurtarief</label>
                  <input
                    type="number"
                    className="form-control auth-input"
                    name="hourlyRate"
                    value={registerData.hourlyRate}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
              </>
            )}
            <div className="form-group">
              <label>Locatie</label>
              <input
                type="text"
                className="form-control auth-input"
                name="location"
                value={registerData.location}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Account Aanmaken
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Aanmelden;
