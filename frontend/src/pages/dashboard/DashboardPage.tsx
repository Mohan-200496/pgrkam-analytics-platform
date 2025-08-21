import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person as PersonIcon,
  Description as DocumentIcon,
  School as EducationIcon,
  Work as JobIcon,
  Notifications as NotificationIcon,
  TrendingUp as AnalyticsIcon,
} from '@mui/icons-material';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { API_BASE_URL } from '../../config';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  
  // Sample data - replace with actual API calls
  const [stats, setStats] = useState({
    profileCompletion: 65,
    documentsUploaded: 2,
    pendingVerification: 1,
    recommendedJobs: 5,
  });
  
  // Sample chart data
  const [activityData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Profile Views',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Job Applications',
        data: [8, 15, 7, 12, 6, 10],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  });
  
  const [skillData] = useState({
    labels: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'UI/UX'],
    datasets: [
      {
        data: [85, 78, 90, 75, 70, 65],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });
  const [recs, setRecs] = useState<any[]>([]);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/recommendations/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        });
        if (res.ok) {
          const data = await res.json();
          setRecs(data);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }
  
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }} component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.full_name?.split(' ')[0] || 'User'}!
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3} component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Profile Completion
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.profileCompletion}%
                  </Typography>
                </div>
                <Box
                  sx={{
                    backgroundColor: 'primary.light',
                    borderRadius: '50%',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PersonIcon sx={{ color: 'white' }} />
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate('/profile')}
                  fullWidth
                >
                  Complete Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3} component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Documents
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.documentsUploaded}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {stats.pendingVerification} pending
                  </Typography>
                </div>
                <Box
                  sx={{
                    backgroundColor: 'secondary.light',
                    borderRadius: '50%',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DocumentIcon sx={{ color: 'white' }} />
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate('/documents')}
                  fullWidth
                >
                  View Documents
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3} component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Recommended Jobs
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.recommendedJobs}
                  </Typography>
                </div>
                <Box
                  sx={{
                    backgroundColor: 'success.light',
                    borderRadius: '50%',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <WorkIcon sx={{ color: 'white' }} />
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  fullWidth
                >
                  View Jobs
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3} component={motion.div} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Notifications
                  </Typography>
                  <Typography variant="h4" component="div">
                    3
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    2 unread
                  </Typography>
                </div>
                <Box
                  sx={{
                    backgroundColor: 'warning.light',
                    borderRadius: '50%',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <NotificationIcon sx={{ color: 'white' }} />
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  fullWidth
                >
                  View Notifications
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recommendations */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recommended for you
            </Typography>
            {recs.length === 0 ? (
              <Typography color="textSecondary">No recommendations yet.</Typography>
            ) : (
              <Grid container spacing={2}>
                {recs.map((r) => (
                  <Grid item xs={12} md={6} lg={4} key={r.id}>
                    <Card elevation={2}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {r.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }} noWrap>
                          {r.description}
                        </Typography>
                        <Button size="small" variant="outlined" href={r.url} target="_blank" rel="noopener noreferrer">
                          Open Link
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Activity Overview
            </Typography>
            <div style={{ height: '300px' }}>
              <Line
                data={activityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: true,
                      text: 'Monthly Activity',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Skills Assessment
            </Typography>
            <div style={{ height: '300px' }}>
              <Pie
                data={skillData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    title: {
                      display: true,
                      text: 'Your Skills',
                    },
                  },
                }}
              />
            </div>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<PersonIcon />}
                  onClick={() => navigate('/profile')}
                  sx={{ justifyContent: 'flex-start', p: 2, height: '100%' }}
                >
                  Update Profile
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<DocumentIcon />}
                  onClick={() => navigate('/documents')}
                  sx={{ justifyContent: 'flex-start', p: 2, height: '100%' }}
                >
                  Upload Documents
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<EducationIcon />}
                  onClick={() => navigate('/education')}
                  sx={{ justifyContent: 'flex-start', p: 2, height: '100%' }}
                >
                  Add Education
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<AnalyticsIcon />}
                  onClick={() => navigate('/analytics')}
                  sx={{ justifyContent: 'flex-start', p: 2, height: '100%' }}
                >
                  View Analytics
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Box>
              {[1, 2, 3].map((item) => (
                <Box key={item} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                  <Typography variant="subtitle2">
                    {item === 1 && 'Your profile is 65% complete'}
                    {item === 2 && '1 document pending verification'}
                    {item === 3 && 'New job recommendations available'}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {item} day{item !== 1 ? 's' : ''} ago
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
