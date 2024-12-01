// components/klusjesplatform-admin.js

import React, { useState, useEffect } from "react";
import axios from "axios";

function KlusjesplatformAdmin() {
  const [profiles, setProfiles] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    fetchProfiles();
    fetchSubscriptions();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get("/api/admin/profiles");
      setProfiles(response.data);
    } catch (error) {
      console.error("Fout bij het ophalen van profielen:", error);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get("/api/admin/subscriptions");
      setSubscriptions(response.data);
    } catch (error) {
      console.error("Fout bij het ophalen van abonnementen:", error);
    }
  };

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
  };

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      await axios.put(
        `/api/admin/profiles/${updatedProfile.id}`,
        updatedProfile
      );
      fetchProfiles();
      setSelectedProfile(null);
    } catch (error) {
      console.error("Fout bij het bijwerken van profiel:", error);
    }
  };

  const handleProfileDelete = async (profileId) => {
    try {
      await axios.delete(`/api/admin/profiles/${profileId}`);
      fetchProfiles();
    } catch (error) {
      console.error("Fout bij het verwijderen van profiel:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Beheerderssectie</h1>
      <div className="admin-sections">
        <div className="profiles-section">
          <h2>Profielen Beheren</h2>
          <ul>
            {profiles.map((profile) => (
              <li key={profile.id}>
                {profile.name}
                <button onClick={() => handleProfileSelect(profile)}>
                  Bewerken
                </button>
                <button onClick={() => handleProfileDelete(profile.id)}>
                  Verwijderen
                </button>
              </li>
            ))}
          </ul>
          {selectedProfile && (
            <ProfileEditor
              profile={selectedProfile}
              onUpdate={handleProfileUpdate}
              onCancel={() => setSelectedProfile(null)}
            />
          )}
        </div>
        <div className="subscriptions-section">
          <h2>Abonnementeninkomsten</h2>
          <ul>
            {subscriptions.map((sub) => (
              <li key={sub.id}>
                {sub.companyName}: €{sub.amount} per {sub.period}
              </li>
            ))}
          </ul>
        </div>
        {/* Voeg hier andere beheertaken toe */}
      </div>
    </div>
  );
}

function ProfileEditor({ profile, onUpdate, onCancel }) {
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedProfile);
  };

  return (
    <div className="profile-editor">
      <h3>Profiel Bewerken</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Naam:
          <input
            type="text"
            name="name"
            value={editedProfile.name}
            onChange={handleChange}
          />
        </label>
        {/* Voeg hier meer velden toe indien nodig */}
        <button type="submit">Opslaan</button>
        <button type="button" onClick={onCancel}>
          Annuleren
        </button>
      </form>
    </div>
  );
}

export default KlusjesplatformAdmin;
