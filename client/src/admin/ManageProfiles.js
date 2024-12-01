import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Style/ManageProfiles.css";

function ManageProfiles() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("https://localhost:5000/api/profiles"); // API endpoint
        const data = await response.json();
        console.log("Ontvangen data van API:", data); // Log de API-respons
        setProfiles(data); // Stel de profielen in
      } catch (error) {
        console.error("Fout bij het ophalen van profielen:", error);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div>
      <h2>Profielen Beheren</h2>
      <Link to="/admin/profiles/create" className="btn btn-primary">
        Admin Account Aanmaken
      </Link>
      <table className="profile-table">
        <thead>
          <tr>
            <th>Naam</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Status</th>
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile._id}>
              <td>{profile.name}</td>
              <td>{profile.email}</td>
              <td>{profile.role}</td>
              <td>{profile.status}</td>
              <td>
                <Link
                  to={`/admin/profiles/edit/${profile._id}`}
                  className="btn btn-secondary"
                >
                  Bewerk
                </Link>
                <button className="btn btn-danger">Verwijder</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageProfiles;
