import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import { Box, Container, Typography, Paper, Tabs, Tab, Grid, Card, CardContent, Chip, Button, CircularProgress } from '@mui/material';
import { People as PeopleIcon, Description as DocumentIcon, BarChart as AnalyticsIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Types
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'primary' }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography color="textSecondary" gutterBottom>{title}</Typography>
          <Typography variant="h4">{value}</Typography>
        </div>
        <Box sx={{ bgcolor: `${color}.light`, p: 1, borderRadius: '50%' }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingDocuments: 0,
    totalDocuments: 0,
  });
  
  const navigate = useNavigate();
  
  // Load stats
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setStats({
        totalUsers: 1245,
        activeUsers: 987,
        pendingDocuments: 42,
        totalDocuments: 3241,
      });
      
      setIsLoading(false);
    };
    
    fetchStats();
  }, []);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Users" 
            value={isLoading ? '...' : stats.totalUsers} 
            icon={<PeopleIcon color="primary" />} 
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Active Users" 
            value={isLoading ? '...' : stats.activeUsers} 
            icon={<PeopleIcon color="success" />} 
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Pending Documents" 
            value={isLoading ? '...' : stats.pendingDocuments} 
            icon={<DescriptionIcon color="warning" />} 
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Documents" 
            value={isLoading ? '...' : stats.totalDocuments} 
            icon={<DescriptionIcon color="info" />} 
            color="info"
          />
        </Grid>
      </Grid>
      
      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Users" />
          <Tab label="Documents" />
          <Tab label="Analytics" />
        </Tabs>
      </Paper>
      
      {/* Tab Content */}
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Users Management</Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/admin/users')}
            >
              Manage Users
            </Button>
          </Paper>
        )}
        
        {activeTab === 1 && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Document Verification</Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/admin/documents')}
            >
              Review Documents
            </Button>
          </Paper>
        )}
        
        {activeTab === 2 && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Analytics Dashboard</Typography>
            <Typography color="textSecondary">Coming soon...</Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default AdminDashboardPage;
