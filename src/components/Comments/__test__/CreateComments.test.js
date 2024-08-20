import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext, AuthProvider, useAuth } from "../../../util/AuthContext";
import CreateComments from "../CreateComments";
import userEvent from "@testing-library/user-event";
import { fetchUserDetails } from "../../User/UserProfile/UserDetailsApi";
import { commentsApi, createCommentsApi } from "../Apis/CreateCommentsApi";

jest.mock("../../../util/AuthContext.js", () => ({
  useAuth: jest.fn(),
}));

const mockUser = { id: "user1", channelName: "User One" };
jest.mock("../../User/UserProfile/UserDetailsApi", () => ({
  fetchUserDetails: jest.fn().mockResolvedValue({
    channelName: "User One",
    userId: "user123",
  }),
}));

jest.mock("../Apis/CreateCommentsApi.js", () => ({
  createCommentsApi: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderComponent = (isAuthenticated, onCommentAdded) => {
  return render(
    <Router>
      <AuthProvider value={{ isAuthenticated }}>
        <CreateComments videoId="12345" onCommentAdded={onCommentAdded} />
      </AuthProvider>
    </Router>
  );
};

describe("CreateComments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      isAuthenticated: true,
    });
  });

  test("renders correctly", () => {
    renderComponent(false);
    expect(
      screen.getByPlaceholderText("Add a public comment...")
    ).toBeInTheDocument();
  });

  test("updates input value on change", () => {
    renderComponent(true);
    const input = screen.getByPlaceholderText("Add a public comment...");
    userEvent.type(input, "Test Comment");
    expect(input).toHaveValue("Test Comment");
  });

  test("navigates to signin when not authenticated and trying to focus", () => {
    renderComponent(false);
    const input = screen.getByPlaceholderText("Add a public comment...");
    userEvent.click(input);
    expect(mockNavigate).toHaveBeenCalledWith("/signin");
  });

  test.skip("fetches user details and handles comment submission", async () => {
    fetchUserDetails.mockResolvedValue({
      _id: "userId",
      channelName: "testChannel",
    });

    commentsApi.mockResolvedValue({
      success: true,
      data: {
        text: "Test Comment",
        createdAt: "2024-07-09T00:00:00Z",
      },
    });

    const onCommentAdded = jest.fn();
    renderComponent(true, onCommentAdded);

    const input = screen.getByPlaceholderText("Add a public comment...");
    userEvent.type(input, "Test Comment");
    const commentButton = screen.getByText("COMMENT");

    userEvent.click(commentButton);

    await waitFor(() =>
      expect(onCommentAdded).toHaveBeenCalledWith(
        expect.objectContaining({
          text: "Test Comment",
          channelName: "testChannel",
        })
      )
    );
  });

  test.skip("cancels comment correctly", () => {
    renderComponent(true);
    const input = screen.getByPlaceholderText("Add a public comment...");
    userEvent.type(input, "Test Comment");
    const cancelButton = screen.getByText("CANCEL");
    userEvent.click(cancelButton);
    expect(input).toHaveValue("");
    expect(screen.queryByText("CANCEL")).not.toBeVisible();
  });

  test.only("successfully creates a comment", async () => {

    useAuth.mockReturnValue({ isAuthenticated: true });
    fetchUserDetails.mockResolvedValue({ channelName: "User One" });
    createCommentsApi.mockResolvedValue({
      success: true,
      data: { videoId: 12345, text: "This is a test comment" },
    });

    const mockOnCommentAdded = jest.fn();

    render(
      <Router>
        <CreateComments videoId="12345" onCommentAdded={mockOnCommentAdded} />
      </Router>
    );

    // Simulate user interaction
    const inputField = screen.getByPlaceholderText("Add a public comment...");
    fireEvent.focus(inputField);
    fireEvent.change(inputField, {
      target: { value: "This is a test comment" },
    });

    // Click the Comment button
    const commentButton = screen.getByTestId("comment-save-button");
    fireEvent.click(commentButton);

    // Wait for the async operation to complete
    await waitFor(() =>
      expect(mockOnCommentAdded).toHaveBeenCalledWith({
        videoId: 12345,
        text: "This is a test comment",
      })
    );

    // Check if the input field is cleared after comment submission
    expect(inputField).toHaveValue("");
  });

  test.only("renders CreateComments component", () => {
    render(
      <Router>
        <CreateComments videoId="12345" onCommentAdded={() => {}} />
      </Router>
    );
    expect(
      screen.getByPlaceholderText("Add a public comment...")
    ).toBeInTheDocument();
  });
});
