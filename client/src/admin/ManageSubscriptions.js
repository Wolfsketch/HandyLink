import React, { useState, useEffect } from "react";
import "../Style/ManageSubscriptions.css";

function ManageSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(
          "https://localhost:5000/api/subscriptions"
        );
        const data = await response.json();
        setSubscriptions(data);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
      }
    };

    fetchSubscriptions();
  }, []);

  return (
    <div className="table-container">
      <h2 className="table-header">Abonnementen Beheren</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Naam</th>
            <th>Prijs (€)</th>
            <th>Duur</th>
            <th>Voordelen</th>
            <th>Tag</th>
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr key={sub._id}>
              <td>{sub.name}</td>
              <td>{sub.price}</td>
              <td>{sub.duration}</td>
              <td>{sub.benefits.join(", ")}</td>
              <td>{sub.tag || "Geen tag"}</td>
              <td className="table-actions">
                <button>Bewerk</button>
                <button className="btn-danger">Verwijder</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageSubscriptions;
