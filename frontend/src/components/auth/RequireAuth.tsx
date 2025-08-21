import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../features/auth/authSlice';
import LoadingScreen from '../common/LoadingScreen';

interface RequireAuthProps {
  allowedRoles?: UserRole[];
  requireVerification?: boolean;
  children?: React.ReactNode;
}

const RequireAuth = ({ 
  allowedRoles = ['user', 'verifier', 'admin'],
  requireVerification = false,
  children
}: RequireAuthProps) => {
  const { isAuthenticated, isLoading, user, hasAnyRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has any of the allowed roles
  if (user && !hasAnyRole(allowedRoles)) {
    // User is logged in but doesn't have the required role
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Check if email verification is required
  if (requireVerification && user && !user.is_verified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  // Render child routes
  return children ? <>{children}</> : <Outlet />;
};

export default RequireAuth;
