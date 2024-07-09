import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, BrowserRouter as Router } from 'react-router-dom';
import { AuthContext, AuthProvider, useAuth } from '../../../../util/AuthContext';
import UserProfile from '../UserProfile';
import Navbar from '../../../Navbar/Navbar';

  jest.mock("../../../../util/AuthContext.js", () => ({
    useAuth: jest.fn(),
  }));

describe('UserProfile', () => {

    beforeEach(() => {
        jest.clearAllMocks();
      });

  const mockUser = {
    channelName: 'John Doe',
    email: 'john@example.com',
    photoUrl: 'https://example.com/photo.jpg',
  };

  const mockLogout = jest.fn();

  const renderWithContext = (user) => {
    useAuth.mockReturnValue({ isAuthenticated: true });
    render(
      <Router>
        <AuthProvider value={{ user, logout: mockLogout }}>
          <UserProfile userInitialColor="#123456" />
        </AuthProvider>
      </Router>
    );
  };

  test('should display user information correctly', async() => {
    renderWithContext(mockUser);

    render(
        <MemoryRouter initialEntries={['/']}>
            <Navbar />
        </MemoryRouter>
      );
  
      // Find profile icon and click it
      const profileIcon = screen.getByTestId('profile-icon');
      fireEvent.click(profileIcon);
  
      // Use waitFor to wait for the user profile to be visible
      await waitFor(() => {
        const userProfile = screen.getByText('User Profile');
        expect(userProfile).toBeInTheDocument();
      });

    expect(screen.getByText(mockUser.channelName)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByAltText(mockUser.channelName)).toBeInTheDocument();
  });

  it('should display user initial when no photo is available', () => {
    renderWithContext({ ...mockUser, photoUrl: 'no-photo.jpg' });

    expect(screen.getByText(mockUser.channelName.charAt(0))).toBeInTheDocument();
  });

  it('should display "Guest" when user is not logged in', () => {
    renderWithContext(null);

    expect(screen.getByText('Guest')).toBeInTheDocument();
  });

  it('should call logout function when signing out', () => {
    renderWithContext(mockUser);

    fireEvent.click(screen.getByText('Sign Out'));
    expect(mockLogout).toHaveBeenCalled();
  });
});