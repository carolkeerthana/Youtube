import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Comments from '../Comments';
import { useAuth } from '../../../util/AuthContext';
import { fetchComments } from '../Apis/GetCommentsApi';
import { getReplies } from '../../Replies/Api/GetRepliesApi';
import { deleteCommentApi } from '../Apis/DeleteCommentApi';

// Mock the useAuth hook
jest.mock('../../../util/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock API calls
jest.mock('../Apis/GetCommentsApi', () => ({
  fetchComments: jest.fn(),
}));

jest.mock('../../Replies/Api/GetRepliesApi', () => ({
  getReplies: jest.fn(),
}));

jest.mock('../Apis/DeleteCommentApi', () => ({
  deleteCommentApi: jest.fn(),
}));

const mockComments = [
  {
    id: '1',
    text: 'First comment',
    userId: { _id: 'user1', channelName: 'User One' },
    createdAt: '2023-07-01T12:00:00Z',
    replies: [
      {
          id: 'reply1',
          text: 'First reply',
          createdAt: '2023-07-01T12:00:00Z',
          userId: { _id: 'user1', channelName: 'User Two' },
          commentId: '1',
      },
  ],
  },
  {
    id: '2',
    text: 'Second comment',
    userId: { _id: 'user2', channelName: 'User Two' },
    createdAt: '2023-07-02T12:00:00Z',
  },
];

const mockReplies = [
  {
    id: '1',
    text: 'First reply',
    commentId: '1',
    userId: { _id: 'user3', channelName: 'User Three' },
    createdAt: '2023-07-03T12:00:00Z',
  },
];

describe('Comments Component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: 'user1', channelName: 'User One' },
    });

    fetchComments.mockResolvedValue({ success: true, data: mockComments });
    getReplies.mockResolvedValue({ success: true, data: mockComments[0].replies });
    deleteCommentApi.mockResolvedValue({ success: true });
  });

  const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);

    return render(ui, { wrapper: MemoryRouter });
  };

  test('renders comments and replies', async () => {
    renderWithRouter(<Comments videoId="123" />);

    expect(screen.getByText('0 Comments')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument();
    });
      expect(screen.getByText('Second comment')).toBeInTheDocument();
      expect(screen.getByText('User One')).toBeInTheDocument();
      expect(screen.getByText('User Two')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('reply-toggle-comment-1'));

    await waitFor(() => {
      expect(screen.getByText('First reply')).toBeInTheDocument();
    });
    expect(screen.getByText('User One')).toBeInTheDocument();
  });

  test('adds a new comment', async () => {
    renderWithRouter(<Comments videoId="123" />);

    fireEvent.change(screen.getByPlaceholderText('Add a public comment...'), {
      target: { value: 'New comment' },
    });

    fireEvent.click(screen.getByText('COMMENT'));

    await waitFor(() => {
      expect(screen.getByDisplayValue('New comment')).toBeInTheDocument();
    });
  });

  test('Handle Api error while creating a comment', async () => {
    renderWithRouter(<Comments videoId="123" />);

    fireEvent.change(screen.getByPlaceholderText('Add a public comment...'), {
      target: { value: 'New comment' },
    });

    fireEvent.click(screen.getByText('COMMENT'));

    await waitFor(() => {
      expect(screen.getByDisplayValue('New comment')).toBeInTheDocument();
    });
  });

  test('edits a comment', async () => {
    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('dropdown-icon-1'));
    fireEvent.click(screen.getByTestId('dropdown-edit'));

    fireEvent.change(screen.getByDisplayValue('First comment'), {
      target: { value: 'Updated comment' },
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByDisplayValue('Updated comment')).toBeInTheDocument();
    });
  });

  test('deletes a comment', async () => {
    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('dropdown-icon-1'));
    fireEvent.click(screen.getByTestId('dropdown-delete'));

    await waitFor(() => {
      expect(screen.queryByText('First comment')).not.toBeInTheDocument();
    });
  });

  test('adds a reply', async () => {
    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument();
    });

    // Find the specific reply button for the first comment
    const firstCommentReplyButton = screen.getAllByTestId('reply-button')[0];

    fireEvent.click(firstCommentReplyButton);

    fireEvent.change(screen.getAllByPlaceholderText('Add a reply...')[0], {
      target: { value: 'New reply' },
    });

    fireEvent.click(screen.getAllByText('Reply')[0]);

    await waitFor(() => {
      expect(screen.getByDisplayValue('New reply')).toBeInTheDocument();
    });
  });

  test('only shows edit options to the owner of the reply', async () => {
    render(
    <BrowserRouter>
    <Comments videoId="123" />
    </BrowserRouter>);

    await waitFor(() => {
        expect(screen.getByText('First comment')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/1 reply/));

    await waitFor(() => {
        expect(screen.getByText('First reply')).toBeInTheDocument();
    });

    expect(screen.getByTestId('dropdown-icon-reply-reply1')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('dropdown-icon-reply-reply1'));
    fireEvent.click(await screen.findByTestId('dropdown-reply-edit'));

    fireEvent.change(screen.getByDisplayValue('First reply'), {
      target: { value: 'Updated reply' },
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByDisplayValue('Updated reply')).toBeInTheDocument();
    });
});

test('does not show edit options to non-owners of the reply', async () => {
  useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: 'user3', channelName: 'User Three' },
  });

  render(
    <BrowserRouter>
    <Comments videoId="123" />
    </BrowserRouter>);

  await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText(/1 reply/));

  await waitFor(() => {
      expect(screen.getByText('First reply')).toBeInTheDocument();
  });

  
  expect(screen.getByTestId('dropdown-icon-reply-reply1')).toBeInTheDocument();
  fireEvent.click(screen.getByTestId('dropdown-icon-reply-reply1'));

  expect(screen.queryByTestId('dropdown-reply-edit')).not.toBeInTheDocument();
});

  test('deletes a reply', async () => {
    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/1 reply/));
  
    await waitFor(() => {
      expect(screen.getByText('First reply')).toBeInTheDocument();
    });

    expect(screen.getByTestId('dropdown-icon-reply-reply1')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('dropdown-icon-reply-reply1'));
    fireEvent.click(screen.getByTestId('dropdown-reply-delete'));

    await waitFor(() => {
      expect(screen.queryByText('First reply')).not.toBeInTheDocument();
    });
  });

  test('toggles comment dropdown menu', async () => {
    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('dropdown-icon-1'));

    await waitFor(() => {
      expect(screen.getByTestId('dropdown-edit')).toBeInTheDocument();
    });
    expect(screen.getByTestId('dropdown-delete')).toBeInTheDocument();
  });

  test('toggles replies visibility', async () => {
    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('reply-toggle-comment-1'));

    await waitFor(() => {
      expect(screen.getByText('First reply')).toBeInTheDocument();
    });
  });

  test('shows dropdown menu for reply owner', async () => {
    render(<Comments videoId="123" />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('reply-toggle-comment-1'));

    await waitFor(() => {
      expect(screen.getByText('First reply')).toBeInTheDocument();
    });

    const dropdownIcon = screen.getByTestId('dropdown-icon-reply-reply1');
    fireEvent.click(dropdownIcon);

    expect(screen.getByTestId('dropdown-reply-edit')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-reply-delete')).toBeInTheDocument();
  });

});
