import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import authService from '../../services/authService';

export type UserRole = 'admin' | 'verifier' | 'user';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_verified: boolean;
  permissions?: string[];
}

interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  token_type: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Get token from localStorage if it exists
const token = localStorage.getItem('token');
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;

const initialState: AuthState = {
  user: user,
  token: token,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Login failed');
    }
  }
);

// Logout thunk that uses the authService
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // This will handle clearing local storage and auth headers
      await authService.logout();
      return true;
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if there's an error, we still want to clear the auth state
      authService.logout().catch(console.error);
      return rejectWithValue(error.response?.data?.detail || 'Logout failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; full_name: string; phone_number: string }, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set auth header
      if (token) {
        authService.setAuthToken(token);
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear auth header
      authService.setAuthToken(null);
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<{ access_token: string; user: User }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.access_token;
      state.user = action.payload.user;
      
      // Store token and user in localStorage
      localStorage.setItem('token', action.payload.access_token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload as string;
    });
    
    // Logout
    builder.addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      
      // Clear from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.isLoading = false;
      // Even if there was an error, we still want to clear the auth state
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload as string;
      
      // Clear from localStorage on error too
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      // Note: User is not logged in after registration, only after email verification
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });
  },
});

// Export actions
export const { resetError, setCredentials, clearAuth } = authSlice.actions;

// Helper selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectError = (state: RootState) => state.auth.error;

export const selectHasRole = (state: RootState, role: UserRole): boolean => {
  if (!state.auth.user) return false;
  if (state.auth.user.role === 'admin') return true; // Admin has all roles
  return state.auth.user.role === role;
};

export const selectHasAnyRole = (state: RootState, roles: UserRole[]): boolean => {
  if (!state.auth.user) return false;
  if (state.auth.user.role === 'admin') return true;
  return roles.includes(state.auth.user.role);
};

export const selectHasPermission = (state: RootState, permission: string): boolean => {
  if (!state.auth.user) return false;
  if (state.auth.user.role === 'admin') return true; // Admin has all permissions
  return state.auth.user.permissions?.includes(permission) || false;
};

export default authSlice.reducer;
