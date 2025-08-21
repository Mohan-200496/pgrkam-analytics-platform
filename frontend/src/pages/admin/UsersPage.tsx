import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, Button, IconButton,
  Chip, Avatar, TextField, InputAdornment, Menu, MenuItem, Dialog,
  DialogTitle, DialogContent, DialogActions, DialogContentText, Tooltip,
  FormControl, InputLabel, Select, FormHelperText, Snackbar, Alert
} from '@mui/material';
import {
  Add as AddIcon, Search as SearchIcon, MoreVert as MoreVertIcon,
  Edit as EditIcon, Delete as DeleteIcon, PersonAdd as PersonAddIcon,
  Block as BlockIcon, CheckCircle as CheckCircleIcon, Refresh as RefreshIcon
} from '@mui/icons-material';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'verifier' | 'user';
  status: 'active' | 'inactive' | 'pending';
  last_login: string;
  created_at: string;
  documents_count: number;
}

const UsersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // Load users
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockUsers: User[] = [
        {
          id: '1',
          full_name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          last_login: new Date().toISOString(),
          created_at: '2023-01-15T10:00:00Z',
          documents_count: 5,
        },
        {
          id: '2',
          full_name: 'Verifier User',
          email: 'verifier@example.com',
          role: 'verifier',
          status: 'active',
          last_login: new Date(Date.now() - 86400000).toISOString(),
          created_at: '2023-02-20T14:30:00Z',
          documents_count: 3,
        },
        {
          id: '3',
          full_name: 'Regular User',
          email: 'user@example.com',
          role: 'user',
          status: 'active',
          last_login: new Date(Date.now() - 172800000).toISOString(),
          created_at: '2023-03-10T09:15:00Z',
          documents_count: 2,
        },
        {
          id: '4',
          full_name: 'Inactive User',
          email: 'inactive@example.com',
          role: 'user',
          status: 'inactive',
          last_login: new Date(Date.now() - 2592000000).toISOString(),
          created_at: '2023-03-05T11:45:00Z',
          documents_count: 0,
        },
        {
          id: '5',
          full_name: 'Pending User',
          email: 'pending@example.com',
          role: 'user',
          status: 'pending',
          last_login: null as any,
          created_at: new Date().toISOString(),
          documents_count: 0,
        },
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      showSnackbar('Failed to load users', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };
  
  // Handle edit user
  const handleEditUser = (user: User) => {
    setEditingUser({ ...user });
    setIsEditing(true);
    handleMenuClose();
  };
  
  // Handle delete user
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };
  
  // Confirm delete user
  const confirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUsers(users.filter(u => u.id !== selectedUser.id));
      showSnackbar('User deleted successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to delete user', 'error');
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };
  
  // Handle status change
  const handleStatusChange = (status: 'active' | 'inactive' | 'pending') => {
    if (!selectedUser) return;
    
    // In a real app, this would be an API call
    setUsers(users.map(u => 
      u.id === selectedUser.id ? { ...u, status } : u
    ));
    
    showSnackbar(`User status updated to ${status}`, 'success');
    setSelectedUser(null);
    setIsStatusDialogOpen(false);
  };
  
  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get paginated users
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  // Show snackbar
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  // Get status chip
  const getStatusChip = (status: string) => {
    const statusConfig: Record<string, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
      active: { label: 'Active', color: 'success' },
      inactive: { label: 'Inactive', color: 'default' },
      pending: { label: 'Pending', color: 'warning' },
    };
    
    const config = statusConfig[status] || { label: status, color: 'default' };
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };
  
  // Get role chip
  const getRoleChip = (role: string) => {
    const roleConfig: Record<string, { label: string; color: 'default' | 'primary' | 'secondary' }> = {
      admin: { label: 'Admin', color: 'primary' },
      verifier: { label: 'Verifier', color: 'secondary' },
      user: { label: 'User', color: 'default' },
    };
    
    const config = roleConfig[role] || { label: role, color: 'default' };
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        variant="outlined"
      />
    );
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">User Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={() => navigate('/admin/users/new')}
        >
          Add User
        </Button>
      </Box>
      
      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchUsers}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </Box>
      </Paper>
      
      {/* Users Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Documents</TableCell>
                <TableCell>Joined On</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>Loading users...</Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1">No users found</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Try adjusting your search or filter criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                          {user.full_name.charAt(0)}
                        </Avatar>
                        {user.full_name}
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleChip(user.role)}</TableCell>
                    <TableCell>{getStatusChip(user.status)}</TableCell>
                    <TableCell>{formatDate(user.last_login)}</TableCell>
                    <TableCell>{user.documents_count}</TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, user)}
                        disabled={user.id === '1'} // Disable for current admin
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* User Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
      >
        <MenuItem onClick={() => selectedUser && handleEditUser(selectedUser)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit User
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedUser) {
            setSelectedUser(selectedUser);
            setIsStatusDialogOpen(true);
          }
        }}>
          <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
          Change Status
        </MenuItem>
        <MenuItem 
          onClick={() => selectedUser && handleDeleteClick(selectedUser)}
          disabled={selectedUser?.id === '1'} // Prevent deleting the main admin
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete User
        </MenuItem>
      </Menu>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedUser?.full_name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Status Change Dialog */}
      <Dialog
        open={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
      >
        <DialogTitle>Change User Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={selectedUser?.status || ''}
              label="Status"
              onChange={(e) => selectedUser && handleStatusChange(e.target.value as any)}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsStatusDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UsersPage;
