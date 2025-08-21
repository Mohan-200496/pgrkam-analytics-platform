// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// App Configuration
export const APP_NAME = 'PGRKAM Analytics Platform';
export const APP_DESCRIPTION = 'Analytics platform for PGRKAM - Punjab Government';

// Local Storage Keys
export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';

// Pagination
// Add other configuration constants as needed
export const ITEMS_PER_PAGE = 10;

// Date & Time
// Add date and time formats if needed
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';

// Theme
// Add theme-related constants if needed
export const THEME_COLORS = {
  primary: '#1976d2',
  secondary: '#9c27b0',
  error: '#d32f2f',
  warning: '#ed6c02',
  info: '#0288d1',
  success: '#2e7d32',
};

// Validation
// Add validation messages and patterns
export const VALIDATION = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
};

// Add any other configuration constants as needed
