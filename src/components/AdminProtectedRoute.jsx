import { Navigate } from 'react-router-dom';

const ADMIN_SESSION_KEY = 'admin_session';

const AdminProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

export default AdminProtectedRoute;
