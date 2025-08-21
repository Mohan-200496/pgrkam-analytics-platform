import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UsersPage from '../UsersPage';
import authReducer from '../../../features/auth/authSlice';

// Mock the API calls
jest.mock('../../../services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Mock the react-router-dom useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    pathname: '/admin/users',
  }),
}));

// Mock data
const mockUsers = [
  {
    id: '1',
    full_name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    last_login: '2023-07-20T10:30:00Z',
    created_at: '2023-01-01T00:00:00Z',
    documents_count: 10,
  },
  {
    id: '2',
    full_name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    status: 'active',
    last_login: '2023-07-19T15:45:00Z',
    created_at: '2023-02-15T00:00:00Z',
    documents_count: 5,
  },
];

// Helper function to render the component with the required providers
const renderWithProviders = (store: any) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/admin/users']}>
        <Routes>
          <Route path="/admin/users" element={<UsersPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('UsersPage Component', () => {
  let store: any;

  beforeEach(() => {
    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          user: {
            id: '1',
            email: 'admin@example.com',
            role: 'admin',
            name: 'Admin User',
          },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      },
    });

    // Reset all mocks
    jest.clearAllMocks();
  });

  test('renders users table with data', async () => {
    // Mock the API response
    require('../../../services/api').get.mockResolvedValueOnce({ data: { users: mockUsers, total: 2 } });
    
    renderWithProviders(store);

    // Check if the table headers are rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Last Login')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // Wait for the data to be loaded
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
      expect(screen.getByText('Regular User')).toBeInTheDocument();
      expect(screen.getByText('user@example.com')).toBeInTheDocument();
    });
  });

  test('handles search functionality', async () => {
    // Mock the API response
    const mockApi = require('../../../services/api');
    mockApi.get.mockResolvedValueOnce({ data: { users: mockUsers, total: 2 } });
    
    renderWithProviders(store);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    // Simulate search input
    const searchInput = screen.getByPlaceholderText('Search users...');
    fireEvent.change(searchInput, { target: { value: 'Admin' } });
    
    // Verify the search was triggered
    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith(
        expect.stringContaining('search=Admin'),
        expect.any(Object)
      );
    });
  });

  test('handles pagination', async () => {
    // Mock the API response
    const mockApi = require('../../../services/api');
    mockApi.get.mockResolvedValueOnce({ data: { users: mockUsers, total: 2 } });
    
    renderWithProviders(store);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    // Simulate changing rows per page
    const rowsPerPageSelect = screen.getByRole('combobox', { name: /rows per page/i });
    fireEvent.mouseDown(rowsPerPageSelect);
    const option = screen.getByRole('option', { name: /25/i });
    fireEvent.click(option);

    // Verify the pagination change was handled
    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith(
        expect.stringContaining('limit=25'),
        expect.any(Object)
      );
    });
  });

  test('handles user deletion', async () => {
    // Mock the API responses
    const mockApi = require('../../../services/api');
    mockApi.get.mockResolvedValueOnce({ data: { users: mockUsers, total: 2 } });
    mockApi.delete.mockResolvedValueOnce({ data: { success: true } });
    
    renderWithProviders(store);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Regular User')).toBeInTheDocument();
    });

    // Find and click the delete button for the second user
    const moreButtons = screen.getAllByRole('button', { name: /more/i });
    fireEvent.click(moreButtons[1]); // Click the second "more" button
    
    // Click the delete option
    const deleteOption = screen.getByRole('menuitem', { name: /delete/i });
    fireEvent.click(deleteOption);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(confirmButton);

    // Verify the delete was called
    await waitFor(() => {
      expect(mockApi.delete).toHaveBeenCalledWith(
        expect.stringContaining('/users/2'),
        expect.any(Object)
      );
    });
  });
});
