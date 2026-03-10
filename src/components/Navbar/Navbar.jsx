import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const DEPARTMENTS = ["ICU", "Lab", "Pharmacy", "Emergency"];

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("");
}

export default function Navbar({ department, setDepartment }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <div className="navbar-brand-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          Hospital Chat
        </div>

        <div className="navbar-tabs">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              className={`navbar-tab ${department === dept ? "active" : ""}`}
              onClick={() => setDepartment(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-avatar-wrapper" ref={dropRef}>
          <button
            className="navbar-avatar-btn"
            onClick={() => setOpen((o) => !o)}
            title={user?.name}
          >
            {getInitials(user?.name || "U")}
          </button>

          {open && (
            <div className="navbar-dropdown">
              <div className="navbar-dropdown-header">
                <div className="navbar-dropdown-name">{user?.name}</div>
                <div className="navbar-dropdown-role">{user?.role} · {user?.department}</div>
              </div>

              <button className="navbar-dropdown-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Profile
              </button>

              <button className="navbar-dropdown-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                  <path d="M4.93 4.93a10 10 0 0 0 0 14.14"/>
                </svg>
                Settings
              </button>

              <button className="navbar-dropdown-item danger" onClick={handleLogout}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
