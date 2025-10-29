import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../api/client";
import { setToken, setActiveUser, setActiveRole } from "../store/auth";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname; // if user was redirected from a protected page

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.username || !form.password) {
      setErr("Please enter username and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/auth/signin", form);
      setToken(res.data.token);

      // remember the active user + role (frontend-only)
      setActiveUser(form.username);
      const savedRole = localStorage.getItem(`role:${form.username}`) || "USER";
      setActiveRole(savedRole);

      // Priority 1: if user was forced here from a protected route, go back there
      if (from && from !== "/signin") {
        navigate(from, { replace: true });
        return;
      }

      // Priority 2: send to dashboard based on role
      if (savedRole === "ADMIN") {
        navigate("/admin", { replace: true }); // Admin dashboard route
      } else {
        navigate("/user", { replace: true }); // User dashboard route
      }
    } catch (error) {
      if (error.response?.status === 401) setErr("Bad credentials.");
      else setErr("Server unreachable. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // keep your existing look
  const page = {
    display: "grid",
    placeItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg,#eef2ff,#f0f9ff)",
    fontFamily: "Inter, system-ui, sans-serif",
    padding: 16,
  };
  const card = {
    width: "100%",
    maxWidth: 380,
    background: "#fff",
    padding: "28px 24px",
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
  };
  const input = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 14,
    fontSize: 14,
    outline: "none",
  };
  const button = {
    width: "100%",
    padding: "10px",
    borderRadius: 8,
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 15,
    opacity: loading ? 0.6 : 1,
  };
  const link = { color: "#4f46e5", textDecoration: "none", fontWeight: 600 };

  return (
    <div style={page}>
      <form style={card} onSubmit={onSubmit}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#4f46e5",
              color: "#fff",
              fontWeight: 700,
              display: "grid",
              placeItems: "center",
              margin: "0 auto",
              boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
            }}
          >
            SA
          </div>
          <h2 style={{ marginTop: 12, fontSize: 22, fontWeight: 600 }}>
            Welcome Back
          </h2>
          <p style={{ color: "#64748b", fontSize: 13 }}>Sign in to continue</p>
        </div>

        <label style={{ fontSize: 13, fontWeight: 500 }}>Username</label>
        <input
          style={input}
          name="username"
          value={form.username}
          onChange={onChange}
          placeholder="your username"
          autoComplete="username"
        />
        <label style={{ fontSize: 13, fontWeight: 500 }}>Password</label>
        <input
          style={input}
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        {err && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
              borderRadius: 8,
              padding: "8px 10px",
              fontSize: 13,
              marginBottom: 8,
            }}
          >
            {err}
          </div>
        )}

        <button type="submit" disabled={loading} style={button}>
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            marginTop: 12,
            color: "#475569",
          }}
        >
          No account?{" "}
          <Link to="/signup" style={link}>
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
