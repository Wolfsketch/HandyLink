import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <div className="top-bar">
        <span>België | Klusjes Platform</span>
        <Link to="/contact">Contact</Link>
        <Link to="/aanmelden">Aanmelden</Link>
      </div>

      <div className="header">
        <Link className="navbar-brand" to="/">
          Klusjes Platform
        </Link>
      </div>

      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/request-job">Klusjes Aanvragen</Link>
        <Link to="/offer-service">Dienst Aanbieden</Link>
        <Link to="/profile">Mijn Profiel</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </>
  );
}

export default Navbar;
