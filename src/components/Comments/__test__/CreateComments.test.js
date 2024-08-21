import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  BrowserRouter,
  MemoryRouter,
  BrowserRouter as Router,
} from "react-router-dom";
import { AuthContext, AuthProvider, useAuth } from "../../../util/AuthContext";
import CreateComments from "../CreateComments";
import userEvent from "@testing-library/user-event";
import { fetchUserDetails } from "../../User/UserProfile/UserDetailsApi";
import { commentsApi, createCommentsApi } from "../Apis/CreateCommentsApi";
import { act } from "react-dom/test-utils";
import * as apiModule from "../Apis/CreateCommentsApi";
import { fetchComments } from "../Apis/GetCommentsApi";

jest.mock("../../../util/AuthContext.js", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../../User/UserProfile/UserDetailsApi", () => ({
  fetchUserDetails: jest.fn(),
}));

jest.mock("../Apis/CreateCommentsApi", () => ({
  createCommentsApi: jest.fn(),
}));
jest.mock("../Apis/GetCommentsApi", () => ({
  fetchComments: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (ui, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);

  return render(ui, { wrapper: MemoryRouter });
};

describe("CreateComments", () => {
  const mockOnCommentAdded = jest.fn();
  const videoId = "12345";
  beforeEach(() => {
    jest.clearAllMocks();

    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: "user1", channelName: "User One" },
    });

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  test("renders correctly", () => {
    renderWithRouter(
      <CreateComments videoId="123" onCommentAdded={mockOnCommentAdded} />
    );
    expect(
      screen.getByPlaceholderText("Add a public comment...")
    ).toBeInTheDocument();
  });

  test("updates input value on change", () => {
    renderWithRouter(
      <CreateComments videoId="123" onCommentAdded={mockOnCommentAdded} />
    );
    const input = screen.getByPlaceholderText("Add a public comment...");
    userEvent.type(input, "Test Comment");
    expect(input).toHaveValue("Test Comment");
  });

  test("navigates to signin when not authenticated and trying to focus", () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
    });
    renderWithRouter(
      <CreateComments videoId="123" onCommentAdded={mockOnCommentAdded} />
    );
    const input = screen.getByPlaceholderText("Add a public comment...");
    userEvent.click(input);
    expect(mockNavigate).toHaveBeenCalledWith("/signin");
  });

  test("sets focused to false when input is empty onBlur", () => {
    renderWithRouter(
      <CreateComments videoId="123" onCommentAdded={mockOnCommentAdded} />
    );

    const inputField = screen.getByPlaceholderText("Add a public comment...");
    fireEvent.focus(inputField);

    expect(inputField).toHaveClass("visible");

    fireEvent.blur(inputField);
    expect(inputField).not.toHaveClass("visible");
  });

  test("keeps focused true when input is not empty onBlur", () => {
    renderWithRouter(
      <CreateComments videoId="123" onCommentAdded={mockOnCommentAdded} />
    );

    const inputField = screen.getByPlaceholderText("Add a public comment...");
    fireEvent.focus(inputField);

    expect(inputField).toHaveClass("visible");

    fireEvent.change(inputField, { target: { value: "Test comment" } });
    fireEvent.blur(inputField);

    expect(inputField).toHaveClass("visible");
  });

  test("handles fetch failure", async () => {
    fetchUserDetails.mockRejectedValueOnce(new Error("Fetch failed"));

    renderWithRouter(
      <CreateComments videoId="123" onCommentAdded={mockOnCommentAdded} />
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Failed to fetch user details:",
        expect.any(Error)
      );
    });

    console.error.mockRestore();
  });

  test("does not submit comment when userDetails is not available", async () => {
    renderWithRouter(
      <CreateComments videoId="123" onCommentAdded={mockOnCommentAdded} />
    );

    const input = screen.getByPlaceholderText("Add a public comment...");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Test comment" } });

    const commentButton = screen.getByTestId("comment-save-button");
    fireEvent.click(commentButton);

    expect(console.error).toHaveBeenCalledWith(
      "User details not available, cannot submit comment"
    );
    expect(createCommentsApi).not.toHaveBeenCalled();
    expect(input.value).toBe("Test comment");

    console.error.mockRestore();
  });

  test.skip("fetches user details and handles comment submission", async () => {
    fetchUserDetails.mockResolvedValue({
      _id: "userId",
      channelName: "testChannel",
    });

    createCommentsApi.mockResolvedValue({
      success: true,
      data: {
        text: "Test Comment",
        createdAt: "2024-07-09T00:00:00Z",
      },
    });

    const onCommentAdded = jest.fn();
    renderWithRouter(
      <CreateComments videoId="123" onCommentAdded={mockOnCommentAdded} />
    );

    const input = screen.getByPlaceholderText("Add a public comment...");
    userEvent.type(input, "Test Comment");
    const commentButton = screen.getByText("Comment");

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

  test("cancels a comment while creating comment", async () => {
    renderWithRouter(
      <CreateComments videoId="123" onCommentAdded={mockOnCommentAdded} />
    );

    fireEvent.change(screen.getByPlaceholderText("Add a public comment..."), {
      target: { value: "New comment" },
    });

    fireEvent.click(screen.getByTestId("comment-cancel-button"));
    expect(screen.queryByText("New comment")).not.toBeInTheDocument();
  });

  test("logs error if create comment API response format is incorrect", async () => {
    createCommentsApi.mockResolvedValueOnce({
      success: false,
      message: "Error",
    });

    console.error = jest.fn();

    renderWithRouter(
      <CreateComments videoId="123" onCommentAdded={mockOnCommentAdded} />
    );

    const input = screen.getByPlaceholderText("Add a public comment...");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Test comment" } });

    const commentButton = screen.getByTestId("comment-save-button");
    fireEvent.click(commentButton);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "API response is not in the expected format:",
        expect.anything()
      );
    });

    expect(screen.queryByText("Test comment")).not.toBeInTheDocument();

    console.error.mockRestore();
  });

  test.skip("should add a comment with user details when the API call is successful", async () => {
    useAuth.mockReturnValue({ isAuthenticated: true });

    fetchUserDetails.mockResolvedValue({
      _id: "66504919905aa75e4ab9c575",
      channelName: "Keerthana",
      email: "keerthana.s@e2infosystems.com",
      photoUrl: "no-photo.jpg",
      role: "user",
    });

    createCommentsApi.mockResolvedValueOnce({
      success: true,
      data: { id: "66c595c9511c2896e940c25c", text: "This is a comment" },
    });

    render(
      <CreateComments videoId={videoId} onCommentAdded={mockOnCommentAdded} />
    );

    const input = screen.getByPlaceholderText("Add a public comment...");
    fireEvent.change(input, { target: { value: "This is a comment" } });

    const commentButton = screen.getByTestId("comment-save-button");
    fireEvent.click(commentButton);

    await waitFor(() => expect(fetchUserDetails).toHaveBeenCalled());
    await waitFor(() => {
      expect(createCommentsApi).toHaveBeenCalledWith({
        videoId,
        text: "This is a comment",
      });
    });

    expect(mockOnCommentAdded).toHaveBeenCalledWith({
      id: "66c595c9511c2896e940c25c",
      text: "This is a comment",
      channelName: "Keerthana",
      userId: "66504919905aa75e4ab9c575",
    });

    expect(input.value).toBe("");
  });
});
