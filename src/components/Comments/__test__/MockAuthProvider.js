import React from 'react';
import { AuthContext, AuthProvider } from '../../../util/AuthContext';

// Mock user data
const mockUser = {
  _id: '1',
  channelName: 'Test User',
  email: 'test@example.com',
  photoUrl: 'https://example.com/photo.jpg',
  role: 'user',
  subscribers: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
};

export const MockAuthProvider = ({ children }) => (
  <AuthProvider value={{ user: mockUser, isAuthenticated: true }}>
    {children}
  </AuthProvider>
);
