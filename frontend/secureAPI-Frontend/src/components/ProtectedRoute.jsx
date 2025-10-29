import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn, hasRole } from '../store/auth';

export default function ProtectedRoute({ children, roles }) {
  const authed = isLoggedIn();
  const loc = useLocation();

  if (!authed) {
    return <Navigate to="/signin" replace state={{ from: loc }} />;
  }
  if (roles && !hasRole(roles)) {
    // user is logged in but does not have required role(s)
    return <Navigate to="/signin" replace state={{ from: loc }} />;
  }
  return children;
}
