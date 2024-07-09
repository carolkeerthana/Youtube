import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../../../Navbar/Navbar';
import { searchText } from '../../../Search/SearchApi';
import UserProfile from '../UserProfile';
import { AuthProvider } from '../../../../util/AuthContext';

// Define mock user objects
const mockUser = {
    channelName: 'testUser',
    email: 'test@example.com',
    photoUrl: 'user-photo.jpg',
  };
  
  const mockUserWithoutPhoto = {
    channelName: 'testUser',
    email: 'test@example.com',
    photoUrl: 'no-photo.jpg',
  };
  
  // Mock useAuth function globally for AuthContext
  jest.mock('../../../../util/AuthContext', () => ({
    useAuth: () => ({
      user: mockUserWithoutPhoto,
      logout: jest.fn(),
    }),
  }));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('UserProfile Component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('renders sign in link when user is not authenticated', () => {
        render(
        <Router>
            <Navbar setSidebar={() => {}} />
        </Router>
        );

        expect(screen.getByTestId('signin-icon')).toBeInTheDocument();
    });

    test('renders user profile without photo when user is authenticated and has no photo', () => {
        jest.spyOn(require('../../../../util/AuthContext'), 'useAuth').mockReturnValue({
            user: mockUserWithoutPhoto,
            logout: jest.fn(),
          });
      
          render(
              <Router>
                <UserProfile userInitialColor="#FF5733" />
              </Router>
          );
    
        // Assert user's channel name initial is displayed
        const userInitialElement = screen.getByText('t');// Replace 'T' with the expected initial based on your mock user data
        expect(userInitialElement).toBeInTheDocument();
    
        // Assert user's channel name and email are rendered
        expect(screen.getByText('testUser')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
    
        // Assert user's photoUrl is not rendered (userInitialElement should cover this case)
        // const userProfileImage = screen.getByAltText('testUser');
        expect(screen.queryByAltText('testUser')).not.toBeInTheDocument();
      });


    test('renders user profile when user is authenticated', () => {

        jest.spyOn(require('../../../../util/AuthContext'), 'useAuth').mockReturnValue({
            user: mockUser,
            logout: jest.fn(),
          });
      
          render(
              <Router>
                <UserProfile userInitialColor="#FF5733" />
              </Router>
          );
    
        expect(screen.getByText('testUser')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
    
        const userProfileImage = screen.getByAltText('testUser');
        expect(userProfileImage).toBeInTheDocument();
        expect(userProfileImage).toHaveAttribute('src', 'user-photo.jpg');
      });

      
  it.skip('navigates to search results page on search', async () => {
    const { getByTestId, getByPlaceholderText } = render(
      <Router>
        <Navbar setSidebar={() => {}} />
      </Router>
    );

    // Mock searchText function
    const searchTextMock = jest.fn().mockResolvedValue({ data: [{ id: 1, title: 'Test Video' }] });

    // Replace the original function with the mocked one
    searchText.mockImplementation(searchTextMock);

    // Type in search input
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'test' } });

    // Submit the search form
    fireEvent.submit(screen.getByTestId('search-form'));

    // Wait for navigation
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/search-results'));

    // Additional assertions for search results handling
    expect(searchTextMock).toHaveBeenCalledWith({ text: 'test' });
  });
});
