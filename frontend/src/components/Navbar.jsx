import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {}

    navigate("/login");
  };

  const active = (path) =>
    location.pathname === path
      ? {
          background: "#2563eb",
          color: "white",
        }
      : {};

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px 30px",
        background: "#1f2937",
        color: "white",
      }}
    >
      <h2>Bulk Email Sender</h2>

      <div style={{ display: "flex", gap: "15px" }}>
        <Link style={{ ...linkStyle, ...active("/") }} to="/">
          📨 Compose
        </Link>

        <Link style={{ ...linkStyle, ...active("/configs") }} to="/configs">
          ⚙ My Configs
        </Link>

        <Link style={{ ...linkStyle, ...active("/reports") }} to="/reports">
          📊 Reports
        </Link>

        <button onClick={logout} style={logoutBtn}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

const linkStyle = {
  textDecoration: "none",
  color: "white",
  padding: "8px 15px",
  borderRadius: "6px",
};

const logoutBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 15px",
  cursor: "pointer",
  borderRadius: "6px",
};