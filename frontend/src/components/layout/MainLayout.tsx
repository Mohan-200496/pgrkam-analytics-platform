import React, { useState, ReactNode, useMemo } from 'react';
import { Box, CssBaseline, useTheme, useMediaQuery, styled } from '@mui/material';
import UserMenu from './UserMenu';
import Sidebar from './Sidebar';

export const DRAWER_WIDTH = 240;
export const COLLAPSED_DRAWER_WIDTH = 72;

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const drawerWidth = useMemo(() => {
    return collapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH;
  }, [collapsed]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <UserMenu 
        onMenuToggle={handleDrawerToggle} 
        position={isMobile ? 'relative' : 'fixed'}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(collapsed && !isMobile && {
            width: { sm: `calc(100% - ${COLLAPSED_DRAWER_WIDTH}px)` },
            ml: { sm: `${COLLAPSED_DRAWER_WIDTH}px` },
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      />
      
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { 
            xs: '100%',
            sm: `calc(100% - ${drawerWidth}px)`,
          },
          ml: { sm: `${drawerWidth}px` },
          mt: '64px', // Height of the AppBar
          minHeight: 'calc(100vh - 64px)', // Full height minus header
          display: 'flex',
          flexDirection: 'column',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(collapsed && !isMobile && {
            width: { sm: `calc(100% - ${COLLAPSED_DRAWER_WIDTH}px)` },
            ml: { sm: `${COLLAPSED_DRAWER_WIDTH}px` },
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
