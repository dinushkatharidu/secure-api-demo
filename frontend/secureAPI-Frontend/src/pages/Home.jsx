import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { clearToken, getActiveRole } from "../store/auth";

export default function Home() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Optional: requires your backend JWT filter + GET /api/me
        const res = await api.get("/api/me");
        if (mounted) setMe(res.data);
      } catch {
        setErr("Could not load profile.");
      }
    })();
    return () => { mounted = false; };
  }, []);

  const logout = () => {
    clearToken();
    navigate("/signin", { replace: true });
  };

  const container = {
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "linear-gradient(135deg,#f8fafc,#f1f5f9)",
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
  const brand = { display: "flex", alignItems: "center", gap: 10, fontWeight: 600, color: "#1e293b" };
  const logo = {
    width: 36, height: 36, borderRadius: 10, background: "#4f46e5",
    color: "#fff", display: "grid", placeItems: "center", fontWeight: 700,
  };
  const btn = { border: "1px solid #cbd5e1", borderRadius: 8, padding: "6px 12px", background: "#fff", cursor: "pointer" };
  const card = {
    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
    padding: 24, margin: "24px auto", maxWidth: 700, boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  };

  const display = me ? { ...me, role: me.role || getActiveRole() } : null;

  return (
    <div style={container}>
      <header style={header}>
        <div style={brand}>
          <div style={logo}>SA</div> Secure App
        </div>
        <button onClick={logout} style={btn}>Logout</button>
      </header>

      <main style={{ padding: 24 }}>
        <div style={card}>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>Welcome 👋</h2>
          <p style={{ fontSize: 14, color: "#475569", marginTop: 4 }}>
            You’re logged in. This page is protected by a JWT.
          </p>

          {err && (
            <div style={{
              marginTop: 12, background: "#fee2e2", border: "1px solid #fecaca",
              color: "#b91c1c", borderRadius: 8, padding: "8px 10px", fontSize: 13,
            }}>{err}</div>
          )}

          {display && (
            <div style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 500, color: "#334155" }}>Profile</h3>
              <pre style={{
                background: "#0f172a", color: "#f8fafc", fontSize: 12,
                borderRadius: 10, padding: 12, overflow: "auto", marginTop: 6,
              }}>
                {JSON.stringify(display, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
