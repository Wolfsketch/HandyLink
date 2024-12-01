// client/src/admin/AdminSidebar.js
import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../Style/Admin.css";
import { AuthContext } from "../contexts/AuthContext";
import {
  FaSearch,
  FaTachometerAlt,
  FaUserShield,
  FaUsers,
  FaDollarSign,
  FaChartBar,
  FaPlug,
  FaCalendarAlt,
  FaComments,
  FaInbox,
  FaLifeRing,
  FaFileInvoiceDollar,
  FaShieldAlt,
  FaStar,
  FaSearchPlus,
  FaSignOutAlt,
} from "react-icons/fa";

function AdminSidebar() {
  const { setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthData({
      token: null,
      isAdmin: false,
      user: null,
      rememberMe: false,
    });
    navigate("/admin");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    console.log("Zoekopdracht:", query);
  };

  return (
    <div className="admin-sidebar">
      {/* Profielsectie */}
      <div className="profile-section">
        <img src="/path/to/profile.jpg" alt="Profile" />
        <div>
          <div className="profile-name">Admin Naam</div>
          <div className="profile-status">Online</div>
        </div>
      </div>

      {/* Zoekbalk */}
      <form onSubmit={handleSearch} className="admin-search-form">
        <div className="search-group">
          <input
            type="text"
            name="search"
            placeholder="Zoeken..."
            className="search-input"
          />
          <span className="search-icon">
            <FaSearch />
          </span>
        </div>
      </form>

      {/* Navigatielinks */}
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/admin/dashboard" className="nav-link">
            <FaTachometerAlt className="nav-icon" /> Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/admins" className="nav-link">
            <FaUserShield className="nav-icon" /> Admin
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/klanten" className="nav-link">
            <FaUsers className="nav-icon" /> Klanten
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/abonnementen" className="nav-link">
            <FaDollarSign className="nav-icon" /> Abonnementen
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/statistieken" className="nav-link">
            <FaChartBar className="nav-icon" /> Statistieken
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/plugins" className="nav-link">
            <FaPlug className="nav-icon" /> Plugins
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/kalender" className="nav-link">
            <FaCalendarAlt className="nav-icon" /> Kalender
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/chat" className="nav-link">
            <FaComments className="nav-icon" /> Chat
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/inbox" className="nav-link">
            <FaInbox className="nav-icon" /> Inbox
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/support" className="nav-link">
            <FaLifeRing className="nav-icon" /> Support
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/facturatie" className="nav-link">
            <FaFileInvoiceDollar className="nav-icon" /> Facturatie
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/beveiliging" className="nav-link">
            <FaShieldAlt className="nav-icon" /> Beveiligingsfuncties
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/feedback" className="nav-link">
            <FaStar className="nav-icon" /> Feedback en Reviews
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/admin/seo" className="nav-link">
            <FaSearchPlus className="nav-icon" /> SEO Beheer
          </NavLink>
        </li>
      </ul>

      {/* Uitlogknop */}
      <button onClick={handleLogout} className="logout-button">
        <FaSignOutAlt className="nav-icon" /> Uitloggen
      </button>
    </div>
  );
}

export default AdminSidebar;
