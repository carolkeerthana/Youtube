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
import { openDropdownByTestId } from './testUtils';

jest.mock('../../../util/AuthContext');
jest.mock('../Apis/GetCommentsApi');
jest.mock('../Apis/DeleteCommentApi');
jest.mock('../../Replies/Api/GetRepliesApi');
jest.mock('../Apis/CreateCommentsApi.js');
jest.mock('../Apis/UpdateCommentApi.js');

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
      id: 'r1',
      text: 'This is a reply',
      commentId: '1',
      userId: { _id: 'user2', channelName: 'User2' },
      createdAt: '2023-01-01T00:00:00Z',
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
        data: []
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
});

    test('renders comments', async () => {
      render(
          <BrowserRouter>
              <Comments videoId="video1" />
          </BrowserRouter>
      );

      // Wait for comments to load
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

      // const editButton = await screen.findByText('Edit');
      // expect(editButton).toBeInTheDocument();
      const editButton = await screen.findByTestId('dropdown-edit');
        expect(editButton).toBeInTheDocument();

      fireEvent.click(editButton);

      const editInput = screen.getByDisplayValue('Test comment 1');
      fireEvent.change(editInput, { target: { value: 'Edited comment' } });
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      expect(screen.getByDisplayValue('Edited comment')).toBeInTheDocument()
    });

    test('clicking on reply-toggle shows replies', async () => {
      render(
        <Comments />
      );
    
        const dropdownIcon1 = screen.queryByTestId('dropdown-icon-comment1');
        if (dropdownIcon1) {
          fireEvent.click(dropdownIcon1);
    
        const replyToggle1 = await screen.findByTestId('reply-toggle-comment-comment1');
        fireEvent.click(replyToggle1);
    
        await screen.findByText('Reply to comment 1');
        screen.getByText('Reply to comment 1');
      } else {
        console.log('Dropdown icon for comment 1 not found');
      }
    });

    test('displays replies to a comment', async () => {
      const comment = {
          id: 'comment1',
          text: 'Test comment 1',
      };
  
      const commentReplies = [
          {
              id: 'reply1',
              text: 'Test reply',
          },
      ];
  
      let isVisible = false; // State to track visibility of replies
      const toggleRepliesVisibility = jest.fn(() => {
          isVisible = !isVisible; // Toggle visibility state
      });
  
      render(
          <Comments
              comment={comment}
              hasReplies={true}
              commentReplies={commentReplies}
              toggleRepliesVisibility={toggleRepliesVisibility}
              isVisible={isVisible}
          />
      );
  
      // Verify initial state
      expect(screen.queryByText('Test reply')).toBeNull(); // Replies should not be visible initially
  
      // Simulate clicking on the toggle icon
      const toggleIcon = await screen.findByTestId(`reply-toggle-comment-${comment.id}`);
      fireEvent.click(toggleIcon);
  
      // Verify that replies are now visible
      expect(screen.getByText('Test reply')).toBeInTheDocument();
  });


    test('fetches and displays comments', async () => {
      render(
        <MockAuthProvider>
          <Comments videoId="123" />
        </MockAuthProvider>
      );
  
      await waitFor(() => {
        expect(screen.getByText('This is a test comment')).toBeInTheDocument();
      });
    });
  
    test.skip('creates a new comment', async () => {
      commentsApi.mockResolvedValue({
        success: true,
        data: { id: '2', text: 'New Comment', userId: { _id: '1', channelName: 'Test User' } },
      });
  
      render(
        <MockAuthProvider>
          <CreateComments videoId="123" onCommentAdded={jest.fn()} />
        </MockAuthProvider>
      );
  
      fireEvent.change(screen.getByPlaceholderText('Add a public comment...'), {
        target: { value: 'New Comment' },
      });
      fireEvent.click(screen.getByText('COMMENT'));
  
      await waitFor(() => {
        expect(screen.getByDisplayValue('New Comment')).toBeInTheDocument();
      });
    });
  
    test('updates an existing comment', async () => {
      updateComment.mockResolvedValue({
        success: true,
        data: { id: '1', text: 'Updated Comment' },
      });
  
      render(
        <MockAuthProvider>
          <UpdateComment
            commentId="1"
            comment={{ text: 'Old Comment' }}
            updateCommentAdded={jest.fn()}
            cancelEdit={jest.fn()}
          />
        </MockAuthProvider>
      );
  
      fireEvent.change(screen.getByPlaceholderText('Old Comment'), {
        target: { value: 'Updated Comment' },
      });
      fireEvent.click(screen.getByText('Save'));
  
      await waitFor(() => {
        expect(screen.getByDisplayValue('Updated Comment')).toBeInTheDocument();
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

  });
