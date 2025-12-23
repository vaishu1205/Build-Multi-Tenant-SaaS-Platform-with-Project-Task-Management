import { isAuthenticated } from '../utils/auth';

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return null;
  }
  return children;
}
