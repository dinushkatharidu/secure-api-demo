import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", confirm: "", role: "USER" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");
    if (!form.username || !form.password || !form.confirm) {
      setErr("Fill all fields.");
      return;
    }
    if (form.password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setErr("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      // Backend ignores extra fields; harmless to send role
      await api.post("/api/auth/signup", {
        username: form.username,
        password: form.password,
        role: form.role,
      });

      // Remember chosen role for this username (frontend-only)
      localStorage.setItem(`role:${form.username}`, form.role);

      setOk("Account created! You can sign in now.");
      setTimeout(() => navigate("/signin"), 900);
    } catch (error) {
      if (error.response?.status === 409) setErr("Username already exists.");
      else if (error.response) setErr(error.response.data || "Signup failed.");
      else setErr("Server unreachable. Try again.");
    } finally {
      setLoading(false);
    }
  };

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
    maxWidth: 420,
    background: "#fff",
    padding: "28px 24px",
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
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
            Create Account
          </h2>
          <p style={{ color: "#64748b", fontSize: 13 }}>It’s quick and easy</p>
        </div>

        <label style={{ fontSize: 13, fontWeight: 500 }}>Username</label>
        <input
          style={input}
          name="username"
          value={form.username}
          onChange={onChange}
          placeholder="choose a username"
          autoComplete="username"
        />

        <label style={{ fontSize: 13, fontWeight: 500 }}>Password</label>
        <input
          style={input}
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="at least 6 characters"
          autoComplete="new-password"
        />

        <label style={{ fontSize: 13, fontWeight: 500 }}>
          Confirm Password
        </label>
        <input
          style={input}
          name="confirm"
          type="password"
          value={form.confirm}
          onChange={onChange}
          placeholder="repeat your password"
          autoComplete="new-password"
        />

        {/* Role (required) */}
        <label style={{ fontSize: 13, fontWeight: 500 }}>Role</label>
        <select
          name="role"
          value={form.role}
          onChange={onChange}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            marginTop: 6,
            marginBottom: 14,
            fontSize: 14,
            outline: "none",
            background: "#fff",
          }}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

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
        {ok && (
          <div
            style={{
              background: "#dcfce7",
              color: "#166534",
              border: "1px solid #bbf7d0",
              borderRadius: 8,
              padding: "8px 10px",
              fontSize: 13,
              marginBottom: 8,
            }}
          >
            {ok}
          </div>
        )}

        <button type="submit" disabled={loading} style={button}>
          {loading ? "Creating…" : "Sign Up"}
        </button>

        <p
          style={{
            textAlign: "center",
            fontSize: 13,
            marginTop: 12,
            color: "#475569",
          }}
        >
          Already have an account?{" "}
          <Link to="/signin" style={link}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
