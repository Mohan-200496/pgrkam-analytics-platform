import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './app/store';
import theme from './theme';
import MainLayout from './components/layout/MainLayout';
import RequireAuth from './components/auth/RequireAuth';
import type { UserRole } from './features/auth/authSlice';

// Define role constants for better type safety
const ROLES = {
  ADMIN: 'admin' as UserRole,
  VERIFIER: 'verifier' as UserRole,
  USER: 'user' as UserRole,
};

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const UserDashboard = React.lazy(() => import('./pages/dashboard/UserDashboard'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const ProfilePage = React.lazy(() => import('./pages/profile/ProfilePage'));
const EducationPage = React.lazy(() => import('./pages/profile/EducationPage'));
const DocumentsPage = React.lazy(() => import('./pages/documents/DocumentsPage'));
const PageNotFound = React.lazy(() => import('./pages/PageNotFound'));
const UnauthorizedPage = React.lazy(() => import('./pages/UnauthorizedPage'));

// Loading component for suspense fallback
const Loader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <div>Loading...</div>
  </div>
);

// Wrapper component to handle layout and authentication
interface LayoutWrapperProps {
  children: React.ReactNode;
  noLayout?: boolean;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children, noLayout = false }) => {
  if (noLayout) {
    return <>{children}</>;
  }
  return (
    <MainLayout>
      <Box sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </MainLayout>
  );
};

// Public routes that don't require authentication
const publicRoutes = [
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  { path: '/404', element: <PageNotFound /> },
];

// Protected routes with role-based access
const protectedRoutes = [
  { 
    path: '/dashboard', 
    element: <UserDashboard />,
    roles: [ROLES.USER, ROLES.VERIFIER, ROLES.ADMIN]
  },
  { 
    path: '/admin/*', 
    element: <AdminDashboard />,
    roles: [ROLES.ADMIN]
  },
  { 
    path: '/profile', 
    element: <ProfilePage />,
    roles: [ROLES.USER, ROLES.VERIFIER, ROLES.ADMIN]
  },
  { 
    path: '/documents/*', 
    element: <DocumentsPage />,
    roles: [ROLES.USER, ROLES.VERIFIER, ROLES.ADMIN]
  },
  { 
    path: '/education', 
    element: <EducationPage />,
    roles: [ROLES.USER, ROLES.VERIFIER, ROLES.ADMIN]
  },
  {
    path: '/settings',
    element: <Navigate to="/settings/profile" replace />,
    roles: [ROLES.USER, ROLES.VERIFIER, ROLES.ADMIN]
  },
  {
    path: '/settings/*',
    element: <ProfilePage />,
    roles: [ROLES.USER, ROLES.VERIFIER, ROLES.ADMIN]
  },
  { 
    path: '/verifier/documents', 
    element: <div>Document Review</div>,
    roles: [ROLES.VERIFIER, ROLES.ADMIN]
  },
];

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public routes */}
            {publicRoutes.map((route) => (
              <Route 
                key={route.path} 
                path={route.path} 
                element={
                  <LayoutWrapper noLayout={['/login', '/register'].includes(route.path)}>
                    {route.element}
                  </LayoutWrapper>
                } 
              />
            ))}
            
            {/* Protected routes */}
            {protectedRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <RequireAuth allowedRoles={route.roles}>
                    <LayoutWrapper>
                      {route.element}
                    </LayoutWrapper>
                  </RequireAuth>
                }
              />
            ))}
            
            {/* Catch all unmatched routes */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
