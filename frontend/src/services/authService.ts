import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/auth`;

// Set auth token for requests
const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Check if token exists and set it in the headers
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

const login = async (email: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await axios.post(`${API_URL}/login/access-token`, formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  
  if (response.data.access_token) {
    setAuthToken(response.data.access_token);
    const user = response.data.user || (await axios.get(`${API_BASE_URL}/users/me`)).data;
    
    return {
      data: {
        access_token: response.data.access_token,
        user,
      },
    };
  }
  
  return response;
};

const loginWithGoogle = async (idToken: string) => {
  const response = await axios.post(`${API_URL}/google`, { id_token: idToken });
  if (response.data.access_token) {
    setAuthToken(response.data.access_token);
  }
  return response;
};

const register = async (userData: {
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
}) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response;
};

/**
 * Logout the current user
 * This function is now handled by the Redux thunk in authSlice
 * @deprecated Use the logout action from authSlice instead
 */
const logout = async (): Promise<void> => {
  try {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear auth header
    setAuthToken(null);
    
    // Optional: Call the backend logout endpoint if needed
    // await axios.post(`${API_URL}/logout`);
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

const getCurrentUser = async () => {
  const response = await axios.get(`${API_BASE_URL}/users/me`);
  return response.data;
};

const updateProfile = async (userData: any) => {
  const response = await axios.put(`${API_BASE_URL}/users/me`, userData);
  return response.data;
};

const changePassword = async (currentPassword: string, newPassword: string) => {
  const response = await axios.post(`${API_URL}/password/change`, {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return response.data;
};

const requestPasswordReset = async (email: string) => {
  const response = await axios.post(`${API_URL}/password-recovery/${email}`);
  return response.data;
};

const resetPassword = async (token: string, newPassword: string) => {
  const response = await axios.post(`${API_URL}/reset-password/`, {
    token,
    new_password: newPassword,
  });
  return response.data;
};

const verifyEmail = async (token: string) => {
  const response = await axios.post(`${API_URL}/verify-email/${token}`);
  return response.data;
};

export default {
  login,
  loginWithGoogle,
  register,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  setAuthToken,
};
