import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" replace />;

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'admin' ? '/admin/movies' : '/user/movies'} replace />;
  }

  return children;
}
