import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../../Sidebar/Sidebar";
import { AuthProvider, useAuth } from "../../../util/AuthContext";
import { getLikedVideos } from "../GetLikedVideosApi";
import LikedVideos from "../LikedVideos";

jest.mock("../GetLikedVideosApi.js");
jest.mock("../../../util/AuthContext.js", () => ({
  useAuth: jest.fn(),
}));
describe("Liked-videos", () => {
  const mockData = [
    {
      _id: "1",
      title: "Sample Subscription 1",
      thumbnailUrl: "sample-thumbnail-1.jpg",
      views: 100,
      createdAt: new Date().toISOString(),
      userId: {
        channelName: "Sample Channel 1",
        photoUrl: "sample-avatar-1.jpg",
      },
    },
    {
      _id: "2",
      title: "Sample Subscription 2",
      thumbnailUrl: "sample-thumbnail-2.jpg",
      views: 200,
      createdAt: new Date().toISOString(),
      userId: {
        channelName: "Sample Channel 2",
        photoUrl: "sample-avatar-2.jpg",
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ isAuthenticated: true });
  });

  const mockSetSidebar = jest.fn();
  const renderSidebar = () => {
    render(
      <BrowserRouter>
        <Sidebar sidebar={true} setSidebar={mockSetSidebar} page="" />
      </BrowserRouter>
    );
  };
  test("should have active class on liked-videos in sidebar", async () => {
    renderSidebar();

    const likedVideosLink = screen.getByTestId("liked-videos-link");
    fireEvent.click(likedVideosLink);
    await waitFor(() => expect(likedVideosLink).toHaveClass("active"));
  });

  test('should renders "No results found." message when channel is not subscribed', () => {
    getLikedVideos.mockResolvedValue({ success: true, data: [] });

    render(
      <BrowserRouter>
        <LikedVideos />
      </BrowserRouter>
    );
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  test("should renders liked videos", async () => {
    getLikedVideos.mockResolvedValueOnce({ success: true, data: mockData });

    render(
      <BrowserRouter>
        <LikedVideos />
      </BrowserRouter>
    );

    await screen.findByText("Sample Subscription 1");
    expect(screen.getByText("Sample Subscription 1")).toBeInTheDocument();
  });

  test("should handles Api error response", async () => {
    const errorResponse = {
      success: false,
      error: "Error fetching data",
    };
    getLikedVideos.mockResolvedValueOnce(errorResponse);

    render(
      <BrowserRouter>
        <LikedVideos />
      </BrowserRouter>
    );

    const errorMessage = await screen.findByText("Error fetching data");
    expect(errorMessage).toBeInTheDocument();
  });

  test("handles network error", async () => {
    getLikedVideos.mockRejectedValueOnce(new Error("Network error"));

    render(
      <BrowserRouter>
        <LikedVideos />
      </BrowserRouter>
    );

    const errorMessage = await screen.findByText("Error fetching data");
    expect(errorMessage).toBeInTheDocument();
  });
});
