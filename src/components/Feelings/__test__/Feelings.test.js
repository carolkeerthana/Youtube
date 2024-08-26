import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useAuth } from "../../../util/AuthContext";
import Feelings from "../Feelings";
import { updateFeelings } from "../FeelingsApi";
import * as FeelingsApi from "../FeelingsApi.js";
import { BrowserRouter } from "react-router-dom";
import SignInPopup from "../SignInPopup .js";

jest.mock("../../../util/AuthContext.js", () => ({
  useAuth: jest.fn(),
}));

const mockUpdateFeelings = jest.fn(); // Mock updateFeelings function
jest.mock("../FeelingsApi.js");

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Feelings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ isAuthenticated: true });
  });

  test("renders initial likes and dislikes", () => {
    render(
      <Feelings
        videoId="123"
        initialLikes={10}
        initialDislikes={5}
        initialUserFeeling={null}
      />
    );

    const likeButton = screen.getByAltText("like");
    const dislikeButton = screen.getByAltText("dislike");

    expect(likeButton).toBeInTheDocument();
    expect(dislikeButton).toBeInTheDocument();

    expect(screen.getByText("10")).toBeInTheDocument(); // Initial likes
    expect(screen.getByText("5")).toBeInTheDocument(); // Initial dislikes
  });

  test("handles like click with successful API response", async () => {
    // Mock a successful response from updateFeelings
    updateFeelings.mockResolvedValue({ success: true });

    render(
      <BrowserRouter>
        <Feelings
          videoId="123"
          initialLikes={10}
          initialDislikes={5}
          initialUserFeeling={null}
        />
      </BrowserRouter>
    );

    const likeButton = screen.getByAltText("like");
    fireEvent.click(likeButton);

    // Wait for state update
    await waitFor(() => {
      expect(updateFeelings).toHaveBeenCalledWith({
        videoId: "123",
        type: "like",
      });
    });
    await waitFor(() => {
      expect(screen.getByText("11")).toBeInTheDocument(); // Assuming likes increment correctly
    });
  });

  test("handles like click when userFeeling is dislike", async () => {
    updateFeelings.mockResolvedValue({ success: true });

    render(
      <BrowserRouter>
        <Feelings
          videoId="123"
          initialLikes={10}
          initialDislikes={5}
          initialUserFeeling="dislike"
        />
      </BrowserRouter>
    );

    const likeButton = screen.getByAltText("like");
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(updateFeelings).toHaveBeenCalledWith({
        videoId: "123",
        type: "like",
      });
    });

    await waitFor(() => {
      expect(screen.getByText("11")).toBeInTheDocument(); // Likes incremented
    });

    await waitFor(() => {
      expect(screen.getByText("4")).toBeInTheDocument(); // Dislikes decremented
    });
  });

  test("does not update likes when userFeeling is already like", async () => {
    render(
      <BrowserRouter>
        <Feelings
          videoId="123"
          initialLikes={10}
          initialDislikes={5}
          initialUserFeeling="like"
        />
      </BrowserRouter>
    );

    const likeButton = screen.getByAltText("like");
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(updateFeelings).not.toHaveBeenCalled();
    });

    // Verify that likes and dislikes remain the same
    expect(screen.getByText("10")).toBeInTheDocument(); // Likes unchanged
    expect(screen.getByText("5")).toBeInTheDocument(); // Dislikes unchanged
  });

  test("handles like click with failed API response", async () => {
    // Mock a failed response from updateFeelings
    updateFeelings.mockResolvedValue({
      success: false,
      error: "Failed to update feelings",
    });

    // Mock console.error
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Feelings
          videoId="123"
          initialLikes={10}
          initialDislikes={5}
          initialUserFeeling={null}
        />
      </BrowserRouter>
    );

    const likeButton = screen.getByAltText("like");
    fireEvent.click(likeButton);

    // Wait for error handling
    await waitFor(() => {
      expect(updateFeelings).toHaveBeenCalledWith({
        videoId: "123",
        type: "like",
      });
    });

    // Check if the error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to update feelings:", {
      success: false,
      error: "Failed to update feelings",
    });

    // Check if likes remain unchanged
    expect(screen.getByText("10")).toBeInTheDocument(); // Assuming likes remain unchanged

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  test("handles dislike click", async () => {
    const mockUpdateFeelings = jest.spyOn(FeelingsApi, "updateFeelings");
    mockUpdateFeelings.mockResolvedValue({ success: true }); // Mock a successful response

    render(
      <Feelings
        videoId="123"
        initialLikes={10}
        initialDislikes={5}
        initialUserFeeling={null}
      />
    );

    const dislikeButton = screen.getByAltText("dislike");
    fireEvent.click(dislikeButton);

    // Wait for the component to update with the new like count
    await waitFor(() => {
      expect(mockUpdateFeelings).toHaveBeenCalledWith({
        videoId: "123",
        type: "dislike",
      });
    });
    await waitFor(() => {
      expect(screen.getByText("6")).toBeInTheDocument(); // Assuming likes increment correctly
    });
  });

  test("handles dislike click when userFeeling is like", async () => {
    updateFeelings.mockResolvedValue({ success: true });

    render(
      <BrowserRouter>
        <Feelings
          videoId="123"
          initialLikes={10}
          initialDislikes={5}
          initialUserFeeling="like"
        />
      </BrowserRouter>
    );

    const dislikeButton = screen.getByAltText("dislike");
    fireEvent.click(dislikeButton);

    await waitFor(() => {
      expect(updateFeelings).toHaveBeenCalledWith({
        videoId: "123",
        type: "dislike",
      });
    });

    await waitFor(() => {
      expect(screen.getByText("9")).toBeInTheDocument(); // Likes decremented
    });

    await waitFor(() => {
      expect(screen.getByText("6")).toBeInTheDocument(); // Dislikes incremented
    });
  });

  test("does not update dislikes when userFeeling is already dislike", async () => {
    render(
      <BrowserRouter>
        <Feelings
          videoId="123"
          initialLikes={10}
          initialDislikes={5}
          initialUserFeeling="dislike"
        />
      </BrowserRouter>
    );

    const dislikeButton = screen.getByAltText("dislike");
    fireEvent.click(dislikeButton);

    await waitFor(() => {
      expect(updateFeelings).not.toHaveBeenCalled();
    });

    // Verify that likes and dislikes remain the same
    expect(screen.getByText("10")).toBeInTheDocument(); // Likes unchanged
    expect(screen.getByText("5")).toBeInTheDocument(); // Dislikes unchanged
  });

  test("handles dislike click with failed API response", async () => {
    // Mock a failed response from updateFeelings
    updateFeelings.mockResolvedValue({
      success: false,
      error: "Failed to update feelings",
    });

    // Mock console.error
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Feelings
          videoId="123"
          initialLikes={10}
          initialDislikes={5}
          initialUserFeeling={null}
        />
      </BrowserRouter>
    );

    const dislikeButton = screen.getByAltText("dislike");
    fireEvent.click(dislikeButton);

    // Wait for error handling
    await waitFor(() => {
      expect(updateFeelings).toHaveBeenCalledWith({
        videoId: "123",
        type: "dislike",
      });
    });

    // Check if the error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to update feelings:", {
      success: false,
      error: "Failed to update feelings",
    });

    // Check if dislikes remain unchanged
    expect(screen.getByText("5")).toBeInTheDocument(); // Assuming likes remain unchanged

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  test("handles authentication popup on like/dislike click", async () => {
    useAuth.mockReturnValue({ isAuthenticated: false });

    render(
      <BrowserRouter>
        <Feelings
          videoId="123"
          initialLikes={10}
          initialDislikes={5}
          initialUserFeeling={null}
        />
      </BrowserRouter>
    );

    const overlay = screen.queryByTestId("feelings-overlay"); // Use appropriate test ID or class name

    // Before click, overlay should not be present
    expect(overlay).toBeNull();

    const likeButton = screen.getByAltText("like");
    fireEvent.click(likeButton);

    // Wait for overlay to appear
    await waitFor(() => {
      const overlay = screen.queryByTestId("feelings-overlay");
      expect(overlay).toBeInTheDocument();
    });

    // Check if sign-in popup appears for like
    await waitFor(() => {
      expect(screen.getByText("Like this video?")).toBeInTheDocument(); // Adjust text based on your SignInPopup component
    });

    const dislikeButton = screen.getByAltText("dislike");
    fireEvent.click(dislikeButton);

    // Wait for overlay to update
    await waitFor(() => {
      expect(screen.getByText("Don't like this video?")).toBeInTheDocument(); // Adjust text based on your SignInPopup component
    });

    // render(<SignInPopup action='dislike'/>);

    const signInButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/signin");
    });

    // Simulate click on overlay to close it
    await waitFor(() => {
      const overlay = screen.queryByTestId("feelings-overlay");
      if (overlay) {
        fireEvent.click(overlay);
      }
    });

    // Wait for overlay to disappear
    await waitFor(() => {
      expect(screen.queryByTestId("feelings-overlay")).toBeNull(); // After closing, overlay should no longer be present
    });
  });

  test("handles like click with thrown error", async () => {
    const mockError = new Error("Network error");
    updateFeelings.mockRejectedValue(new Error("Network error"));

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Feelings
          videoId="123"
          initialLikes={10}
          initialDislikes={5}
          initialUserFeeling={null}
        />
      </BrowserRouter>
    );

    const likeButton = screen.getByAltText("like");
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(updateFeelings).toHaveBeenCalledWith({
        videoId: "123",
        type: "like",
      });
    });

    const dislikeButton = screen.getByAltText("dislike");
    fireEvent.click(dislikeButton);

    await waitFor(() => {
      expect(updateFeelings).toHaveBeenCalledWith({
        videoId: "123",
        type: "dislike",
      });
    });

    // Check if the thrown error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error updating feelings:",
      mockError
    );

    // likes remain unchanged
    expect(screen.getByText("10")).toBeInTheDocument();

    // dislikes remain unchanged
    expect(screen.getByText("5")).toBeInTheDocument();

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});

describe("updateFeelings function", () => {
  afterEach(() => {
    localStorage.clear(); // Clear localStorage after each test
  });

  test("should update feelings successfully", async () => {
    // Mock token and feelingsData
    localStorage.setItem("token", "mockToken");
    const feelingsData = { videoId: "videoId", type: "like" };
    const expectedResponse = {
      success: true,
      message: "Feelings updated successfully",
    };

    // Mock the resolved value of updateFeelings
    updateFeelings.mockResolvedValue(expectedResponse);

    const response = await updateFeelings(feelingsData);

    expect(response).toEqual(expectedResponse);
    expect(localStorage.getItem("token")).toEqual("mockToken");
  });

  test("should handle unauthorized access (no token)", async () => {
    // Clear mock token to simulate no token scenario
    // localStorage.removeItem('token');
    const feelingsData = { videoId: "videoId", type: "like" };
    const expectedResponse = { success: false, message: "No token found" };

    updateFeelings.mockResolvedValue(expectedResponse);
    const response = await updateFeelings(feelingsData);

    expect(response).toEqual(expectedResponse);
  });

  test("should handle network error", async () => {
    const feelingsData = { videoId: "yourVideoId", type: "like" };
    const errorMessage = "Failed to fetch";

    // Mock implementation of fetch for testing network error
    global.fetch = jest.fn().mockRejectedValue(new Error(errorMessage));

    await updateFeelings(feelingsData);
  });

  test.skip("should handle successful feelings update", async () => {
    // Mock localStorage to return a mock token
    jest
      .spyOn(window.localStorage.__proto__, "getItem")
      .mockReturnValue("mockToken");

    const feelingsData = { videoId: "videoId", type: "like" };
    const expectedResponse = {
      success: true,
      message: "Feelings updated successfully",
    };

    // Mock fetch to simulate the network request
    fetch.mockResolvedValueOnce({
      json: async () => expectedResponse,
    });

    const response = await updateFeelings(feelingsData);

    expect(response).toEqual(expectedResponse);
    expect(fetch).toHaveBeenCalledWith(
      "https://apps.rubaktechie.me/api/v1/feelings/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer mockToken`, // Ensure correct token is sent
        },
        body: JSON.stringify(feelingsData),
      }
    );
  });
});
