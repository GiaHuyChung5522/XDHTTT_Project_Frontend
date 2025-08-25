import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../auth/auth.service';
import type { PropsWithChildren } from 'react';

export default function ProtectedRoute(
  { children, requireAdmin = false }: PropsWithChildren<{ requireAdmin?: boolean }>
) {
  const location = useLocation();
  const isAuthed = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  if (!isAuthed) {
    return <Navigate to="/admin2/login" replace state={{ from: location }} />;
  }
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin2/login" replace />;
  }
  return <>{children}</>;
}
