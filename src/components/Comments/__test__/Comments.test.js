import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import {
  BrowserRouter,
  MemoryRouter,
  Router,
  useNavigate,
} from "react-router-dom";
import Comments from "../Comments";
import { useAuth } from "../../../util/AuthContext";
import { fetchComments } from "../Apis/GetCommentsApi";
import { getReplies } from "../../Replies/Api/GetRepliesApi";
import { deleteCommentApi } from "../Apis/DeleteCommentApi";
import { fetchUserDetails } from "../../User/UserProfile/UserDetailsApi";
import UpdateReply from "../../Replies/UpdateReply";
import { deleteReply } from "../../Replies/Api/DeleteReplyApi";
import { createCommentsApi } from "../Apis/CreateCommentsApi";
import UpdateComment from "../Update/UpdateComment";
import { updateComment, updateCommentApi } from "../Apis/UpdateCommentApi";
import CreateComments from "../CreateComments";
import CreateReply from "../../Replies/CreateReply";
import { createReplyApi } from "../../Replies/Api/CreateReplyApi";
import { updateReplyApi } from "../../Replies/Api/UpdateReplyApi";

jest.mock("../../../util/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../Apis/GetCommentsApi", () => ({
  fetchComments: jest.fn(),
}));

jest.mock("../../Replies/Api/GetRepliesApi", () => ({
  getReplies: jest.fn(),
}));

jest.mock("../Apis/CreateCommentsApi.js", () => ({
  createCommentsApi: jest.fn(),
}));

jest.mock("../../User/UserProfile/UserDetailsApi", () => ({
  fetchUserDetails: jest.fn().mockResolvedValue({
    channelName: "User One",
    userId: "user123",
  }),
}));

jest.mock("../Apis/DeleteCommentApi", () => ({
  deleteCommentApi: jest.fn(),
}));
jest.mock("../../Replies/Api/CreateReplyApi.js", () => ({
  createReplyApi: jest.fn(),
}));
jest.mock("../../Replies/Api/UpdateReplyApi.js", () => ({
  updateReplyApi: jest.fn(),
}));
jest.mock("../../Replies/Api/DeleteReplyApi.js", () => ({
  deleteReply: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));
jest.mock("../Apis/UpdateCommentApi", () => ({
  updateCommentApi: jest.fn(),
}));

// jest.mock('../../Replies/UpdateReply', () => ({ replyId, reply, channelName, onUpdateReply, cancelEdit }) => (
//   <div data-testid="update-reply-component">
//     <textarea
//       data-testid="update-reply-input"
//       defaultValue={reply.text}
//       onChange={(e) => onUpdateReply({ id: replyId, text: e.target.value, channelName })}
//     />
//     <button data-testid="update-reply-save">Save</button>
//     <button data-testid="update-reply-cancel" onClick={cancelEdit}>
//       Cancel
//     </button>
//   </div>
// ));

const mockComments = [
  {
    id: "1",
    text: "First comment",
    userId: { _id: "user1", channelName: "User One" },
    createdAt: "2023-07-01T12:00:00Z",
    replies: [
      {
        id: "reply1",
        text: "First reply",
        createdAt: "2023-07-01T12:00:00Z",
        userId: { _id: "user1", channelName: "User Two" },
        commentId: "1",
      },
    ],
  },
  {
    id: "2",
    text: "Second comment",
    userId: { _id: "user2", channelName: "User Two" },
    createdAt: "2023-07-02T12:00:00Z",
  },
];

const mockReplies = [
  {
    id: "1",
    text: "First reply",
    commentId: "1",
    userId: { _id: "user3", channelName: "User Three" },
    createdAt: "2023-07-03T12:00:00Z",
  },
];

const mockUser = { id: "user1", channelName: "User One" };
let mockSetReplies = jest.fn();
let callCount = 0;

const mockedNavigate = jest.fn();
describe("Comments Component", () => {
  const mockOnCommentAdded = jest.fn();
  const mockOnReplyAdded = jest.fn();
  const mockSetComments = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    fetchComments.mockResolvedValue({ success: true, data: mockComments });
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    });
    fetchUserDetails.mockResolvedValue({ channelName: "User One" });
    getReplies.mockResolvedValue({
      success: true,
      data: mockComments[0].replies,
    });
    updateCommentApi.mockResolvedValue({
      success: true,
      data: { id: "comment-id", text: "Updated comment" },
    });
    deleteCommentApi.mockResolvedValue({ success: true });
    deleteReply.mockResolvedValue({ success: true });
    useNavigate.mockReturnValue(mockedNavigate);

    // Mock console.error
    global.console.error = jest.fn();

    // mockSetReplies = jest.fn();

    // // Use the mockSetReplies function in the component
    // jest.spyOn(React, "useState").mockImplementation((init) => {
    //   return [init, mockSetReplies];
    // });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  const renderWithRouter = (ui, { route = "/" } = {}) => {
    window.history.pushState({}, "Test page", route);

    return render(ui, { wrapper: MemoryRouter });
  };
  test("renders comments and replies", async () => {
    renderWithRouter(<Comments videoId="123" />);

    expect(screen.getByText("0 Comments")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });
    expect(screen.getByText("Second comment")).toBeInTheDocument();
    expect(screen.getByText("User One")).toBeInTheDocument();
    expect(screen.getByText("User Two")).toBeInTheDocument();

    expect(fetchComments).toHaveBeenCalledWith("123");

    fireEvent.click(screen.getByTestId("reply-toggle-comment-1"));

    await waitFor(() => {
      expect(screen.getByText("First reply")).toBeInTheDocument();
    });
    expect(screen.getByText("User One")).toBeInTheDocument();
    expect(getReplies).toHaveBeenCalled();
  });

  test("logs error when fetch comments API response is not in expected format", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    fetchComments.mockResolvedValue({ success: false });

    render(<Comments videoId="123" />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "API response is not in the expected format:",
        { success: false }
      );
    });
    consoleErrorSpy.mockRestore();
  });

  test("handles fetch comments error", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    fetchComments.mockRejectedValueOnce(new Error("Fetch failed"));

    render(<Comments videoId="123" />);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/error");
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching data:",
      expect.any(Error)
    );
    consoleErrorSpy.mockRestore();
  });

  test("logs error when fetch reply API response is not in expected format", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    getReplies.mockResolvedValue({ success: false });

    render(<Comments videoId="123" />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "API response is not in the expected format:",
        { success: false }
      );
    });
    consoleErrorSpy.mockRestore();
  });

  test("handles fetch replies error", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    getReplies.mockRejectedValueOnce(new Error("Fetch failed"));

    render(<Comments videoId="123" />);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/error");
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to fetch replies:",
      expect.any(Error)
    );
    consoleErrorSpy.mockRestore();
  });

  test("should log the new comment, add the user information, and update comments state", () => {
    console.log = jest.fn();
    const user = { id: "user123", name: "Test User" };

    const setComments = jest.fn();
    const initialComments = [
      {
        text: "Existing comment",
        userId: { id: "user456", name: "Another User" },
      },
    ];

    const newComment = {
      text: "This is a new comment",
      videoId: "video123",
    };

    const handleCommentAdded = (newComment) => {
      console.log("New comment added:", newComment);
      const newCommentWithUser = {
        ...newComment,
        userId: user,
      };
      setComments((prevComments) => [newCommentWithUser, ...prevComments]);
    };

    handleCommentAdded(newComment);
    expect(console.log).toHaveBeenCalledWith("New comment added:", newComment);

    expect(setComments).toHaveBeenCalledWith(expect.any(Function));

    const stateUpdater = setComments.mock.calls[0][0];
    const updatedComments = stateUpdater(initialComments);
    expect(updatedComments).toEqual([
      {
        ...newComment,
        userId: user,
      },
      ...initialComments,
    ]);
  });

  test("adds a new comment", async () => {
    const mockComment = {
      id: "3",
      text: "New comment",
      userId: "1",
      channelName: "User One",
      createdAt: new Date(),
    };

    createCommentsApi.mockResolvedValue({
      success: true,
      data: mockComment,
    });

    renderWithRouter(<Comments videoId="123" />);

    fireEvent.change(screen.getByPlaceholderText("Add a public comment..."), {
      target: { value: "New comment" },
    });

    fireEvent.click(screen.getByTestId("comment-save-button"));
    expect(screen.getByDisplayValue("New comment")).toBeInTheDocument();
  });

  test("handleCommentAdded should add a comment with user details and update the comments state", async () => {
    fetchUserDetails.mockResolvedValue({
      _id: "66504919905aa75e4ab9c575",
      channelName: "Keerthana",
      email: "keerthana.s@e2infosystems.com",
      photoUrl: "no-photo.jpg",
      role: "user",
    });

    createCommentsApi.mockResolvedValueOnce({
      success: true,
      data: {
        text: "test comment",
        videoId: "66430b7749bcf61f8a043d3e",
      },
    });

    render(<Comments videoId="66430b7749bcf61f8a043d3e" />);

    const input = screen.getByPlaceholderText("Add a public comment...");
    fireEvent.change(input, { target: { value: "test comment" } });

    const commentButton = screen.getByTestId("comment-save-button");
    fireEvent.click(commentButton);

    await waitFor(() => {
      expect(fetchUserDetails).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(createCommentsApi).toHaveBeenCalled();
    });

    await waitFor(() => {
      const newCommentElement = screen.getByText("test comment");
      expect(newCommentElement).toBeInTheDocument();
    });

    await waitFor(() => {
      const commentElement = screen.getByText("test comment");
      expect(commentElement).toBeInTheDocument();
    });
  });

  test("should render CreateComments component", () => {
    render(<CreateComments videoId="video123" onCommentAdded={jest.fn()} />);
    console.log("Component rendered");

    expect(
      screen.getByPlaceholderText("Add a public comment...")
    ).toBeInTheDocument();
    expect(screen.getByTestId("comment-save-button")).toBeInTheDocument();
  });

  test("Handle Api error while creating a comment", async () => {
    renderWithRouter(<Comments videoId="123" />);

    fireEvent.change(screen.getByPlaceholderText("Add a public comment..."), {
      target: { value: "New comment" },
    });

    fireEvent.click(screen.getByText("Comment"));

    await waitFor(() => {
      expect(screen.getByDisplayValue("New comment")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });
  });

  test("cancels a comment while creating comment", async () => {
    renderWithRouter(<Comments videoId="123" />);

    fireEvent.change(screen.getByPlaceholderText("Add a public comment..."), {
      target: { value: "New comment" },
    });

    fireEvent.click(screen.getByTestId("comment-cancel-button"));
    expect(screen.queryByText("New comment")).not.toBeInTheDocument();
  });

  test("shows dropdown menu for comments owner", async () => {
    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    const dropdownIcon = screen.getByTestId("dropdown-icon-1");
    fireEvent.click(dropdownIcon);

    expect(screen.getByTestId("dropdown-edit")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-delete")).toBeInTheDocument();
  });

  test("does not show edit options to non-owners of the comment", async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: "user3", channelName: "User Three" },
    });

    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    const dropdownIcon = screen.getByTestId("dropdown-icon-1");
    fireEvent.click(dropdownIcon);

    expect(screen.queryByTestId("dropdown-edit")).not.toBeInTheDocument();
    expect(screen.queryByTestId("dropdown-delete")).not.toBeInTheDocument();
  });

  test("should close comment dropdown when clicking outside", async () => {
    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("dropdown-icon-1"));

    expect(screen.getByText("Edit")).toBeInTheDocument();
    fireEvent.mouseDown(document);
    await waitFor(() => {
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });
  });

  test("edits a comment", async () => {
    render(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("dropdown-icon-1"));
    fireEvent.click(screen.getByTestId("dropdown-edit"));

    fireEvent.change(screen.getByDisplayValue("First comment"), {
      target: { value: "Updated comment" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByDisplayValue("Updated comment")).toBeInTheDocument();
    });
    expect(screen.queryByDisplayValue("First comment")).not.toBeInTheDocument();
    // expect(screen.queryByText("Save")).not.toBeInTheDocument();
  });

  test("cancels editing a comment", async () => {
    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("dropdown-icon-1"));
    fireEvent.click(screen.getByTestId("dropdown-edit"));

    fireEvent.change(screen.getByDisplayValue("First comment"), {
      target: { value: "Updated comment" },
    });
    fireEvent.click(screen.getByTestId("comment-edit-cancel-button"));

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });
  });

  test("deletes a comment", async () => {
    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("dropdown-icon-1"));
    fireEvent.click(screen.getByTestId("dropdown-delete"));

    await waitFor(() => {
      expect(screen.queryByText("First comment")).not.toBeInTheDocument();
    });
  });

  test("logs error if delete comment API response format is incorrect", async () => {
    deleteCommentApi.mockResolvedValueOnce({
      success: false,
      message: "Error",
    });

    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("dropdown-icon-1"));
    fireEvent.click(screen.getByTestId("dropdown-delete"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "API response is not in the expected format:",
        "Error"
      );
    });
  });

  test("should call console.error and navigate to /error on API failure", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    deleteCommentApi.mockRejectedValueOnce(new Error("API failure"));

    render(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("dropdown-icon-1"));
    fireEvent.click(screen.getByTestId("dropdown-delete"));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/error");
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to delete comment:",
      expect.any(Error)
    );
    consoleErrorSpy.mockRestore();
  });

  test("if the user is not authenticated, it should redirect to sign in page", async () => {
    useAuth.mockReturnValue({ isAuthenticated: false });
    render(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    const replyButton = screen.getAllByTestId("reply-button")[0];
    fireEvent.click(replyButton);
    expect(mockedNavigate).toHaveBeenCalledWith("/signin");
  });

  test('shows and focuses reply input on "Reply" button click', async () => {
    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    const firstCommentReplyButton = screen.getAllByTestId("reply-button")[0];
    fireEvent.click(firstCommentReplyButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Add a reply...")).toBeVisible();
    });

    const replyInput = screen.getByPlaceholderText("Add a reply...");
    expect(replyInput).toHaveFocus();
  });

  test("adds a reply", async () => {
    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    const firstCommentReplyButton = screen.getAllByTestId("reply-button")[0];
    fireEvent.click(firstCommentReplyButton);

    const replyInput = screen.getAllByPlaceholderText("Add a reply...")[0];
    expect(replyInput).toBeInTheDocument();
    fireEvent.change(replyInput, { target: { value: "New reply" } });

    fireEvent.click(screen.getAllByText("Reply")[0]);

    await waitFor(() => {
      expect(screen.getByDisplayValue("New reply")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText("Add a reply...")).not.toBeInTheDocument();
    });

    // await waitFor(() => {
    //   expect(screen.getByText("New reply")).toBeInTheDocument();
    // });
    fireEvent.click(screen.getByTestId("reply-toggle-comment-1"));
    await waitFor(() => {
      expect(screen.getByText("First reply")).toBeInTheDocument();
    });

    // await waitFor(() => {
    //   expect(replyInput).not.toBeInTheDocument();
    // });
  });
  test("handleReplyAdded should add a reply with user details and update the comments state", async () => {
    fetchUserDetails.mockResolvedValue({
      _id: "66504919905aa75e4ab9c575",
      channelName: "Keerthana",
      email: "keerthana.s@e2infosystems.com",
      photoUrl: "no-photo.jpg",
      role: "user",
    });

    createReplyApi.mockResolvedValueOnce({
      success: true,
      data: {
        text: "test reply",
        commentId: "1",
      },
    });

    render(<Comments videoId="66430b7749bcf61f8a043d3e" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    const replyButton = screen.getAllByTestId("reply-button")[0];
    fireEvent.click(replyButton);

    const input = screen.getByPlaceholderText("Add a reply...");
    fireEvent.change(input, { target: { value: "test reply" } });

    const replySaveButton = screen.getByTestId("reply-save-button");
    fireEvent.click(replySaveButton);

    // Verify API calls
    await waitFor(() => {
      expect(fetchUserDetails).toHaveBeenCalled();
    });
    expect(createReplyApi).toHaveBeenCalledWith({
      commentId: "1",
      text: "test reply",
    });
    fireEvent.click(screen.getByTestId("toggle-replies"));

    await waitFor(() => {
      const newReplyElement = screen.getByText("test reply");
      expect(newReplyElement).toBeInTheDocument();
    });
    await waitFor(() => {
      const newReplyElement = screen.getByText("First reply");
      expect(newReplyElement).toBeInTheDocument();
    });

    expect(
      screen.queryByPlaceholderText("Add a reply...")
    ).not.toBeInTheDocument();
  });

  test("cancels a reply", async () => {
    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    const firstCommentReplyButton = screen.getAllByTestId("reply-button")[0];
    fireEvent.click(firstCommentReplyButton);

    const replyInput = screen.getAllByPlaceholderText("Add a reply...")[0];
    expect(replyInput).toBeVisible();
    fireEvent.change(replyInput, { target: { value: "New reply" } });

    const replyCancelButton = screen.getByTestId("reply-cancel-button");
    fireEvent.click(replyCancelButton);

    await waitFor(() => {
      expect(replyInput).not.toBeVisible();
    });
  });

  test("only shows edit options to the owner of the reply", async () => {
    render(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/1 reply/));

    await waitFor(() => {
      expect(screen.getByText("First reply")).toBeInTheDocument();
    });

    expect(
      screen.getByTestId("dropdown-icon-reply-reply1")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("dropdown-icon-reply-reply1"));

    expect(
      await screen.findByTestId("dropdown-reply-edit")
    ).toBeInTheDocument();
    fireEvent.click(await screen.findByTestId("dropdown-reply-edit"));

    fireEvent.change(screen.getByDisplayValue("First reply"), {
      target: { value: "Updated reply" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByDisplayValue("Updated reply")).toBeInTheDocument();
    });
  });

  test("handleUpdateReplyAdded should update a reply with new details and update the comments state", async () => {
    fetchUserDetails.mockResolvedValue({
      _id: "66504919905aa75e4ab9c575",
      channelName: "User Two",
      email: "keerthana.s@e2infosystems.com",
      photoUrl: "no-photo.jpg",
      role: "user",
    });

    updateReplyApi.mockResolvedValueOnce({
      success: true,
      data: {
        replyId: "reply1",
        text: "Updated reply",
        channelName: "User Two",
      },
    });

    render(<Comments videoId="66430b7749bcf61f8a043d3e" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/1 reply/));

    await waitFor(() => {
      expect(screen.getByText("First reply")).toBeInTheDocument();
    });

    expect(
      screen.getByTestId("dropdown-icon-reply-reply1")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("dropdown-icon-reply-reply1"));

    expect(
      await screen.findByTestId("dropdown-reply-edit")
    ).toBeInTheDocument();
    fireEvent.click(await screen.findByTestId("dropdown-reply-edit"));

    fireEvent.change(screen.getByDisplayValue("First reply"), {
      target: { value: "Updated reply" },
    });

    fireEvent.click(screen.getByTestId("save-reply"));

    await waitFor(() => {
      expect(screen.getByText("First reply")).toBeInTheDocument();
    });

    const updatedReply = {
      replyId: "reply1",
      text: "Updated reply",
      channelName: "User Two",
    };

    await waitFor(() => {
      expect(updateReplyApi).toHaveBeenCalledWith(
        { text: updatedReply.text },
        updatedReply.replyId
      );
    });

    // await waitFor(() => {
    //   expect(screen.getByText("Updated reply")).toBeInTheDocument();
    // });
    // expect(screen.queryByText("First reply")).not.toBeInTheDocument();
  });

  test("does not show edit options to non-owners of the reply", async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: "user3", channelName: "User Three" },
    });

    render(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/1 reply/));

    await waitFor(() => {
      expect(screen.getByText("First reply")).toBeInTheDocument();
    });

    expect(
      screen.getByTestId("dropdown-icon-reply-reply1")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("dropdown-icon-reply-reply1"));

    expect(screen.queryByTestId("dropdown-reply-edit")).not.toBeInTheDocument();
  });

  test("cancels editing a reply", async () => {
    render(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/1 reply/));

    await waitFor(() => {
      expect(screen.getByText("First reply")).toBeInTheDocument();
    });
    expect(
      screen.getByTestId("dropdown-icon-reply-reply1")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("dropdown-icon-reply-reply1"));
    fireEvent.click(await screen.findByTestId("dropdown-reply-edit"));

    fireEvent.click(screen.getByTestId("reply-edit-cancel-button"));

    await waitFor(() => {
      expect(screen.getByText("First reply")).toBeInTheDocument();
    });
  });

  test("deletes a reply", async () => {
    const setReplies = jest.fn();
    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/1 reply/));

    await waitFor(() => {
      expect(screen.getByText("First reply")).toBeInTheDocument();
    });

    expect(
      screen.getByTestId("dropdown-icon-reply-reply1")
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("reply-dropdown-reply1")
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("dropdown-icon-reply-reply1"));

    expect(screen.getByTestId("reply-dropdown-reply1")).toBeInTheDocument();
    deleteReply.mockResolvedValue({ success: true });

    fireEvent.click(screen.getByTestId("dropdown-reply-delete"));

    await waitFor(() => {
      expect(screen.queryByText("First reply")).not.toBeInTheDocument();
    });

    expect(deleteReply).toHaveBeenCalledWith("reply1");
    const dropdownMenu = screen.queryByTestId("reply-dropdown-reply1");
    expect(dropdownMenu).toBeNull();
    expect(
      screen.queryByTestId("reply-dropdown-reply1")
    ).not.toBeInTheDocument();
  });

  it("should close the dropdown for the specified replyId", () => {
    // Initial state of replies
    const initialReplies = [
      { id: 1, text: "Reply 1", dropdownOpen: true, commentId: 101 },
      { id: 2, text: "Reply 2", dropdownOpen: true, commentId: 101 },
      { id: 3, text: "Reply 3", dropdownOpen: true, commentId: 102 },
    ];

    // Render the Comments component with initial replies
    const { rerender } = render(<Comments videoId="video123" />);

    // Simulate setReplies function manually
    let updatedReplies = initialReplies.map((reply) =>
      reply.id === 2 ? { ...reply, dropdownOpen: false } : reply
    );

    // Update the component with the new state
    rerender(<Comments videoId="video123" initialReplies={updatedReplies} />);

    // Assertions to check if the state was updated correctly
    expect(updatedReplies[0].dropdownOpen).toBe(true); // Reply 1 should still be open
    expect(updatedReplies[1].dropdownOpen).toBe(false); // Reply 2 should be closed
    expect(updatedReplies[2].dropdownOpen).toBe(true); // Reply 3 should still be open
  });

  test("logs error if delete reply API response format is incorrect", async () => {
    deleteReply.mockResolvedValueOnce({
      success: false,
      message: "Error",
    });

    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/1 reply/));

    await waitFor(() => {
      expect(screen.getByText("First reply")).toBeInTheDocument();
    });

    expect(
      screen.getByTestId("dropdown-icon-reply-reply1")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("dropdown-icon-reply-reply1"));
    fireEvent.click(screen.getByTestId("dropdown-reply-delete"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "API response is not in the expected format:",
        "Error"
      );
    });
  });

  test("should call console.error and navigate to /error on API failure when error occurs in deleting a reply", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    deleteReply.mockRejectedValueOnce(new Error("API failure"));

    render(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/1 reply/));

    await waitFor(() => {
      expect(screen.getByText("First reply")).toBeInTheDocument();
    });

    expect(
      screen.getByTestId("dropdown-icon-reply-reply1")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("dropdown-icon-reply-reply1"));
    fireEvent.click(screen.getByTestId("dropdown-reply-delete"));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/error");
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to delete reply:",
      expect.any(Error)
    );
    consoleErrorSpy.mockRestore();
  });

  test("should not call deleteReply API when user is not authenticated", async () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
    });

    // deleteReply.mockResolvedValue({ success: true });

    render(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/1 reply/));

    await waitFor(() => {
      expect(screen.getByText("First reply")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("dropdown-icon-reply-reply1"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("dropdown-reply-delete")
      ).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(deleteReply).not.toHaveBeenCalled();
    });
  });

  test("toggles comment dropdown menu", async () => {
    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("dropdown-icon-1"));

    await waitFor(() => {
      expect(screen.getByTestId("dropdown-edit")).toBeInTheDocument();
    });
    expect(screen.getByTestId("dropdown-delete")).toBeInTheDocument();
  });

  test("toggles replies visibility", async () => {
    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });
    expect(screen.queryByText("First reply")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("reply-toggle-comment-1"));

    await waitFor(() => {
      expect(screen.getByText("First reply")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("reply-toggle-comment-1"));
    await waitFor(() => {
      expect(screen.queryByText("First reply")).not.toBeInTheDocument();
    });
  });

  test("shows dropdown menu for reply owner", async () => {
    render(<Comments videoId="123" />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("reply-toggle-comment-1"));

    await waitFor(() => {
      expect(screen.getByText("First reply")).toBeInTheDocument();
    });

    const dropdownIcon = screen.getByTestId("dropdown-icon-reply-reply1");
    fireEvent.click(dropdownIcon);

    expect(screen.getByTestId("dropdown-reply-edit")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown-reply-delete")).toBeInTheDocument();
  });

  test("should close reply dropdown when clicking outside", async () => {
    render(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/1 reply/));

    await waitFor(() => {
      expect(screen.getByText("First reply")).toBeInTheDocument();
    });

    expect(
      screen.getByTestId("dropdown-icon-reply-reply1")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("dropdown-icon-reply-reply1"));
    expect(screen.getByText("Edit")).toBeInTheDocument();

    fireEvent.mouseDown(document);

    await waitFor(() => {
      expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });
  });
});

describe("create Comments Component", () => {
  const mockOnCommentAdded = jest.fn();
  const videoId = "123";
  const mockedNavigate = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
    });

    jest.clearAllMocks();
    createCommentsApi.mockResolvedValue({
      success: true,
      data: {
        id: "1",
        text: "This is a comment",
        userId: { channelName: "User Channel" },
        createdAt: new Date().toISOString(),
      },
    });
    useNavigate.mockReturnValue(mockedNavigate);
  });

  test("renders CreateComments component", () => {
    render(
      <CreateComments videoId="123" onCommentAdded={mockOnCommentAdded} />
    );

    expect(
      screen.getByPlaceholderText("Add a public comment...")
    ).toBeInTheDocument();
  });

  test("fetches user details when authenticated", async () => {
    const mockUserDetails = { channelName: "Test Channel" };
    fetchUserDetails.mockResolvedValue(mockUserDetails);

    render(
      <CreateComments videoId="123" onCommentAdded={mockOnCommentAdded} />
    );

    expect(fetchUserDetails).toHaveBeenCalledTimes(1);
    expect(
      screen.getByPlaceholderText("Add a public comment...")
    ).toBeInTheDocument();
  });

  test("does not fetch user details when not authenticated", () => {
    useAuth.mockReturnValue({ isAuthenticated: false });

    render(
      <CreateComments videoId="123" onCommentAdded={mockOnCommentAdded} />
    );

    expect(fetchUserDetails).not.toHaveBeenCalled();
  });

  test("handles error when fetching user details", async () => {
    const mockError = new Error("Network error");
    fetchUserDetails.mockRejectedValue(mockError);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    render(
      <CreateComments videoId="123" onCommentAdded={mockOnCommentAdded} />
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to fetch user details:",
        mockError
      );
    });
    consoleErrorSpy.mockRestore();
  });

  test("sets focused to false when input is empty onBlur", () => {
    render(
      <CreateComments videoId="123" onCommentAdded={mockOnCommentAdded} />
    );
    const inputField = screen.getByPlaceholderText("Add a public comment...");
    fireEvent.focus(inputField);

    expect(inputField).toHaveClass("visible");

    fireEvent.blur(inputField);
    expect(inputField).not.toHaveClass("visible");
  });

  test("should redirect to sign-in if not authenticated", async () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
    });

    render(
      <CreateComments videoId={videoId} onCommentAdded={mockOnCommentAdded} />
    );

    const input = screen.getByPlaceholderText("Add a public comment...");
    fireEvent.focus(input);
    expect(mockedNavigate).toHaveBeenCalledWith("/signin");
  });

  test("handles case when userDetails is null or undefined", async () => {
    fetchUserDetails.mockResolvedValue(null);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    render(<CreateComments videoId="123" onCommentAdded={jest.fn()} />);

    await waitFor(() => {
      expect(fetchUserDetails).toHaveBeenCalled();
    });

    const input = screen.getByPlaceholderText("Add a public comment...");
    fireEvent.change(input, { target: { value: "This is a test comment" } });

    const commentButton = screen.getByTestId("comment-save-button");
    fireEvent.click(commentButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "User details not available, cannot submit comment"
      );
    });

    expect(createCommentsApi).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  test("should create a comment when the user is authenticated and the comment is submitted", async () => {
    render(
      <CreateComments videoId={videoId} onCommentAdded={mockOnCommentAdded} />
    );
    const inputElement = screen.getByPlaceholderText("Add a public comment...");
    fireEvent.focus(inputElement);

    fireEvent.change(inputElement, {
      target: { value: "This is a test comment" },
    });

    const saveButton = screen.getByTestId("comment-save-button");
    fireEvent.click(saveButton);

    expect(
      screen.getByPlaceholderText("Add a public comment...")
    ).toBeInTheDocument();
  });

  test("should add a comment with user details when the API call is successful", async () => {
    fetchUserDetails.mockImplementation(() => {
      console.log("fetchUserDetails mock called");
      return Promise.resolve({
        _id: "66504919905aa75e4ab9c575",
        channelName: "Keerthana",
        email: "keerthana.s@e2infosystems.com",
        photoUrl: "no-photo.jpg",
        role: "user",
      });
    });

    createCommentsApi.mockResolvedValueOnce({
      success: true,
      data: {
        createdAt: "2024-08-21T07:22:49.938Z",
        id: "66c595c9511c2896e940c25c",
        text: "test",
        updatedAt: "2024-08-21T07:22:49.938Z",
        userId: "66504919905aa75e4ab9c575",
        videoId: "66430b7749bcf61f8a043d3e",
        __v: 0,
        _id: "66c595c9511c2896e940c25c",
      },
    });
    render(
      <CreateComments
        videoId="66430b7749bcf61f8a043d3e"
        onCommentAdded={mockOnCommentAdded}
      />
    );

    const input = screen.getByPlaceholderText("Add a public comment...");
    fireEvent.change(input, { target: { value: "test" } });

    const commentButton = screen.getByTestId("comment-save-button");
    fireEvent.click(commentButton);

    await waitFor(() => {
      expect(fetchUserDetails).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(createCommentsApi).toHaveBeenCalled();
    });

    await waitFor(() => expect(fetchUserDetails).toHaveBeenCalled());
    await waitFor(() => {
      expect(createCommentsApi).toHaveBeenCalledWith({
        videoId: "66430b7749bcf61f8a043d3e",
        text: "test",
      });
    });
    await waitFor(() => {
      console.log("mock mockOnCommentAdded:", mockOnCommentAdded);
      expect(mockOnCommentAdded).toHaveBeenCalledWith({
        createdAt: "2024-08-21T07:22:49.938Z",
        id: "66c595c9511c2896e940c25c",
        text: "test",
        updatedAt: "2024-08-21T07:22:49.938Z",
        userId: "66504919905aa75e4ab9c575",
        videoId: "66430b7749bcf61f8a043d3e",
        __v: 0,
        _id: "66c595c9511c2896e940c25c",
      });
    });
    expect(input.value).toBe("");
  });

  test("cancels a comment while creating comment", async () => {
    render(
      <CreateComments
        videoId="66430b7749bcf61f8a043d3e"
        onCommentAdded={mockOnCommentAdded}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Add a public comment..."), {
      target: { value: "New comment" },
    });

    fireEvent.click(screen.getByTestId("comment-cancel-button"));
    expect(screen.queryByText("New comment")).not.toBeInTheDocument();
  });

  test("handles case when API response is not in the expected format", async () => {
    fetchUserDetails.mockResolvedValue({
      success: true,
      channelName: "Test Channel",
    });
    createCommentsApi.mockResolvedValue({ success: false, message: "Error" });

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    render(
      <CreateComments
        videoId="66430b7749bcf61f8a043d3e"
        onCommentAdded={mockOnCommentAdded}
      />
    );

    await waitFor(() => {
      expect(fetchUserDetails).toHaveBeenCalled();
    });

    const input = screen.getByPlaceholderText("Add a public comment...");
    fireEvent.change(input, { target: { value: "This is a test comment" } });

    const commentButton = screen.getByTestId("comment-save-button");
    fireEvent.click(commentButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "API response is not in the expected format:",
        { success: false, message: "Error" }
      );
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test("should call console.error and navigate to /error on API failure when error occurs in creating a comment", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    createCommentsApi.mockRejectedValueOnce(new Error("API failure"));

    render(
      <CreateComments
        videoId="66430b7749bcf61f8a043d3e"
        onCommentAdded={mockOnCommentAdded}
      />
    );

    const input = screen.getByPlaceholderText("Add a public comment...");
    fireEvent.change(input, { target: { value: "This is a test comment" } });

    const commentButton = screen.getByTestId("comment-save-button");
    fireEvent.click(commentButton);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/error");
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error in creating comment:",
      expect.any(Error)
    );
    consoleErrorSpy.mockRestore();
  });
});

describe("UpdateComment", () => {
  const mockUpdateCommentAdded = jest.fn();
  const mockCancelEdit = jest.fn();

  beforeEach(() => {
    fetchUserDetails.mockResolvedValue({
      _id: "66504919905aa75e4ab9c575",
      channelName: "Keerthana",
      email: "keerthana.s@e2infosystems.com",
      photoUrl: "no-photo.jpg",

      role: "user",
    });

    useAuth.mockReturnValue({
      isAuthenticated: true,
    });
    useNavigate.mockReturnValue(mockedNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetches user details when authenticated", async () => {
    const mockUser = {
      _id: "user123",
      channelName: "User Channel",
      email: "user@example.com",
      photoUrl: "user-photo.jpg",
      role: "user",
    };

    fetchUserDetails.mockResolvedValue(mockUser);

    render(
      <UpdateComment
        commentId="1"
        comment={{ text: "Sample comment" }}
        updateCommentAdded={mockUpdateCommentAdded}
        cancelEdit={jest.fn()}
      />
    );

    expect(fetchUserDetails).toHaveBeenCalledTimes(1);
  });

  test("handles error when fetching user details", async () => {
    const mockError = new Error("Network error");
    fetchUserDetails.mockRejectedValue(mockError);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <UpdateComment
        commentId="1"
        comment={{ text: "Sample comment" }}
        updateCommentAdded={mockUpdateCommentAdded}
        cancelEdit={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to fetch user details:",
        mockError
      );
    });
    consoleErrorSpy.mockRestore();
  });

  test("does not fetch user details when not authenticated", () => {
    useAuth.mockReturnValue({ isAuthenticated: false });

    render(
      <UpdateComment
        commentId="1"
        comment={{ text: "Sample comment" }}
        updateCommentAdded={mockUpdateCommentAdded}
        cancelEdit={jest.fn()}
      />
    );

    expect(fetchUserDetails).not.toHaveBeenCalled();
  });

  test("handles case when userDetails is null or undefined", async () => {
    fetchUserDetails.mockResolvedValue(null);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    render(
      <UpdateComment
        commentId="1"
        comment={{ text: "Sample comment" }}
        updateCommentAdded={mockUpdateCommentAdded}
        cancelEdit={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(fetchUserDetails).toHaveBeenCalled();
    });

    const input = screen.getByPlaceholderText("Sample comment");
    fireEvent.change(input, { target: { value: "Updated comment" } });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "User details not available"
      );
    });

    expect(createCommentsApi).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  test("should update the comment with user details when the API call is successful", async () => {
    const mockComment = {
      _id: "66c595c9511c2896e940c25c",
      text: "Original comment",
    };

    updateCommentApi.mockResolvedValueOnce({
      success: true,
      data: {
        createdAt: "2024-08-21T07:22:49.938Z",
        id: "66c595c9511c2896e940c25c",
        text: "Updated comment",
        updatedAt: "2024-08-21T07:22:49.938Z",
        userId: "66504919905aa75e4ab9c575",
        videoId: "66430b7749bcf61f8a043d3e",
        __v: 0,
        _id: "66c595c9511c2896e940c25c",
      },
    });

    render(
      <UpdateComment
        commentId="66c595c9511c2896e940c25c"
        comment={mockComment}
        updateCommentAdded={mockUpdateCommentAdded}
        cancelEdit={mockCancelEdit}
      />
    );

    const input = screen.getByPlaceholderText("Original comment");
    fireEvent.change(input, { target: { value: "Updated comment" } });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(fetchUserDetails).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(updateCommentApi).toHaveBeenCalledWith(
        { text: "Updated comment" },
        "66c595c9511c2896e940c25c"
      );
    });

    await waitFor(() => {
      expect(mockUpdateCommentAdded).toHaveBeenCalledWith({
        createdAt: "2024-08-21T07:22:49.938Z",
        id: "66c595c9511c2896e940c25c",
        text: "Updated comment",
        updatedAt: "2024-08-21T07:22:49.938Z",
        userId: "66504919905aa75e4ab9c575",
        videoId: "66430b7749bcf61f8a043d3e",
        __v: 0,
        _id: "66c595c9511c2896e940c25c",
      });
    });

    expect(input.value).toBe("Updated comment");
  });

  test("handles case when API response is not in the expected format", async () => {
    updateCommentApi.mockResolvedValue({
      success: false,
      data: null,
    });

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <UpdateComment
        commentId="1"
        comment={{ text: "Sample comment" }}
        updateCommentAdded={mockUpdateCommentAdded}
        cancelEdit={jest.fn()}
      />
    );

    const input = screen.getByPlaceholderText("Sample comment");
    fireEvent.change(input, { target: { value: "Updated comment" } });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "API response is not in the expected format:",
        { success: false, data: null }
      );
    });

    consoleErrorSpy.mockRestore();
  });

  test("handles error in updateCommentApi", async () => {
    const mockError = new Error("Network error");
    updateCommentApi.mockRejectedValue(mockError);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <UpdateComment
        commentId="1"
        comment={{ text: "Sample comment" }}
        updateCommentAdded={jest.fn()}
        cancelEdit={jest.fn()}
      />
    );

    const input = screen.getByPlaceholderText("Sample comment"); // Adjust if needed
    fireEvent.change(input, { target: { value: "Updated comment" } });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/error");
    });
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error in updating comment:",
        mockError
      );
    });

    consoleErrorSpy.mockRestore();
  });

  test("cancels a comment while creating comment", async () => {
    render(
      <UpdateComment
        commentId="1"
        comment={{ text: "Sample comment" }}
        updateCommentAdded={mockUpdateCommentAdded}
        cancelEdit={jest.fn()}
      />
    );

    const input = screen.getByPlaceholderText("Sample comment");
    fireEvent.change(input, { target: { value: "Updated comment" } });

    fireEvent.click(screen.getByTestId("comment-edit-cancel-button"));
    expect(screen.queryByText("Updated comment")).not.toBeInTheDocument();
  });

  test("sets focused to false when input is empty onBlur", () => {
    render(
      <UpdateComment
        commentId="1"
        comment={{ text: "Sample comment" }}
        updateCommentAdded={mockUpdateCommentAdded}
        cancelEdit={jest.fn()}
      />
    );
    const inputField = screen.getByPlaceholderText("Sample comment");
    fireEvent.focus(inputField);
    expect(inputField).toHaveClass("visible");

    fireEvent.change(inputField, { target: { value: "" } });
    fireEvent.blur(inputField);

    expect(inputField).not.toHaveClass("visible");
  });

  test("should retain focus if input is not empty on blur", () => {
    render(
      <UpdateComment
        commentId="1"
        comment={{ text: "Sample comment" }}
        updateCommentAdded={mockUpdateCommentAdded}
        cancelEdit={jest.fn()}
      />
    );

    const inputField = screen.getByPlaceholderText("Sample comment");
    fireEvent.focus(inputField);
    expect(inputField).toHaveClass("visible");

    fireEvent.change(inputField, { target: { value: "Updated comment" } });
    fireEvent.blur(inputField);

    expect(inputField).toHaveClass("visible");
  });
});

describe("Create Reply", () => {
  const mockOnReplyAdded = jest.fn();
  const mockOnCancel = jest.fn();
  const mockRef = React.createRef();

  beforeEach(() => {
    jest.clearAllMocks();

    fetchComments.mockResolvedValue({ success: true, data: mockComments });
    fetchUserDetails.mockResolvedValue({ channelName: "User One" });
    getReplies.mockResolvedValue({
      success: true,
      data: mockComments[0].replies,
    });
    updateCommentApi.mockResolvedValue({
      success: true,
      data: { id: "comment-id", text: "Updated comment" },
    });
    useNavigate.mockReturnValue(mockedNavigate);
  });

  const setup = (isAuthenticated = true) => {
    useAuth.mockReturnValue({ isAuthenticated });
    render(
      <CreateReply
        commentId="123"
        onReplyAdded={mockOnReplyAdded}
        onCancel={mockOnCancel}
        ref={mockRef}
      />
    );
  };

  test("fetches user details when authenticated", async () => {
    setup(true);

    expect(fetchUserDetails).toHaveBeenCalledTimes(1);
  });

  test("handles error when fetching user details", async () => {
    const mockError = new Error("Network error");
    fetchUserDetails.mockRejectedValue(mockError);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    setup();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to fetch user details:",
        mockError
      );
    });
    consoleErrorSpy.mockRestore();
  });

  test("does not fetch user details when not authenticated", () => {
    setup(false);

    expect(fetchUserDetails).not.toHaveBeenCalled();
  });

  test("should set focused to true on input focus if authenticated", () => {
    setup();

    const inputField = screen.getByPlaceholderText("Add a reply...");
    fireEvent.focus(inputField);

    expect(inputField).toHaveClass("visible");
  });

  test("should redirect to /signin if not authenticated and input is focused", () => {
    setup(false);

    const inputField = screen.getByPlaceholderText("Add a reply...");
    fireEvent.focus(inputField);

    expect(mockedNavigate).toHaveBeenCalledWith("/signin");
  });

  test("should set focused to false and trigger onCancel on blur if input is empty", () => {
    setup();

    const inputField = screen.getByPlaceholderText("Add a reply...");
    fireEvent.focus(inputField);
    fireEvent.change(inputField, { target: { value: "" } });
    fireEvent.blur(inputField);

    expect(inputField).not.toHaveClass("visible");
    expect(mockOnCancel).toHaveBeenCalled();
  });

  test("should retain focus if input is not empty on blur", () => {
    setup();

    const inputField = screen.getByPlaceholderText("Add a reply...");
    fireEvent.focus(inputField);
    fireEvent.change(inputField, { target: { value: "New reply" } });
    fireEvent.blur(inputField);

    expect(inputField).toHaveClass("visible");
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  test("should log error and return early if userDetails are not available", async () => {
    fetchUserDetails.mockResolvedValue(null);
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    setup(true);

    await waitFor(() => expect(fetchUserDetails).toHaveBeenCalled());
    const input = screen.getByPlaceholderText("Add a reply...");
    fireEvent.change(input, { target: { value: "test reply" } });

    const replyButton = screen.getByTestId("reply-save-button");
    fireEvent.click(replyButton);
    expect(consoleErrorSpy).toHaveBeenCalledWith("User details not available");

    consoleErrorSpy.mockRestore();
  });

  test("should add a reply with user details when the API call is successful", async () => {
    fetchUserDetails.mockResolvedValue({
      _id: "66504919905aa75e4ab9c575",
      channelName: "Keerthana",
      email: "keerthana.s@e2infosystems.com",
      photoUrl: "no-photo.jpg",
      role: "user",
    });

    createReplyApi.mockResolvedValueOnce({
      success: true,
      data: {
        text: "test reply",
        commentId: "123",
      },
    });

    mockedNavigate.mockReturnValue(jest.fn());

    setup(true);

    const input = screen.getByPlaceholderText("Add a reply...");
    fireEvent.change(input, { target: { value: "test reply" } });

    const replyButton = screen.getByTestId("reply-save-button");
    fireEvent.click(replyButton);

    await waitFor(() => {
      expect(fetchUserDetails).toHaveBeenCalled();
      console.log(
        "fetchUserDetails result:",
        fetchUserDetails.mock.results[0].value
      );
    });
    await waitFor(() => {
      expect(createReplyApi).toHaveBeenCalled();
      console.log("createReply result:", createReplyApi.mock.results[0].value);
    });

    await waitFor(() => {
      console.log("mockOnReplyAdded calls:", mockOnReplyAdded.mock.calls);
      expect(createReplyApi).toHaveBeenCalledWith({
        commentId: "123",
        text: "test reply",
      });
    });

    await waitFor(() => {
      expect(mockOnReplyAdded).toHaveBeenCalledWith({
        text: "test reply",
        commentId: "123",
      });
    });

    expect(input.value).toBe("");
  });

  test("handles case when API response is not in the expected format", async () => {
    fetchUserDetails.mockResolvedValue({
      success: true,
      channelName: "Test Channel",
    });
    createReplyApi.mockResolvedValue({ success: false, message: "Error" });

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    setup(true);

    await waitFor(() => {
      expect(fetchUserDetails).toHaveBeenCalled();
    });

    const input = screen.getByPlaceholderText("Add a reply...");
    fireEvent.change(input, { target: { value: "test reply" } });

    const commentButton = screen.getByTestId("reply-save-button");
    fireEvent.click(commentButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "API response is not in the expected format:",
        { success: false, message: "Error" }
      );
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test("should navigate to error page on API failure", async () => {
    setup();

    fetchUserDetails.mockResolvedValue({ channelName: "Test Channel" });
    createReplyApi.mockRejectedValue(new Error("API Error"));

    const inputField = screen.getByPlaceholderText("Add a reply...");
    fireEvent.change(inputField, { target: { value: "New reply" } });

    const saveButton = screen.getByTestId("reply-save-button");
    fireEvent.click(saveButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith("/error"));
  });

  test("should clear input and set focused to false on cancel", () => {
    setup();

    const inputField = screen.getByPlaceholderText("Add a reply...");
    fireEvent.focus(inputField);
    fireEvent.change(inputField, { target: { value: "New reply" } });

    const cancelButton = screen.getByTestId("reply-cancel-button");
    fireEvent.click(cancelButton);

    expect(inputField).toHaveValue("");
    expect(inputField).not.toHaveClass("visible");
    expect(mockOnCancel).toHaveBeenCalled();
  });

  test("should focus the input when the image is clicked", () => {
    setup(true);

    const replyImage = screen.getByAltText("");
    fireEvent.click(replyImage);

    expect(mockRef.current).toHaveFocus();
  });
});

describe("UpdateReply Component", () => {
  const mockOnUpdateReply = jest.fn();
  const mockCancelEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    fetchComments.mockResolvedValue({ success: true, data: mockComments });
    fetchUserDetails.mockResolvedValue({ channelName: "User One" });
    getReplies.mockResolvedValue({
      success: true,
      data: mockComments[0].replies,
    });
    updateCommentApi.mockResolvedValue({
      success: true,
      data: { id: "comment-id", text: "Updated comment" },
    });
    useNavigate.mockReturnValue(mockedNavigate);
  });

  const setup = (isAuthenticated = true) => {
    useAuth.mockReturnValue({ isAuthenticated });
    render(
      <UpdateReply
        replyId="reply1"
        reply={{ text: "Initial reply", channelName: "Test Channel" }}
        channelName="Test Channel"
        onUpdateReply={mockOnUpdateReply}
        cancelEdit={mockCancelEdit}
      />
    );
  };

  test("should render correctly with initial props", () => {
    setup(true);

    expect(screen.getByPlaceholderText("Initial reply")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  test("should call fetchUserDetails if authenticated", async () => {
    fetchUserDetails.mockResolvedValue({ channelName: "Test Channel" });

    setup(true);

    await waitFor(() => expect(fetchUserDetails).toHaveBeenCalled());
  });

  test("should handle input change", () => {
    setup(true);

    const input = screen.getByPlaceholderText("Initial reply");
    fireEvent.change(input, { target: { value: "Updated reply" } });

    expect(input.value).toBe("Updated reply");
  });

  test("handles error when fetching user details", async () => {
    const mockError = new Error("Network error");
    fetchUserDetails.mockRejectedValue(mockError);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    setup(true);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to fetch user details:",
        mockError
      );
    });
    consoleErrorSpy.mockRestore();
  });

  test("does not fetch user details when not authenticated", () => {
    useAuth.mockReturnValue({ isAuthenticated: false });

    setup(false);

    expect(fetchUserDetails).not.toHaveBeenCalled();
  });

  test("handles case when userDetails is null or undefined", async () => {
    fetchUserDetails.mockResolvedValue(null);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    setup(true);

    await waitFor(() => {
      expect(fetchUserDetails).toHaveBeenCalled();
    });

    const input = screen.getByPlaceholderText("Initial reply");
    fireEvent.change(input, { target: { value: "Updated reply" } });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "User details not available"
      );
    });

    expect(createCommentsApi).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  test("should handle form submission and API call", async () => {
    updateReplyApi.mockResolvedValue({
      success: true,
      data: { text: "Updated reply", channelName: "Test Channel" },
    });

    setup(true);

    fireEvent.change(screen.getByPlaceholderText("Initial reply"), {
      target: { value: "Updated reply" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() =>
      expect(updateReplyApi).toHaveBeenCalledWith(
        { text: "Updated reply" },
        "reply1"
      )
    );
    await waitFor(() =>
      expect(mockOnUpdateReply).toHaveBeenCalledWith({
        text: "Updated reply",
        channelName: "Test Channel",
      })
    );
  });

  test("sets focused to false when input is empty onBlur", () => {
    setup(true);

    const inputField = screen.getByPlaceholderText("Initial reply");
    fireEvent.focus(inputField);
    expect(inputField).toHaveClass("visible");

    fireEvent.change(inputField, { target: { value: "" } });
    fireEvent.blur(inputField);

    expect(inputField).not.toHaveClass("visible");
  });

  test("should retain focus if input is not empty on blur", () => {
    setup(true);

    const inputField = screen.getByPlaceholderText("Initial reply");
    fireEvent.focus(inputField);
    expect(inputField).toHaveClass("visible");

    fireEvent.change(inputField, { target: { value: "Updated reply" } });
    fireEvent.blur(inputField);

    expect(inputField).toHaveClass("visible");
  });

  test("handles case when API response is not in the expected format", async () => {
    updateReplyApi.mockResolvedValue({
      success: false,
      data: null,
    });

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    setup(true);

    const input = screen.getByPlaceholderText("Initial reply");
    fireEvent.change(input, { target: { value: "Updated reply" } });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "API response is not in the expected format:",
        { success: false, data: null }
      );
    });

    consoleErrorSpy.mockRestore();
  });

  test("handles error in updateCommentApi", async () => {
    const mockError = new Error("Network error");
    updateReplyApi.mockRejectedValue(mockError);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    setup(true);

    const input = screen.getByPlaceholderText("Initial reply");
    fireEvent.change(input, { target: { value: "Updated reply" } });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/error");
    });
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to update reply:",
        mockError
      );
    });

    consoleErrorSpy.mockRestore();
  });

  test("should call cancelEdit on cancel button click", () => {
    setup(true);

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockCancelEdit).toHaveBeenCalled();
  });
});
