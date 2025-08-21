import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Container, Grid, Paper, Typography } from '@mui/material';
import { Description, CheckCircle, Pending, Error as RejectedIcon, Person } from '@mui/icons-material';

const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <div>
          <Typography color="textSecondary" variant="body2">{title}</Typography>
          <Typography variant="h5">{value}</Typography>
        </div>
        <Box sx={{ color: `${color}.main` }}>
          {React.cloneElement(icon, { fontSize: 'large' })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const UserDashboard = () => {
  const navigate = useNavigate();
  
  // Mock data
  const stats = {
    documents: { total: 5, verified: 3, pending: 1, rejected: 1 },
    profileCompletion: 75,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>Welcome Back</Typography>
        <Typography color="textSecondary">Here's your dashboard overview</Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Documents" value={stats.documents.total} icon={<Description />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Verified" value={stats.documents.verified} icon={<CheckCircle />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending" value={stats.documents.pending} icon={<Pending />} color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Rejected" value={stats.documents.rejected} icon={<RejectedIcon />} color="error" />
        </Grid>
      </Grid>

      {/* Profile Completion */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Profile Completion</Typography>
          <Typography color="primary" fontWeight="medium">
            {stats.profileCompletion}%
          </Typography>
        </Box>
        <Box width="100%" bgcolor="grey.200" borderRadius={1} overflow="hidden" mb={2}>
          <Box 
            bgcolor="primary.main" 
            width={`${stats.profileCompletion}%`} 
            height={8}
          />
        </Box>
        <Button 
          variant="outlined" 
          color="primary"
          startIcon={<Person />}
          onClick={() => navigate('/profile')}
        >
          Complete Your Profile
        </Button>
      </Paper>
    </Container>
  );
};

export default UserDashboard;
