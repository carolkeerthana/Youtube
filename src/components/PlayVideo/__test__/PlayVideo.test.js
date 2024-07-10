import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PlayVideo from '../PlayVideo';
import { fetchVideosById } from '../GetVideoApi';
import { checkFeeling } from '../../Feelings/CheckFeelingApi';
import { checkSubscription } from '../../Subscriptions/CheckSubscriptionApi';
import { CreateHistory } from '../../History/HistoryApi/CreateHistoryApi';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext, AuthProvider } from '../../../util/AuthContext';

// Mock the API functions
jest.mock('../GetVideoApi');
jest.mock('../../Feelings/CheckFeelingApi');
jest.mock('../../Subscriptions/CheckSubscriptionApi');
jest.mock('../../History/HistoryApi/CreateHistoryApi');

const mockVideoData = {
  success: true,
  data: {
    url: 'video.mp4',
    title: 'Test Video',
    views: 100,
    createdAt: '2023-07-01T00:00:00.000Z',
    likes: 10,
    dislikes: 2,
    description: 'Test Description',
    userId: {
      id: 'user1',
      channelName: 'Test Channel',
      subscribers: 1000,
      photoUrl: 'avatar.png'
    }
  }
};

const mockFeelingData = {
  success: true,
  data: {
    feeling: 'like'
  }
};

const mockSubscriptionData = {
  success: true,
  data: {
    _id: 'subscription1'
  }
};

describe('PlayVideo', () => {
  beforeEach(() => {
    fetchVideosById.mockResolvedValue(mockVideoData);
    checkFeeling.mockResolvedValue(mockFeelingData);
    checkSubscription.mockResolvedValue(mockSubscriptionData);
    CreateHistory.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(
      <Router>
        <PlayVideo videoId="video1" />
      </Router>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders video data after fetching', async () => {
    render(
        <AuthProvider>
        <Router>
            <PlayVideo videoId="video1" />
        </Router>
        </AuthProvider>
    );

    await waitFor(() => {
    expect(screen.getByRole('heading', { name: /test video/i })).toBeInTheDocument();
    });
   
    expect(screen.getByText(/100 views/i)).toBeInTheDocument();
    expect(screen.getByText(/test description/i)).toBeInTheDocument();
    
    const channelElements = screen.getAllByText(/test channel/i);
    expect(channelElements.length).toBeGreaterThan(0);

  });

  test('handles subscription status correctly', async () => {
    render(
      <Router>
        <AuthProvider>
          <PlayVideo videoId="video1" />
        </AuthProvider>
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('1000 subscribers')).toBeInTheDocument();
    });
  });

  test('calls CreateHistory API after fetching video data', async () => {
    render(
      <AuthProvider>
      <Router>
        <PlayVideo videoId="video1" />
      </Router>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(CreateHistory).toHaveBeenCalledWith({ type: 'watch', videoId: 'video1' });
    });
  });

  test('handles feelings correctly', async () => {
    render(
      <AuthProvider>
      <Router>
        <PlayVideo videoId="video1" />
      </Router>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(checkFeeling).toHaveBeenCalledWith({ videoId: 'video1' });
    });
  });

  test('handles errors gracefully', async () => {
    fetchVideosById.mockRejectedValue(new Error('Failed to fetch'));

    render(
      <Router>
        <PlayVideo videoId="video1" />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  test('handles subscription failure due to incorrect channelId', async () => {
    // Mock setIsSubscribed function
    const setIsSubscribed = jest.fn();

    // Mock checkSubscription to simulate subscription failure with "Resource not found" error
    checkSubscription.mockImplementation(() => {
      return Promise.resolve({ success: false, error: 'Resource not found' });
    });

    fetchVideosById.mockResolvedValue(mockVideoData);
    checkFeeling.mockResolvedValue(mockFeelingData);
    CreateHistory.mockResolvedValue({ success: true });

    // Mock console.error to capture any errors
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    render(
      <AuthProvider>
      <Router>
        <PlayVideo videoId="video1" setIsSubscribed={setIsSubscribed} />
      </Router>
      </AuthProvider>
    );

    // Wait for the component to finish rendering and state updates
    await waitFor(() => {
      // Assert that setIsSubscribed is called with false
      // expect(setIsSubscribed).toHaveBeenCalledWith(false);
      // Assert that console.error was called with expected message
      expect(consoleErrorSpy).toHaveBeenCalledWith('Subscription check failed:', { success: false, error: 'Resource not found' });
    });

    // Clean up mock
    consoleErrorSpy.mockRestore();
  });
  test('logs error when API response is not in expected format', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    fetchVideosById.mockResolvedValue({ success: false });

    render(
      <Router>
        <AuthProvider>
          <PlayVideo videoId="video1" />
        </AuthProvider>
      </Router>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('API response is not in the expected format:', { success: false });
    });

    consoleErrorSpy.mockRestore();
  });

  test('logs error when history creation fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    CreateHistory.mockResolvedValue({ success: false });

    render(
        <AuthProvider>
        <Router>
            <PlayVideo videoId="video1" />
        </Router>
        </AuthProvider>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to create history:', { success: false });
    });

    consoleErrorSpy.mockRestore();
  });
});
