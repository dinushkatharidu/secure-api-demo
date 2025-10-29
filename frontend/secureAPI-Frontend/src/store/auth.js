// Simple localStorage-based auth helpers (frontend-only roles)

const TOKEN_KEY = 'token';
const ACTIVE_USER_KEY = 'active_user';
const ACTIVE_ROLE_KEY = 'active_role';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ACTIVE_USER_KEY);
  localStorage.removeItem(ACTIVE_ROLE_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}

// Optional: attach in headers
export function getAuthHeader() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// ---- NEW: frontend-only role helpers ----
export function setActiveUser(username) {
  localStorage.setItem(ACTIVE_USER_KEY, username);
}

export function getActiveUser() {
  return localStorage.getItem(ACTIVE_USER_KEY) || null;
}

export function setActiveRole(role) {
  localStorage.setItem(ACTIVE_ROLE_KEY, role);
}

export function getActiveRole() {
  return localStorage.getItem(ACTIVE_ROLE_KEY) || 'USER';
}

export function hasRole(required) {
  const r = getActiveRole();
  return Array.isArray(required) ? required.includes(r) : r === required;
}
