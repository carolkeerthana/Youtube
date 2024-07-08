import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Comments from '../Comments';
import CreateComments from '../CreateComments';
import UpdateComment from '../Update/UpdateComment';
import { fetchComments } from '../Apis/GetCommentsApi';
import { fetchReplies, getReplies } from '../../Replies/Api/GetRepliesApi';
import { commentsApi } from '../Apis/CreateCommentsApi';
import { updateComment } from '../Apis/UpdateCommentApi';
import { deleteCommentApi } from '../Apis/DeleteCommentApi';
import { AuthProvider, useAuth } from '../../../util/AuthContext';
import { MockAuthProvider } from './MockAuthProvider';
import { BrowserRouter } from 'react-router-dom';
import { openDropdownByTestId, toggleReplyByTestId } from './testUtils';
import { fetchUserDetails } from '../../User/UserProfile/UserDetailsApi';
import CreateReply from '../../Replies/CreateReply';
import { createReply } from '../../Replies/Api/CreateReplyApi';

jest.mock('../../../util/AuthContext');
jest.mock('../Apis/GetCommentsApi');
jest.mock('../Apis/DeleteCommentApi');
jest.mock('../Apis/CreateCommentsApi.js');
jest.mock('../Apis/UpdateCommentApi.js');

jest.mock('../../Replies/Api/GetRepliesApi');
jest.mock('../../Replies/Api/CreateReplyApi.js');
jest.mock('../../User/UserProfile/UserDetailsApi');



const mockNavigate = jest.fn();


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const mockComments = [
  {
      id: '1',
      text: 'This is a comment',
      userId: { _id: 'user1', channelName: 'User1' },
      createdAt: '2023-01-01T00:00:00Z',
  },
];

const mockReplies = [
  {
    id: 'reply1',
    text: 'This is a reply',
    commentId: 'comment1',
    userId: { _id: 'user3', channelName: 'User Three' },
    createdAt: '2023-01-03T00:00:00Z',
  },
];
  
  describe('Comments Functionality', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
          isAuthenticated: true,
          user: { id: 'user1' }
      });

      fetchComments.mockResolvedValue({
        success: true,
        data: [
            {
                id: 'comment1',
                text: 'Test comment 1',
                userId: { _id: 'user1', channelName: 'User One' },
                createdAt: '2023-01-01T00:00:00Z'
            },
            {
                id: 'comment2',
                text: 'Test comment 2',
                userId: { _id: 'user2', channelName: 'User Two' },
                createdAt: '2023-01-02T00:00:00Z'
            }
        ]
    });

    getReplies.mockResolvedValue({
        success: true,
        data: mockReplies
    });

    deleteCommentApi.mockResolvedValue({
        success: true
    });

    commentsApi.mockResolvedValue({
        success: true,
        data: {
            id: 'comment3',
            text: 'New comment',
            userId: { _id: 'user1', channelName: 'User One' },
            createdAt: '2023-01-03T00:00:00Z'
        }
    });

    updateComment.mockResolvedValue({
        success: true,
        data: {
            id: 'comment1',
            text: 'Edited comment',
            userId: { _id: 'user1', channelName: 'User One' },
            createdAt: '2023-01-01T00:00:00Z'
        }
    });

    createReply.mockResolvedValue({
      success: true,
      data: {
          id: 'newReplyId',
          text: 'New reply text',
          commentId: 'comment1',
          userId: { _id: 'user1', channelName: 'User1' },
          createdAt: '2023-01-04T00:00:00Z'
      }
  });
});

    test('renders comments', async () => {
      render(
          <BrowserRouter>
              <Comments videoId="video1" />
          </BrowserRouter>
      );

      const commentText1 = await screen.findByText('Test comment 1');
      const commentText2 = await screen.findByText('Test comment 2');
      expect(commentText1).toBeInTheDocument();
      expect(commentText2).toBeInTheDocument();
    });

    test('allows editing a comment', async () => {
      render(
          <BrowserRouter>
              <Comments videoId="video1" />
          </BrowserRouter>
      );
  
      const commentText = await screen.findByText('Test comment 1');
      expect(commentText).toBeInTheDocument();

      openDropdownByTestId('dropdown-icon-comment1');

      const editButton = await screen.findByTestId('dropdown-edit');
        expect(editButton).toBeInTheDocument();

      fireEvent.click(editButton);

      const editInput = screen.getByDisplayValue('Test comment 1');
      fireEvent.change(editInput, { target: { value: 'Edited comment' } });
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      expect(screen.getByDisplayValue('Edited comment')).toBeInTheDocument()
    });

    test.skip('displays replies to a comment', async () => {
      getReplies.mockResolvedValue({
          success: true,
          data: [
              {
                  id: 'reply1',
                  text: 'Test reply',
                  userId: { _id: 'user3', channelName: 'User Three' },
                  createdAt: '2023-01-03T00:00:00Z'
              }
          ]
      });

      render(
          <BrowserRouter>
              <Comments videoId="video1" />
          </BrowserRouter>
      );

      // Wait for comments to load
      const commentText = await screen.findByText('Test comment 1');
      expect(commentText).toBeInTheDocument();

      // Simulate clicking to view replies
      const viewRepliesButton = screen.getByText('reply');
      fireEvent.click(viewRepliesButton);

      // Wait for replies to load
      const replyText = await screen.findByText('Test reply');
      expect(replyText).toBeInTheDocument();
  });

  test.skip('allows adding a new comment', async () => {
    commentsApi.mockResolvedValue({ success: true, data: {} }); // Mock the response
  
    const mockOnCommentAdded = jest.fn();
  
    render(
      <BrowserRouter>
        <CreateComments videoId="video1" onCommentAdded={mockOnCommentAdded} />
      </BrowserRouter>
    );
  
    const commentInput = await screen.findByPlaceholderText('Add a public comment...');
    fireEvent.change(commentInput, { target: { value: 'New comment' } });
  
    const addButton = screen.getByText('COMMENT');
    fireEvent.click(addButton);
  

      expect(commentsApi).toHaveBeenCalledWith({
        videoId: 'video1',
        text: 'New comment'
      });

  
    await waitFor(() => {
      expect(commentInput).toHaveValue('');
    });
  });

    test('allows deleting a comment', async () => {
      render(
          <BrowserRouter>
              <Comments videoId="video1" />
          </BrowserRouter>
      );

      // Wait for comments to load
      const commentText = await screen.findByText('Test comment 1');
      expect(commentText).toBeInTheDocument();

      // Click on the dropdown icon
      openDropdownByTestId('dropdown-icon-comment1');

      // Check if the dropdown menu is visible
      const deleteButton = await screen.findByTestId('dropdown-delete');
      expect(deleteButton).toBeInTheDocument();

      // Click on the delete button
      fireEvent.click(deleteButton);

      // Wait for the comment to be removed
      await waitFor(() => {
          expect(commentText).not.toBeInTheDocument();
      });

      // Ensure the deleteCommentApi function was called with the correct comment ID
      expect(deleteCommentApi).toHaveBeenCalledWith('comment1');
  });

  test('toggles comment dropdown menu', async () => {
      require('../Apis/GetCommentsApi').fetchComments.mockResolvedValue({ success: true, data: mockComments });
      require('../../Replies/Api/GetRepliesApi').getReplies.mockResolvedValue({ success: true, data: [] });

      render(
        <BrowserRouter>
            <Comments videoId="video1" />
        </BrowserRouter>
    );

      const commentText = await screen.findByText('This is a comment');
      expect(commentText).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('dropdown-icon-1'));

      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  test.skip('allows authenticated user to add a comment', async () => {
    
    render(
      <BrowserRouter>
          <Comments videoId="video1" />
      </BrowserRouter>
  );

    const commentInput = screen.getByPlaceholderText('Add a public comment...');
    fireEvent.change(commentInput, { target: { value: 'New comment' } });
    fireEvent.click(screen.getByText('COMMENT'));

    expect(screen.getByDisplayValue('New comment')).toBeInTheDocument();
    // expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(commentsApi).toHaveBeenCalledWith('comment3','New comment');
  });

  test.skip('should render static text', async() => {
    render(
      <createReply commentId="comment3"/>
    );

    const replyInput = await screen.findByPlaceholderText('Add a reply...');
    expect(replyInput).toBeInTheDocument();

  })

  test('allows adding a reply to a comment', async () => {
    createReply.mockResolvedValue({
      success: true,
      data: {
          id: 'newReplyId',
          text: 'New reply text',
          commentId: 'comment1',
          userId: { _id: 'user1', channelName: 'User1' },
          createdAt: '2023-01-04T00:00:00Z'
      }
  });
    render(
        <BrowserRouter>
            <Comments videoId="video1" />
        </BrowserRouter>
    );

    const commentText = await screen.findByText('Test comment 1');
    expect(commentText).toBeInTheDocument();

    const replyButtons = screen.getAllByText('Reply');
    const replyButton = replyButtons[0];
    fireEvent.click(replyButton);

    const replyInput = screen.getByPlaceholderText('Add a reply...');
    fireEvent.change(replyInput, { target: { value: 'New reply text' } });

    const addButton = screen.getByText('REPLY');
    fireEvent.click(addButton);

    const successResponse =  {
      commentId: 'comment1',
        text: 'New reply text'
    }
    expect(createReply).toHaveBeenCalledWith(successResponse);

    await waitFor(() => {
        const newReplyText = screen.getByText('New reply text');
        expect(newReplyText).toBeInTheDocument();
    });
});

});
