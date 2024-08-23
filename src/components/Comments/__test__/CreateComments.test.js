import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../util/AuthContext";
import { fetchUserDetails } from "../../User/UserProfile/UserDetailsApi";
import { createCommentsApi } from "../Apis/CreateCommentsApi";
import CreateComments from "../CreateComments";

jest.mock("../../../util/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../Apis/GetCommentsApi", () => ({
  fetchComments: jest.fn(),
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

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

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
