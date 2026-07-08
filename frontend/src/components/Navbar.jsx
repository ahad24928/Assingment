import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import api from "../api/api";
import "./Navbar.css";

const IconCompose = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);
const IconChart = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 3v18h18" />
    <path d="M7 15v3M12 10v8M17 6v12" />
  </svg>
);
const IconSettings = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9c.14.42.42.79.79 1.05.36.26.8.4 1.24.4H21a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z" />
  </svg>
);
const IconChevron = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const IconLogout = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadUser();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch {}
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}

    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <nav className="nb-nav">
      <div className="nb-inner">
        <div className="nb-brand">
          <span className="nb-brand-mark">✉</span>
          <span className="nb-brand-name">Bulk Email Sender</span>
        </div>

        <div className="nb-links">
          <Link className={`nb-link ${isActive("/") ? "nb-link-active" : ""}`} to="/">
            <IconCompose />
            Compose
          </Link>

          <Link
            className={`nb-link ${isActive("/reports") ? "nb-link-active" : ""}`}
            to="/reports"
          >
            <IconChart />
            Reports
          </Link>

          <Link
            className={`nb-link ${isActive("/myconfig") ? "nb-link-active" : ""}`}
            to="/myconfig"
          >
            <IconSettings />
            My Configs
          </Link>

          <div className="nb-user-wrap" ref={dropdownRef}>
            <button
              type="button"
              className={`nb-user-btn ${open ? "nb-user-btn-open" : ""}`}
              onClick={() => setOpen(!open)}
            >
              <span className="nb-avatar">{initials}</span>
              <span className="nb-user-name">{user?.name || "Account"}</span>
              <span className={`nb-chevron ${open ? "nb-chevron-open" : ""}`}>
                <IconChevron />
              </span>
            </button>

            {open && (
              <div className="nb-dropdown">
                <div className="nb-dropdown-header">
                  <span className="nb-avatar nb-avatar-lg">{initials}</span>
                  <div className="nb-dropdown-user">
                    <strong>{user?.name || "Account"}</strong>
                    <small>{user?.email}</small>
                  </div>
                </div>

                <div className="nb-dropdown-divider" />

                <Link to="/myconfig" className="nb-menu-item" onClick={() => setOpen(false)}>
                  <IconSettings />
                  SMTP Configuration
                </Link>

                <button type="button" className="nb-menu-item nb-menu-item-danger" onClick={logout}>
                  <IconLogout />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
