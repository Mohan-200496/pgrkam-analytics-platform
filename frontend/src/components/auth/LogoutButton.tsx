import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../features/auth/authSlice';
import { Button, Menu, MenuItem, ListItemIcon, Typography } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';

interface LogoutButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  menuItem?: boolean;
  onClick?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  menuItem = false,
  onClick,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (onClick) {
      onClick();
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      // Clear any remaining state if needed
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate to login even if there was an error
      navigate('/login', { replace: true });
    } finally {
      handleClose();
    }
  };

  if (menuItem) {
    return (
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2">Logout</Typography>
      </MenuItem>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        onClick={handleClick}
        startIcon={<LogoutIcon />}
        color="inherit"
        sx={{
          textTransform: 'none',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        Logout
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Confirm Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default LogoutButton;
