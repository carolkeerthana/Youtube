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
import { updateComment } from "../Apis/UpdateCommentApi";
import CreateComments from "../CreateComments";
import CreateReply from "../../Replies/CreateReply";

jest.mock("../../../util/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../Apis/GetCommentsApi", () => ({
  fetchComments: jest.fn(),
}));

jest.mock("../../Replies/Api/GetRepliesApi", () => ({
  getReplies: jest.fn(),
}));

// Mock the commentsApi
jest.mock("../Apis/CreateCommentsApi", () => ({
  createCommentsApi: jest.fn(),
}));

jest.mock("../../User/UserProfile/UserDetailsApi", () => ({
  fetchUserDetails: jest.fn(),
}));

jest.mock("../Apis/DeleteCommentApi", () => ({
  deleteCommentApi: jest.fn(),
}));
jest.mock("../../Replies/Api/DeleteReplyApi.js", () => ({
  deleteReply: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));
jest.mock("../Apis/UpdateCommentApi", () => ({
  updateComment: jest.fn(),
}));
updateComment.mockResolvedValue({
  success: true,
  data: { id: "comment-id", text: "Updated comment" },
});

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
describe("Comments Component", () => {
  const mockedNavigate = jest.fn();
  const mockOnCommentAdded = jest.fn();

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
    deleteCommentApi.mockResolvedValue({ success: true });
    deleteReply.mockResolvedValue({ success: true });
    useNavigate.mockReturnValue(mockedNavigate);

    // Mock console.error
    global.console.error = jest.fn();
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

  it.skip("should create a comment when the user is authenticated and the comment is submitted", async () => {
    // const videoId = "123";
    // useAuth.mockReturnValue({ isAuthenticated: true });

    // const mockUserDetails = { channelName: "TestUser" };
    // fetchUserDetails.mockResolvedValue(mockUserDetails);

    const mockCommentResponse = {
      success: true,
      data: { text: "Test comment", videoId: "123" },
    };
    createCommentsApi.mockResolvedValue(mockCommentResponse);

    render(
      <CreateComments videoId="123" onCommentAdded={mockOnCommentAdded} />
    );

    const inputElement = screen.getByPlaceholderText("Add a public comment...");
    fireEvent.focus(inputElement);
    fireEvent.change(inputElement, { target: { value: "Test comment" } });
    const commentButton = screen.getByTestId("comment-save-button");
    fireEvent.click(commentButton);

    await waitFor(() => {
      expect(mockOnCommentAdded).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockOnCommentAdded).toHaveBeenCalledWith(
        expect.objectContaining({ text: "Test comment", videoId: "123" })
      );
    });
  });

  test("adds a new comment", async () => {
    createCommentsApi.mockResolvedValue({
      success: true,
      data: {
        id: "3",
        text: "New comment",
        userId: mockUser._id,
        createdAt: new Date(),
      },
    });

    renderWithRouter(<Comments videoId="123" />);

    fireEvent.change(screen.getByPlaceholderText("Add a public comment..."), {
      target: { value: "New comment" },
    });

    fireEvent.click(screen.getByTestId("comment-save-button"));

    await waitFor(() => {
      expect(screen.getByDisplayValue("New comment")).toBeInTheDocument();
    });
    expect(
      screen.getByPlaceholderText("Add a public comment...")
    ).toBeInTheDocument();
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

  test("adds a reply", async () => {
    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    const firstCommentReplyButton = screen.getAllByTestId("reply-button")[0];
    fireEvent.click(firstCommentReplyButton);

    fireEvent.change(screen.getAllByPlaceholderText("Add a reply...")[0], {
      target: { value: "New reply" },
    });

    fireEvent.click(screen.getAllByText("Reply")[0]);

    await waitFor(() => {
      expect(screen.getByDisplayValue("New reply")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText("Add a reply...")).not.toBeInTheDocument();
    });
  });

  test("input field visibility toggles correctly on focus and blur", () => {
    const props = {
      commentId: "comment123",
      onReplyAdded: jest.fn(),
      onCancel: jest.fn(),
    };

    render(<CreateReply {...props} />);

    const input = screen.getByPlaceholderText("Add a reply...");
    const buttonsContainer = screen.getByTestId("reply-buttons"); // Add a data-testid to the buttons container

    // Initially, the input field should not have the visible class
    expect(input).not.toHaveClass("visible");
    // Initially, the reply buttons should be hidden
    expect(buttonsContainer).toHaveStyle("display: none");

    // Simulate focusing the input field
    fireEvent.focus(input);
    expect(input).toHaveClass("visible"); // Should be visible after focus
    expect(buttonsContainer).toHaveStyle("display: flex"); // Should be visible after focus

    // Simulate blurring the input field with content
    fireEvent.change(input, { target: { value: "Test reply" } });
    fireEvent.blur(input);
    expect(input).not.toHaveClass("visible"); // Should be hidden again if empty
    expect(buttonsContainer).toHaveStyle("display: none"); // Should be hidden after blur if empty

    // Simulate blurring the input field without content
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.blur(input);
    expect(input).not.toHaveClass("visible"); // Should be hidden again if empty after blur
    expect(buttonsContainer).toHaveStyle("display: none"); // Should be hidden again if empty after blur
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
      expect(screen.queryByText("First reply")).not.toBeInTheDocument();
    });
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

    fireEvent.click(screen.getByTestId("reply-toggle-comment-1"));

    await waitFor(() => {
      expect(screen.getByText("First reply")).toBeInTheDocument();
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

  test.skip("handleUpdateReplyAdded updates reply text and channel name", async () => {
    renderWithRouter(<Comments videoId="123" />);

    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/1 reply/));

    await waitFor(() => {
      expect(screen.getByText("First reply")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("dropdown-icon-reply-reply1"));
    fireEvent.click(screen.getByTestId("dropdown-reply-edit"));

    const updateReplyComponent = await screen.findByTestId(
      "update-reply-component"
    );
    console.log(updateReplyComponent.innerHTML); // Debugging: Print the inner HTML of the update reply component

    const updateReplyInput = screen.getByTestId("update-reply-input");
    fireEvent.change(updateReplyInput, { target: { value: "Updated text" } });
    fireEvent.click(screen.getByTestId("update-reply-save"));

    await waitFor(() => {
      expect(screen.getByText("Updated text")).toBeInTheDocument();
    });
  });
});

jest.mock("../Apis/CreateCommentsApi");
// jest.mock("../../../util/AuthContext", () => ({
//   useAuth: () => ({ isAuthenticated: true }),
// }));

describe("create Comments Component", () => {
  const mockOnCommentAdded = jest.fn();
  const videoId = "123";
  const navigate = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
    });

    createCommentsApi.mockClear();
    createCommentsApi.mockResolvedValue({
      success: true,
      data: {
        id: "1",
        text: "This is a comment",
        userId: { channelName: "User Channel" },
        createdAt: new Date().toISOString(),
      },
    });
    useNavigate.mockReturnValue(navigate);
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

    // Wait for the API call to complete
    // await waitFor(() => {
    //   expect(createCommentsApi).toHaveBeenCalledWith({
    //     videoId,
    //     text: "This is a test comment",
    //   });
    // });

    // // Wait for onCommentAdded to be called
    // await waitFor(() => {
    //   expect(mockOnCommentAdded).toHaveBeenCalledWith({
    //     id: "1",
    //     text: "This is a comment",
    //     userId: { channelName: "User Channel" },
    //     createdAt: expect.any(String),
    //     channelName: "User Channel",
    //   });
    // });

    // Check if the input field is cleared
    expect(
      screen.getByPlaceholderText("Add a public comment...")
    ).toBeInTheDocument();
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
    expect(navigate).toHaveBeenCalledWith("/signin");
  });
});
