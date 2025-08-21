import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Container, Grid, Paper, Typography } from '@mui/material';
import { People, Description, CheckCircle, Pending, Error as RejectedIcon } from '@mui/icons-material';
import { API_BASE_URL } from '../../config';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState([
    { title: 'Total Users', value: '—', icon: <People />, color: 'primary' },
    { title: 'Pending Documents', value: '—', icon: <Pending />, color: 'warning' },
    { title: 'Employed', value: '—', icon: <CheckCircle />, color: 'success' },
    { title: 'Unemployed', value: '—', icon: <RejectedIcon />, color: 'error' },
  ]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/analytics/summary`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        });
        if (res.ok) {
          const data = await res.json();
          setStats([
            { title: 'Total Users', value: String(data.total_users ?? '—'), icon: <People />, color: 'primary' },
            { title: 'Pending Documents', value: '—', icon: <Pending />, color: 'warning' },
            { title: 'Employed', value: String(data.employed ?? '—'), icon: <CheckCircle />, color: 'success' },
            { title: 'Unemployed', value: String(data.unemployed ?? '—'), icon: <RejectedIcon />, color: 'error' },
          ]);
        }
      } catch (e) {
        // ignore for now
      }
    })();
  }, []);

  const quickActions = [
    { title: 'Manage Users', icon: <People />, path: '/admin/users' },
    { title: 'Document Review', icon: <Description />, path: '/admin/documents' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      </Box>

      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <div>
                    <Typography color="textSecondary" variant="body2">{stat.title}</Typography>
                    <Typography variant="h5">{stat.value}</Typography>
                  </div>
                  <Box sx={{ color: `${stat.color}.main` }}>
                    {React.cloneElement(stat.icon, { fontSize: 'large' })}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" gutterBottom>Quick Actions</Typography>
      <Grid container spacing={3}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper 
              elevation={2} 
              sx={{ p: 3, cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
              onClick={() => navigate(action.path)}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Box sx={{ color: 'primary.main' }}>{action.icon}</Box>
                <Typography variant="h6">{action.title}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
