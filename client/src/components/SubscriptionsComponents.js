import React, { useEffect, useState } from "react";
import "./Subscriptions.css";

function SubscriptionsComponent() {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(
          "https://localhost:5000/api/subscriptions"
        );
        const data = await response.json();
        setSubscriptions(data);
      } catch (error) {
        console.error("Fout bij het ophalen van abonnementen:", error);
      }
    };
    fetchSubscriptions();
  }, []);

  return (
    <div className="subscriptions">
      {subscriptions.map((sub) => (
        <div
          className={`subscription ${sub.mostPopular ? "popular" : ""}`}
          key={sub._id}
        >
          <h3>{sub.name}</h3>
          <p>€{sub.price}</p>
          <p>{sub.duration}</p>
          <ul>
            {sub.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <button>Start Nu</button>
        </div>
      ))}
    </div>
  );
}

export default SubscriptionsComponent;
