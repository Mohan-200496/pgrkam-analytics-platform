import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import {
  Box, Container, Typography, Paper, Tabs, Tab, Divider, Button,
  TextField, Grid, Avatar, IconButton, InputAdornment, FormControl,
  InputLabel, Select, MenuItem, FormHelperText, CircularProgress,
  Alert, Snackbar, FormControlLabel, Checkbox
} from '@mui/material';
import {
  Person, Email, Phone, LocationOn, School, Work, Edit, Save,
  Cancel, Add, Delete
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Types
interface ProfileData {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  date_of_birth: Date | null;
  gender: string;
  profile_picture: string | null;
}

interface Education {
  id?: number;
  degree: string;
  institution: string;
  field_of_study: string;
  start_date: Date | null;
  end_date: Date | null;
  is_current: boolean;
  description: string;
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });
  
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    state: 'Punjab',
    pincode: '',
    date_of_birth: null,
    gender: 'prefer_not_to_say',
    profile_picture: null,
  });
  
  const [educations, setEducations] = useState<Education[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Load user data
  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || 'Punjab',
        pincode: user.pincode || '',
        date_of_birth: user.date_of_birth ? new Date(user.date_of_birth) : null,
        gender: user.gender || 'prefer_not_to_say',
        profile_picture: user.profile_picture || null,
      });
    }
  }, [user]);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEducationChange = (index: number, field: keyof Education, value: any) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'is_current' && value === true) {
      updated[index].end_date = null;
    }
    setEducations(updated);
  };
  
  const addEducation = () => {
    setEducations([...educations, {
      degree: '',
      institution: '',
      field_of_study: '',
      start_date: null,
      end_date: null,
      is_current: false,
      description: '',
    }]);
  };
  
  const removeEducation = (index: number) => {
    const updated = [...educations];
    updated.splice(index, 1);
    setEducations(updated);
  };
  
  const saveProfile = async () => {
    setIsSubmitting(true);
    try {
      // API call would go here
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      });
      setIsEditing(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderProfileTab = () => (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={profileData.profile_picture || undefined}
              sx={{ width: 150, height: 150, mb: 2, fontSize: '3rem' }}
            >
              {profileData.full_name.split(' ').map(n => n[0]).join('')}
            </Avatar>
            {isEditing && (
              <Button variant="outlined" component="label" startIcon={<Edit />}>
                Upload Photo
                <input type="file" hidden accept="image/*" />
              </Button>
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {[
              { label: 'Full Name', name: 'full_name', icon: <Person /> },
              { label: 'Email', name: 'email', icon: <Email /> },
              { label: 'Phone', name: 'phone_number', icon: <Phone /> },
              { label: 'Address', name: 'address', icon: <LocationOn />, fullWidth: true, multiline: true },
              { label: 'City', name: 'city' },
              { label: 'State', name: 'state' },
              { label: 'Pincode', name: 'pincode' },
            ].map((field) => (
              <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={profileData[field.name as keyof ProfileData] || ''}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  multiline={field.multiline}
                  rows={field.multiline ? 2 : 1}
                  InputProps={{
                    startAdornment: field.icon ? (
                      <InputAdornment position="start">
                        {field.icon}
                      </InputAdornment>
                    ) : undefined,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
  
  const renderEducationTab = () => (
    <Box sx={{ mt: 3 }}>
      {educations.map((edu, index) => (
        <Paper key={index} sx={{ p: 3, mb: 3, position: 'relative' }}>
          {isEditing && (
            <IconButton
              onClick={() => removeEducation(index)}
              color="error"
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <Delete />
            </IconButton>
          )}
          
          <Grid container spacing={2}>
            {[
              { label: 'Degree', name: 'degree', icon: <School /> },
              { label: 'Institution', name: 'institution' },
              { label: 'Field of Study', name: 'field_of_study' },
            ].map((field) => (
              <Grid item xs={12} md={6} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  value={edu[field.name as keyof Education] || ''}
                  onChange={(e) => handleEducationChange(index, field.name as keyof Education, e.target.value)}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: field.icon ? (
                      <InputAdornment position="start">
                        {field.icon}
                      </InputAdornment>
                    ) : undefined,
                  }}
                />
              </Grid>
            ))}
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={edu.is_current}
                    onChange={(e) => handleEducationChange(index, 'is_current', e.target.checked)}
                    disabled={!isEditing}
                  />
                }
                label="I currently study here"
              />
            </Grid>
          </Grid>
        </Paper>
      ))}
      
      {isEditing && (
        <Button variant="outlined" startIcon={<Add />} onClick={addEducation}>
          Add Education
        </Button>
      )}
    </Box>
  );
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Profile</Typography>
        <Box>
          {isEditing ? (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={saveProfile}
                disabled={isSubmitting}
                sx={{ mr: 1 }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Edit />}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </Box>
      </Box>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
        >
          <Tab label="Personal Information" />
          <Tab label="Education" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {activeTab === 0 ? renderProfileTab() : renderEducationTab()}
        </Box>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;
