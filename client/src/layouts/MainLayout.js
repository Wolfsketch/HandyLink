// client/src/layouts/MainLayout.js
import React from "react";
import Navbar from "../components/navbar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
