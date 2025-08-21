import React from 'react';
import { Box, Button, Container, Typography, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const HomePage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h1" gutterBottom>
                Welcome to PGRKAM Analytics Platform
              </Typography>
              <Typography variant="h6" component="p" paragraph>
                Empowering the Punjab Government with data-driven insights and analytics for better governance and decision-making.
              </Typography>
              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  color="secondary"
                  size="large"
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="outlined"
                  color="inherit"
                  size="large"
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  Register
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/hero-illustration.svg"
                alt="Analytics Dashboard"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: 600,
                  display: { xs: 'none', md: 'block' },
                  ml: 'auto',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Key Features
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" align="center" paragraph>
          Discover how our platform can help you manage and analyze government data efficiently
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {[
            {
              title: 'Data Analytics',
              description: 'Powerful analytics tools to process and visualize government data for better insights.',
              icon: '📊',
            },
            {
              title: 'Document Management',
              description: 'Secure and efficient document handling with automated verification processes.',
              icon: '📄',
            },
            {
              title: 'User Management',
              description: 'Comprehensive user management system with role-based access control.',
              icon: '👥',
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box
                  sx={{
                    fontSize: '3rem',
                    mb: 2,
                    lineHeight: 1,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          py: 6,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Ready to get started?
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Join thousands of government officials already using our platform to make data-driven decisions.
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Create an Account
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
