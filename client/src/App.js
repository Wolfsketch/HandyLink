// client/src/App.js
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./components/home";
import Aanmelden from "./components/aanmelden";
import AdminDashboard from "./admin/AdminDashboard";
import ManageProfiles from "./admin/ManageProfiles";
import ManageSubscriptions from "./admin/ManageSubscriptions";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./admin/AdminLogin";
import NotAuthorized from "./components/NotAuthorized";
import { AuthContext } from "./contexts/AuthContext";
import AdminAccountCreation from "./admin/AdminAccountCreation";
import EditProfile from "./admin/EditProfile";
import ManageCustomers from "./admin/ManageCustomer";

function App() {
  const { authData } = useContext(AuthContext);
  const isAdmin = authData.isAdmin;

  return (
    <Router>
      <Routes>
        {/* Routes voor de standaard gebruikersinterface */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/aanmelden" element={<Aanmelden />} />
        </Route>

        {/* Admin Inlogpagina */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Beschermde admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute isAllowed={isAdmin}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="admins" element={<ManageProfiles />} />
          <Route path="admin/aanmaken" element={<AdminAccountCreation />} />
          <Route path="abonnementen" element={<ManageSubscriptions />} />
          <Route path="admin/bewerken/:id" element={<EditProfile />} />
          <Route path="klanten" element={<ManageCustomers />} />
          {/* Pas andere routes aan indien nodig */}
        </Route>

        {/* Niet-geautoriseerde toegang */}
        <Route path="/not-authorized" element={<NotAuthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
