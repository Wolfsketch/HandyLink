import React, { useState } from "react";

function AdminAccountCreation() {
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:5000/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      });

      if (response.ok) {
        alert("Admin account succesvol aangemaakt!");
        setAdminData({ name: "", email: "", password: "" });
      } else {
        const errorData = await response.json();
        console.error("Serverfout:", errorData);
        alert("Er is een fout opgetreden bij het aanmaken van het account.");
      }
    } catch (error) {
      console.error("Netwerkfout:", error);
      alert("Er is een fout opgetreden. Probeer het opnieuw.");
    }
  };

  return (
    <div className="admin-account-creation">
      <h2>Admin Account Aanmaken</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Naam</label>
          <input
            type="text"
            name="name"
            value={adminData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>E-mailadres</label>
          <input
            type="email"
            name="email"
            value={adminData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Wachtwoord</label>
          <input
            type="password"
            name="password"
            value={adminData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Aanmaken
        </button>
      </form>
    </div>
  );
}

export default AdminAccountCreation;
