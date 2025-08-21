import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Avatar, 
  Menu, 
  MenuItem, 
  IconButton, 
  Divider, 
  Box, 
  ListItemIcon 
} from '@mui/material';
import { Menu as MenuIcon, AccountCircle, Settings, ExitToApp } from '@mui/icons-material';
import LogoutButton from '../auth/LogoutButton';

interface UserMenuProps {
  onMenuToggle: () => void;
  position?: 'fixed' | 'absolute' | 'relative' | 'static' | 'sticky';
  sx?: object;
}

const UserMenu: React.FC<UserMenuProps> = ({ onMenuToggle, position, sx = {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    handleClose();
    navigate('/settings');
  };

  if (!user) {
    return (
      <AppBar position={position || 'static'} color="transparent" elevation={0} sx={sx}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/register')}
            sx={{ ml: 2 }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position={position || 'static'} color="transparent" elevation={0} sx={sx}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mr: 2, display: { xs: 'none', md: 'block' } }}>
            {user.full_name || user.email}
          </Typography>
          
          <IconButton
            onClick={handleMenu}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              alt={user.full_name || user.email || 'User'}
              src={user.avatar_url || undefined}
              sx={{ width: 40, height: 40 }}
            >
              {(user.full_name || user.email)?.[0]?.toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileClick}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleSettingsClick}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <LogoutButton menuItem />
      </Menu>
    </AppBar>
  );
};

export default UserMenu;
