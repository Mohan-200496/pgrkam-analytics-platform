import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DRAWER_WIDTH } from './MainLayout';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Box,
  Typography,
  Collapse,
  Tooltip,
  IconButton,
  styled,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Description as DocumentsIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  VerifiedUser as VerifierIcon,
  AdminPanelSettings as AdminIcon,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { selectHasRole } from '../../features/auth/authSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

// Styled components
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 240,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    borderRight: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.paper,
  },
  '&.collapsed': {
    width: 72,
    '& .MuiDrawer-paper': {
      width: 72,
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1.5),
  padding: theme.spacing(1, 1.5),
  '&.Mui-selected': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledListItemIcon = styled(ListItemIcon)({
  minWidth: 40,
});

interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  onClose,
  collapsed,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = useSelector((state: RootState) => selectHasRole(state, 'admin'));
  const isVerifier = useSelector((state: RootState) => selectHasRole(state, 'verifier'));
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const menuItems: MenuItem[] = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Home', path: '/', icon: <HomeIcon /> },
  ];

  const adminMenuItems: MenuItem[] = [
    {
      text: 'User Management',
      path: '/admin/users',
      icon: <PeopleIcon />,
      children: [
        { text: 'All Users', path: '/admin/users', icon: <PeopleIcon /> },
        { text: 'Add User', path: '/admin/users/add', icon: <PeopleIcon /> },
      ],
    },
    {
      text: 'Documents',
      path: '/admin/documents',
      icon: <DocumentsIcon />,
      children: [
        { text: 'All Documents', path: '/admin/documents', icon: <DocumentsIcon /> },
        { text: 'Categories', path: '/admin/documents/categories', icon: <DocumentsIcon /> },
      ],
    },
  ];

  const verifierMenuItems: MenuItem[] = [
    {
      text: 'Verify Documents',
      path: '/verifier/documents',
      icon: <VerifierIcon />,
      children: [
        { text: 'Pending', path: '/verifier/documents/pending', icon: <VerifierIcon /> },
        { text: 'Verified', path: '/verifier/documents/verified', icon: <VerifierIcon /> },
      ],
    },
  ];

  const settingsItems: MenuItem[] = [
    {
      text: 'Settings',
      path: '/settings',
      icon: <SettingsIcon />,
      children: [
        { text: 'Profile', path: '/settings/profile', icon: <SettingsIcon /> },
        { text: 'Account', path: '/settings/account', icon: <SettingsIcon /> },
      ],
    },
  ];

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const renderMenuItems = (items: MenuItem[], level = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isItemActive = isActive(item.path);
      const isMenuOpen = openMenus[item.text] ?? isItemActive;

      return (
        <React.Fragment key={item.path}>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <Tooltip title={collapsed ? item.text : ''} placement="right">
              <StyledListItemButton
                selected={isItemActive}
                onClick={() => {
                  if (hasChildren) {
                    toggleMenu(item.text);
                  } else {
                    navigate(item.path);
                    onClose();
                  }
                }}
                sx={{
                  pl: collapsed ? 2 : level > 0 ? 4 : 2,
                  py: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <StyledListItemIcon>{item.icon}</StyledListItemIcon>
                  {!collapsed && (
                    <>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: isItemActive ? '600' : '400',
                        }}
                      />
                      {hasChildren && (
                        <Box sx={{ ml: 'auto' }}>
                          {isMenuOpen ? <ExpandLess /> : <ExpandMore />}
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </StyledListItemButton>
            </Tooltip>
          </ListItem>
          
          {hasChildren && !collapsed && (
            <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderMenuItems(item.children || [], level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box>
        <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
          {!collapsed && (
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
              PGRKAM
            </Typography>
          )}
          <IconButton onClick={onToggleCollapse} size="small">
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Toolbar>
        <Divider />
        
        <List sx={{ py: 1 }}>
          {renderMenuItems(menuItems)}
        </List>
        
        {(isAdmin || isVerifier) && (
          <>
            <Divider sx={{ my: 1 }} />
            {!collapsed && (
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="overline" color="text.secondary">
                  {isAdmin ? 'Admin' : 'Verifier'} Tools
                </Typography>
              </Box>
            )}
            <List sx={{ py: 1 }}>
              {isAdmin && renderMenuItems(adminMenuItems)}
              {isVerifier && renderMenuItems(verifierMenuItems)}
            </List>
          </>
        )}
      </Box>
      
      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ my: 1 }} />
        <List sx={{ py: 1 }}>
          {renderMenuItems(settingsItems)}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: DRAWER_WIDTH },
        flexShrink: { sm: 0 },
      }}
      aria-label="mailbox folders"
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
