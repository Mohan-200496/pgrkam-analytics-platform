import React, { useState, useEffect } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box, Container, Grid, Paper, Typography, Card, CardContent, Divider,
  Tabs, Tab, IconButton, Tooltip, Button, Avatar, LinearProgress, Chip
} from '@mui/material';
import {
  People as PeopleIcon, Description as DocumentIcon, CheckCircle as CheckCircleIcon,
  Pending as PendingIcon, Error as ErrorIcon, Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon, Download as DownloadIcon, FilterList as FilterIcon,
  CalendarToday as CalendarIcon, ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon, Equalizer as EqualizerIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Mock data - in a real app, this would come from an API
const monthlyData = [
  { name: 'Jan', users: 400, documents: 240, verified: 180 },
  { name: 'Feb', users: 600, documents: 380, verified: 280 },
  { name: 'Mar', users: 800, documents: 500, verified: 420 },
  { name: 'Apr', users: 1000, documents: 650, verified: 580 },
  { name: 'May', users: 1200, documents: 850, verified: 720 },
  { name: 'Jun', users: 1500, documents: 1100, verified: 950 },
  { name: 'Jul', users: 1800, documents: 1350, verified: 1200 },
  { name: 'Aug', users: 2100, documents: 1600, verified: 1450 },
];

const documentTypes = [
  { name: 'Aadhaar', value: 35 },
  { name: 'PAN', value: 25 },
  { name: 'Passport', value: 15 },
  { name: 'Driving License', value: 15 },
  { name: 'Others', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const recentActivities = [
  { id: 1, user: 'John Doe', action: 'uploaded a new document', time: '2 minutes ago', type: 'upload' },
  { id: 2, user: 'Jane Smith', action: 'verified a document', time: '10 minutes ago', type: 'verify' },
  { id: 3, user: 'Admin User', action: 'rejected a document', time: '25 minutes ago', type: 'reject' },
  { id: 4, user: 'Bob Johnson', action: 'updated profile information', time: '1 hour ago', type: 'update' },
  { id: 5, user: 'Alice Williams', action: 'completed document verification', time: '2 hours ago', type: 'complete' },
];

const stats = {
  totalUsers: 2453,
  activeUsers: 1892,
  documentsVerified: 4567,
  pendingVerification: 342,
  verificationRate: 92.5,
  avgVerificationTime: '2.4 hours',
};

const AnalyticsDashboard: React.FC = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderStatCard = (title: string, value: string | number, icon: React.ReactNode, change?: number) => (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <div>
            <Typography color="textSecondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
            {change !== undefined && (
              <Box display="flex" alignItems="center" mt={1}>
                <Chip
                  size="small"
                  icon={change >= 0 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  label={`${Math.abs(change)}% ${change >= 0 ? 'increase' : 'decrease'}`}
                  color={change >= 0 ? 'success' : 'error'}
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.65rem' }}
                />
                <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                  vs last period
                </Typography>
              </Box>
            )}
          </div>
          <Box
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: '12px',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.primary.main,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderMiniChart = (dataKey: string, color: string) => (
    <Box width={120} height={40}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={monthlyData.slice(-5)}>
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={!isLoading}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Analytics Dashboard
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography color="textSecondary" variant="body2">
              Welcome back, Administrator
            </Typography>
            <Chip
              label="Admin"
              color="primary"
              size="small"
              sx={{ ml: 1, height: 20, fontSize: '0.65rem' }}
            />
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon fontSize="small" />}
            sx={{ textTransform: 'none' }}
          >
            Export
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterIcon fontSize="small" />}
            sx={{ textTransform: 'none' }}
          >
            Filters
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<CalendarIcon fontSize="small" />}
            endIcon={<Typography variant="caption" color="textPrimary">This Month</Typography>}
            sx={{ textTransform: 'none' }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={isLoading}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {isLoading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          {renderStatCard('Total Users', stats.totalUsers, <PeopleIcon />, 12.5)}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          {renderStatCard('Active Users', stats.activeUsers, <CheckCircleIcon />, 8.2)}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          {renderStatCard('Documents Verified', stats.documentsVerified, <DocumentIcon />, 15.3)}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          {renderStatCard('Pending Verification', stats.pendingVerification, <PendingIcon />, -3.1)}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          {renderStatCard('Verification Rate', `${stats.verificationRate}%`, <EqualizerIcon />, 2.4)}
        </Grid>
      </Grid>

      {/* Main Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Document Verification Trends</Typography>
              <Tabs
                value={timeRange}
                onChange={(e, value) => setTimeRange(value)}
                textColor="primary"
                indicatorColor="primary"
                sx={{ minHeight: 'auto' }}
              >
                <Tab label="Week" value="week" sx={{ minHeight: 'auto', py: 1, px: 2 }} />
                <Tab label="Month" value="month" sx={{ minHeight: 'auto', py: 1, px: 2 }} />
                <Tab label="Year" value="year" sx={{ minHeight: 'auto', py: 1, px: 2 }} />
              </Tabs>
            </Box>
            <Box height={400}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip />
                  <Bar dataKey="documents" fill="#8884d8" name="Documents Uploaded" />
                  <Bar dataKey="verified" fill="#82ca9d" name="Documents Verified" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Document Types
            </Typography>
            <Box flex={1} minHeight={200}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={documentTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {documentTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box mt={2}>
              {documentTypes.map((item, index) => (
                <Box key={item.name} display="flex" alignItems="center" mb={1}>
                  <Box
                    width={12}
                    height={12}
                    bgcolor={COLORS[index % COLORS.length]}
                    borderRadius={1}
                    mr={1}
                  />
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {item.value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <Box>
              {recentActivities.map((activity) => (
                <Box key={activity.id} display="flex" alignItems="flex-start" mb={2}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      mr: 2,
                      bgcolor: (() => {
                        switch (activity.type) {
                          case 'upload':
                            return theme.palette.primary.light;
                          case 'verify':
                            return theme.palette.success.light;
                          case 'reject':
                            return theme.palette.error.light;
                          case 'update':
                            return theme.palette.warning.light;
                          case 'complete':
                            return theme.palette.info.light;
                          default:
                            return theme.palette.grey[300];
                        }
                      })(),
                      color: (() => {
                        switch (activity.type) {
                          case 'upload':
                            return theme.palette.primary.dark;
                          case 'verify':
                            return theme.palette.success.dark;
                          case 'reject':
                            return theme.palette.error.dark;
                          case 'update':
                            return theme.palette.warning.dark;
                          case 'complete':
                            return theme.palette.info.dark;
                          default:
                            return theme.palette.text.primary;
                        }
                      })(),
                    }}
                  >
                    {activity.user.charAt(0)}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="body2">
                      <strong>{activity.user}</strong> {activity.action}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {activity.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box mt={2} textAlign="right">
              <Button size="small" color="primary">
                View All Activities
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Performance Metrics</Typography>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                sx={{ minHeight: 'auto' }}
              >
                <Tab label="Weekly" sx={{ minHeight: 'auto', py: 0, px: 1, fontSize: '0.75rem' }} />
                <Tab label="Monthly" sx={{ minHeight: 'auto', py: 0, px: 1, fontSize: '0.75rem' }} />
              </Tabs>
            </Box>
            <Box>
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Verification Completion Rate</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {stats.verificationRate}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.verificationRate}
                  color="primary"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Average Verification Time</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {stats.avgVerificationTime}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  color="secondary"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  User Growth
                </Typography>
                {renderMiniChart('users', theme.palette.primary.main)}
              </Box>
              <Box mt={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Document Processing
                </Typography>
                {renderMiniChart('documents', theme.palette.success.main)}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsDashboard;
