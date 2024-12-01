import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../Style/EditProfile.css";

function EditProfile() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `https://localhost:5000/api/profiles/${id}`
        );
        const data = await response.json();
        setProfileData(data); // Profielgegevens instellen
      } catch (error) {
        console.error("Fout bij het ophalen van het profiel:", error);
      }
    };

    fetchProfile();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `https://localhost:5000/api/profiles/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileData),
        }
      );
      if (response.ok) {
        alert("Profiel succesvol bijgewerkt!");
      } else {
        alert("Er is een fout opgetreden bij het bijwerken van het profiel.");
      }
    } catch (error) {
      console.error("Fout bij het bijwerken van het profiel:", error);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Wachtwoorden komen niet overeen.");
      return;
    }
    try {
      const response = await fetch(
        `https://localhost:5000/api/profiles/${id}/password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(passwordData),
        }
      );
      if (response.ok) {
        alert("Wachtwoord succesvol bijgewerkt!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert(
          "Er is een fout opgetreden bij het bijwerken van het wachtwoord."
        );
      }
    } catch (error) {
      console.error("Fout bij het bijwerken van het wachtwoord:", error);
    }
  };

  if (!profileData) {
    return <div>Gegevens laden...</div>;
  }

  return (
    <div className="edit-profile">
      <h2>Bewerk Profiel</h2>
      <div className="profile-details">
        <label>Naam</label>
        <input
          type="text"
          value={profileData.name}
          onChange={(e) =>
            setProfileData({ ...profileData, name: e.target.value })
          }
        />
        <label>Email</label>
        <input
          type="email"
          value={profileData.email}
          onChange={(e) =>
            setProfileData({ ...profileData, email: e.target.value })
          }
        />
        <label>Rol</label>
        <input
          type="text"
          value={profileData.role}
          onChange={(e) =>
            setProfileData({ ...profileData, role: e.target.value })
          }
        />
        <label>Status</label>
        <select
          value={profileData.status}
          onChange={(e) =>
            setProfileData({ ...profileData, status: e.target.value })
          }
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button className="btn btn-blue" onClick={handleUpdate}>
          Bijwerken
        </button>
      </div>

      <div className="password-update">
        <h3>Wachtwoord wijzigen</h3>
        <label>Huidig Wachtwoord</label>
        <input
          type="password"
          value={passwordData.currentPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              currentPassword: e.target.value,
            })
          }
        />
        <label>Nieuw Wachtwoord</label>
        <input
          type="password"
          value={passwordData.newPassword}
          onChange={(e) =>
            setPasswordData({ ...passwordData, newPassword: e.target.value })
          }
        />
        <label>Herhaal Nieuw Wachtwoord</label>
        <input
          type="password"
          value={passwordData.confirmPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              confirmPassword: e.target.value,
            })
          }
        />
        <button className="btn btn-gray" onClick={handlePasswordUpdate}>
          Wachtwoord Bijwerken
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
