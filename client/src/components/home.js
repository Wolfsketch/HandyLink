// client/src/components/home.js
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="jumbotron">
      <h1 className="display-4">Welkom op het Klusjes Platform</h1>
      <p className="lead">
        Vind de juiste professional voor uw klusjes of bied uw diensten aan.
      </p>
      <hr className="my-4" />
      <p>Registreer nu om te beginnen.</p>
      <Link className="btn btn-primary btn-lg" to="/register" role="button">
        Registreren
      </Link>
    </div>
  );
}

export default Home;
