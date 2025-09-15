import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const hasToken = localStorage.getItem('token');
  
  if (!hasToken) {
    // Redirect to login if no token exists
    return <Navigate to="/login" replace />;
  }
  
  return children;
}