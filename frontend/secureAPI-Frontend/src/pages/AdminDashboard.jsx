import { useNavigate } from "react-router-dom";
import { clearToken, getActiveUser } from "../store/auth";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const username = getActiveUser() || "Admin";

  const logout = () => {
    clearToken();
    navigate("/signin", { replace: true });
  };

  const container = {
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "linear-gradient(135deg,#faf5ff,#f0f9ff)",
  };
  const header = {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(8px)",
    borderBottom: "1px solid #e2e8f0",
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
  };
  const logo = {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "#9333ea",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
  };
  const card = {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 24,
    margin: "24px auto",
    maxWidth: 700,
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  };

  return (
    <div style={container}>
      <header style={header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={logo}>AD</div> Admin Dashboard
        </div>
        <button
          onClick={logout}
          style={{
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            padding: "6px 12px",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      <main style={{ padding: 24 }}>
        <div style={card}>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>
            Welcome back, {username} 👋
          </h2>
          <p style={{ fontSize: 14, color: "#475569", marginTop: 4 }}>
            You are logged in as an <b>Admin</b>.  
            Here you can manage users, view analytics, and monitor activity.
          </p>
        </div>
      </main>
    </div>
  );
}
