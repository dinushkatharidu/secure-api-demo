import { Link } from 'react-router-dom';

export default function Landing() {
  const page = {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg,#eef2ff,#f0f9ff)',
    fontFamily: 'Inter, system-ui, sans-serif'
  };
  const card = {
    width: '100%', maxWidth: 720, padding: 28, borderRadius: 18,
    background: '#fff', border: '1px solid #e2e8f0',
    boxShadow: '0 16px 40px rgba(0,0,0,0.08)'
  };
  const pill = {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 999,
    background: '#eef2ff',
    color: '#4338ca',
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 10
  };
  const actions = { display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' };
  const primary = {
    padding: '10px 14px', borderRadius: 10, border: 'none',
    background: '#4f46e5', color: '#fff', fontWeight: 600, cursor: 'pointer'
  };
  const secondary = {
    padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1',
    background: '#fff', color: '#0f172a', fontWeight: 600, cursor: 'pointer'
  };

  return (
    <div style={page}>
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: '#4f46e5',
            color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, boxShadow: '0 3px 8px rgba(0,0,0,0.15)'
          }}>SA</div>
          <div style={{ fontWeight: 700, color: '#0f172a' }}>Secure App</div>
        </div>

        <div style={{ marginTop: 18 }}>
          <span style={pill}>JWT + Spring Security demo</span>
          <h1 style={{ fontSize: 28, margin: '8px 0', color: '#0f172a' }}>
            Learn-by-doing authentication
          </h1>
          <p style={{ color: '#475569', lineHeight: 1.6 }}>
            A minimal React frontend wired to a Spring Boot backend with JWT. Sign in to access the protected app, or create an account first.
          </p>

          <div style={actions}>
            <Link to="/signin" style={primary}>Sign In</Link>
            <Link to="/signup" style={secondary}>Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
