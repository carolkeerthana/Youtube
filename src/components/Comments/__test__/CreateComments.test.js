import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext, AuthProvider } from '../../../util/AuthContext';
import CreateComments from '../CreateComments';
import userEvent from '@testing-library/user-event';
import { fetchUserDetails } from '../../User/UserProfile/UserDetailsApi';
import { commentsApi } from '../Apis/CreateCommentsApi';

// Mock fetchUserDetails and commentsApi
jest.mock('../../User/UserProfile/UserDetailsApi', () => ({
    fetchUserDetails: jest.fn().mockResolvedValue({
        _id: 'userId',
        channelName: 'testChannel'
    })
}));

jest.mock('../Apis/CreateCommentsApi', () => ({
    commentsApi: jest.fn().mockResolvedValue({
        success: true,
        data: {
            text: 'Test Comment',
            createdAt: '2024-07-09T00:00:00Z'
        }
    })
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const renderComponent = (isAuthenticated) => {
    return render(
        <Router>
            <AuthProvider value={{ isAuthenticated }}>
                <CreateComments videoId="testVideoId" onCommentAdded={jest.fn()} />
            </AuthProvider>
        </Router>
    );
};

describe('CreateComments', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
        renderComponent(false);
        expect(screen.getByPlaceholderText('Add a public comment...')).toBeInTheDocument();
    });

    test('updates input value on change', () => {
        renderComponent(true);
        const input = screen.getByPlaceholderText('Add a public comment...');
        userEvent.type(input, 'Test Comment');
        expect(input).toHaveValue('Test Comment');
    });

    test('navigates to signin when not authenticated and trying to focus', () => {
        renderComponent(false);
        const input = screen.getByPlaceholderText('Add a public comment...');
        userEvent.click(input);
        expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });

    test('fetches user details and handles comment submission', async () => {
        fetchUserDetails.mockResolvedValue({
          _id: 'userId',
          channelName: 'testChannel'
        });
    
        commentsApi.mockResolvedValue({
          success: true,
          data: {
            text: 'Test Comment',
            createdAt: '2024-07-09T00:00:00Z'
          }
        });
    
        const onCommentAdded = jest.fn();
        renderComponent(true, onCommentAdded);
    
        const input = screen.getByPlaceholderText('Add a public comment...');
        userEvent.type(input, 'Test Comment');
        const commentButton = screen.getByText('COMMENT');
    
        userEvent.click(commentButton);
    
        await waitFor(() => expect(onCommentAdded).toHaveBeenCalledWith(expect.objectContaining({
          text: 'Test Comment',
          channelName: 'testChannel'
        })));
      });

    test('cancels comment correctly', () => {
        renderComponent(true);
        const input = screen.getByPlaceholderText('Add a public comment...');
        userEvent.type(input, 'Test Comment');
        const cancelButton = screen.getByText('CANCEL');
        userEvent.click(cancelButton);
        expect(input).toHaveValue('');
        expect(screen.queryByText('CANCEL')).not.toBeVisible();
    });
});
