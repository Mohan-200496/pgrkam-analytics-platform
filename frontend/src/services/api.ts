import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../app/store';
import { API_BASE_URL } from '../config';

// Create base query with auth header
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get token from the state
    const token = (getState() as RootState).auth.token || localStorage.getItem('token');
    
    // If we have a token, set the authorization header
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    // Set content type
    headers.set('Content-Type', 'application/json');
    
    return headers;
  },
});

// Create base API
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    
    // Handle 401 Unauthorized responses
    if (result.error?.status === 401) {
      // TODO: Handle token refresh logic here if needed
      // For now, just log out the user
      // api.dispatch(logout());
      // window.location.href = '/login';
    }
    
    return result;
  },
  tagTypes: [
    'User',
    'Document',
    'Resource',
    'Recommendation',
    'Analytics'
  ],
  endpoints: () => ({}),
});

export default apiSlice;

// Simple axios-lite helpers using fetchBaseQuery under the hood
export const uploadDocument = async (file: File) => {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
    body: form,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
};

export const listMyDocuments = async () => {
  const res = await fetch(`${API_BASE_URL}/documents/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
  });
  if (!res.ok) throw new Error('List documents failed');
  return res.json();
};

export const getMyEducation = async () => {
  const res = await fetch(`${API_BASE_URL}/users/me/education`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
  });
  if (!res.ok) throw new Error('Get education failed');
  return res.json();
};

export const updateMyEducation = async (payload: any) => {
  const res = await fetch(`${API_BASE_URL}/users/me/education`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Update education failed');
  return res.json();
};
