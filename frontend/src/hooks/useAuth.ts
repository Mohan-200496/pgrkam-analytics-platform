import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { UserRole } from '../features/auth/authSlice';

/**
 * Custom hook to access auth state and related functions
 * @returns Auth state and utility functions
 */
export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const error = useSelector((state: RootState) => state.auth.error);

  /**
   * Check if the current user has a specific role
   * @param role - The role to check
   * @returns boolean indicating if the user has the role
   */
  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has all roles
    return user.role === role;
  };

  /**
   * Check if the current user has any of the specified roles
   * @param roles - Array of roles to check against
   * @returns boolean indicating if the user has any of the roles
   */
  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has all roles
    return roles.includes(user.role);
  };

  /**
   * Check if the current user has a specific permission
   * @param permission - The permission to check
   * @returns boolean indicating if the user has the permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has all permissions
    return user.permissions?.includes(permission) || false;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    hasRole,
    hasAnyRole,
    hasPermission,
  };
};

export default useAuth;
