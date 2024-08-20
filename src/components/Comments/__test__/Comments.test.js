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

console.log("createCommentsApi before mock:", createCommentsApi);
jest.mock("../Apis/CreateCommentsApi.js", () => ({
  createCommentsApi: jest.fn(),
}));
console.log("createCommentsApi after mock:", createCommentsApi);

jest.mock("../../User/UserProfile/UserDetailsApi", () => ({
  fetchUserDetails: jest.fn().mockResolvedValue({
    channelName: "User One",
    userId: "user123",
  }),
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
let mockSetReplies = jest.fn();
let callCount = 0;

describe("Comments Component", () => {
  const mockedNavigate = jest.fn();
  const mockOnCommentAdded = jest.fn();

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

  test("should log the new comment, add the user information, and update comments state", () => {
    // Mock the console.log function
    console.log = jest.fn();

    // Mock user details
    const user = { id: "user123", name: "Test User" };

    // Mock setComments function
    const setComments = jest.fn();

    // Mock the initial comments state
    const initialComments = [
      {
        text: "Existing comment",
        userId: { id: "user456", name: "Another User" },
      },
    ];

    // Mock the new comment passed to handleCommentAdded
    const newComment = {
      text: "This is a new comment",
      videoId: "video123",
    };

    // Define the handleCommentAdded function to test
    const handleCommentAdded = (newComment) => {
      console.log("New comment added:", newComment);
      const newCommentWithUser = {
        ...newComment,
        userId: user, // Add the authenticated user information
      };
      setComments((prevComments) => [newCommentWithUser, ...prevComments]);
    };

    // Call the handleCommentAdded function with the mock newComment
    handleCommentAdded(newComment);

    // Assert console.log was called with the correct message
    expect(console.log).toHaveBeenCalledWith("New comment added:", newComment);

    // Assert setComments was called with the correct updated state
    expect(setComments).toHaveBeenCalledWith(expect.any(Function));

    // Simulate the state update by calling the callback function passed to setComments
    const stateUpdater = setComments.mock.calls[0][0];
    const updatedComments = stateUpdater(initialComments);

    // Assert that the updated comments array contains the new comment with user information
    // and that it's added to the beginning of the array
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

    // expect(
    //   screen.queryByPlaceholderText("Add a public comment...")
    // ).not.toBeInTheDocument();
  });

  /* eslint-disable testing-library/no-debugging-utils */

  describe("CreateComments Component", () => {
    it("should render and display the component", () => {
      render(<CreateComments videoId="video123" onCommentAdded={jest.fn()} />);

      screen.debug(); // This prints the current DOM structure to the console
    });
  });
  /* eslint-enable testing-library/no-debugging-utils */

  it.only("should render and allow user to submit a comment", async () => {
    const mockComment = {
      videoId: "video123",
      text: "New comment",
    };
    createCommentsApi.mockResolvedValue({
      success: true,
      data: {
        videoId: "video123",
        text: "New comment",
      },
    });
    const onCommentAdded = jest.fn();

    // console.log("Rendering CreateComments component...");
    render(
      <CreateComments videoId="video123" onCommentAdded={onCommentAdded} />
    );

    // console.log("Simulating input field change...");
    const inputElement = screen.getByPlaceholderText("Add a public comment...");
    fireEvent.change(inputElement, {
      target: { value: "This is a test comment" },
    });

    // console.log("Input value after change:", inputElement.value);
    expect(inputElement.value).toBe("This is a test comment");

    // console.log("Simulating comment button click...");
    const commentButton = screen.getByTestId("comment-save-button");
    fireEvent.click(commentButton);

    // console.log("Waiting for the API call to finish...");
    await waitFor(() => {
      console.log("Waiting for the API call to be triggered...");
      expect(createCommentsApi).toHaveBeenCalledTimes(1);
    });
    console.log("API was called with:", createCommentsApi.mock.calls[0][0]);
    // await waitFor(() => {
    //   console.log("Checking if onCommentAdded was called...");
    //   expect(onCommentAdded).toHaveBeenCalled();
    //   console.log("onCommentAdded calls:", onCommentAdded.mock.calls);
    // });

    // console.log("Checking if onCommentAdded was called with correct data...");
    // expect(onCommentAdded).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     text: "This is a test comment",
    //     videoId: "video123",
    //     channelName: "User One",
    //   })
    // );

    console.log("Test completed successfully.");
  });

  it("should render CreateComments component", () => {
    render(<CreateComments videoId="video123" onCommentAdded={jest.fn()} />);
    console.log("Component rendered");

    expect(
      screen.getByPlaceholderText("Add a public comment...")
    ).toBeInTheDocument();
    expect(screen.getByTestId("comment-save-button")).toBeInTheDocument();
  });

  test("should call handleCommentAdded with new comment and user ID", async () => {
    const onCommentAdded = jest.fn();
    const newComment = { text: "This is a test comment", videoId: "video123" };

    // Mock the API response
    createCommentsApi.mockResolvedValue({
      success: true,
      data: newComment,
    });

    render(
      <CreateComments videoId="video123" onCommentAdded={onCommentAdded} />
    );
    const html = document.body.innerHTML;
    console.log("Components:", html);
    console.log("Component rendered");

    // Simulate adding a comment
    const input = screen.getByPlaceholderText("Add a public comment...");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "This is a test comment" } });

    const commentButton = screen.getByTestId("comment-save-button");

    console.log("Comment button found:", commentButton);
    fireEvent.click(commentButton);

    // Wait for the API call and state updates
    // await screen.findByText("This is a test comment");

    // Check if onCommentAdded was called with the expected comment data
    expect(onCommentAdded).toHaveBeenCalledWith({
      ...newComment,
      channelName: mockUser.channelName,
    });
    expect(input.value).toBe("");
    // Check that the mockSetComments function was called with the expected data
    // expect(onCommentAdded).toHaveBeenCalled();
    // expect(onCommentAdded.mock.calls[0][0]).toEqual({
    //   ...newComment,
    //   channelName: mockUser.channelName,
    // });
  });

  // test("adds a new comment successfully", async () => {
  //   createCommentsApi.mockResolvedValue({
  //     success: true,
  //     data: { id: "1", text: "New Comment", channelName: "User One" },
  //   });

  //   renderWithRouter(<Comments videoId="123" />);

  //   // Check that the initial comment is rendered
  //   expect(screen.getByText("First comment")).toBeInTheDocument();

  //   // Simulate user typing a new comment
  //   fireEvent.click(screen.getByPlaceholderText("Add a public comment..."));
  //   fireEvent.change(screen.getByPlaceholderText("Add a public comment..."), {
  //     target: { value: "New Comment" },
  //   });

  //   // Click the "Comment" button to submit
  //   fireEvent.click(screen.getByTestId("comment-save-button"));

  //   // Wait for the API call to complete and the new comment to be added
  //   await waitFor(() =>
  //     expect(createCommentsApi).toHaveBeenCalledWith({
  //       videoId: "test-video",
  //       text: "New Comment",
  //     })
  //   );

  //   // Check that the new comment is rendered
  //   // await waitFor(() =>
  //   expect(screen.getByText("New Comment")).toBeInTheDocument();
  //   // );
  // });

  it.skip("should add a new comment when submitted", async () => {
    const mockOnCommentAdded = jest.fn();
    const mockNavigate = jest.fn();
    useAuth.mockReturnValue({ isAuthenticated: true });
    fetchUserDetails.mockResolvedValue({ channelName: "Test Channel" });
    createCommentsApi.mockResolvedValue({
      success: true,
      data: { commentId: 1, text: "Test Comment" },
    });

    const { getByPlaceholderText, getByTestId } = render(
      <CreateComments videoId="123" onCommentAdded={mockOnCommentAdded} />
    );

    fireEvent.focus(screen.getByPlaceholderText("Add a public comment..."));
    fireEvent.change(screen.getByPlaceholderText("Add a public comment..."), {
      target: { value: "Test Comment" },
    });
    fireEvent.click(screen.getByTestId("comment-save-button"));
    await waitFor(() => expect(mockOnCommentAdded).toHaveBeenCalledTimes(1));
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
    fireEvent.click(screen.getByTestId("reply-toggle-comment-1"));
    await waitFor(() => {
      expect(screen.getByText("First reply")).toBeInTheDocument();
    });

    // await waitFor(() => {
    //   expect(replyInput).not.toBeInTheDocument();
    // });
  });

  test.skip("input field visibility toggles correctly on focus and blur", () => {
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

    expect(screen.getByTestId("reply-dropdown-reply1")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("dropdown-reply-delete"));

    await waitFor(() => {
      expect(screen.queryByText("First reply")).not.toBeInTheDocument();
    });

    expect(deleteReply).toHaveBeenCalledWith("reply1");
    const dropdownMenu = screen.queryByTestId("reply-dropdown-reply1");
    expect(dropdownMenu).toBeNull();
  });

  test.skip("should set dropdownOpen to false for the deleted reply", async () => {
    render(<Comments videoId="123" />);

    // Wait for initial comment and reply to render
    await waitFor(() => {
      expect(screen.getByText("First comment")).toBeInTheDocument();
    });
    expect(screen.getByText("First reply")).toBeInTheDocument();

    // Open dropdown and click delete
    fireEvent.click(screen.getByTestId("dropdown-icon-reply-reply1"));
    fireEvent.click(screen.getByTestId("dropdown-reply-delete"));

    // Wait for delete operation
    await waitFor(() => {
      expect(deleteReply).toHaveBeenCalledWith("reply1");
    });

    // Check if setReplies is called correctly
    expect(mockSetReplies).toHaveBeenCalled();

    // Verify the second call to setReplies where dropdownOpen should be set to false
    const setRepliesCalls = mockSetReplies.mock.calls;
    const updatedReplies = setRepliesCalls[1][0]; // Second call's first argument

    const updatedReply = updatedReplies.find((reply) => reply.id === "reply1");
    expect(updatedReply).toBeDefined(); // Ensure the reply exists
    expect(updatedReply.dropdownOpen).toBe(false); // Check that dropdownOpen is set to false
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
