import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Feed from "../Feed";
import { fetchVideos } from "../GetVideosApi";

jest.mock("../GetVideosApi.js");

const mockData = [
  {
    _id: "1",
    title: "Sample Video 1",
    thumbnailUrl: "sample-thumbnail-1.jpg",
    views: 100,
    createdAt: "2023-06-01T00:00:00Z",
    userId: {
      channelName: "Sample Channel 1",
      photoUrl: "sample-avatar-1.jpg",
    },
  },
  {
    _id: "2",
    title: "Sample Video 2",
    thumbnailUrl: "sample-thumbnail-2.jpg",
    views: 200,
    createdAt: "2023-06-02T00:00:00Z",
    userId: {
      channelName: "Sample Channel 2",
      photoUrl: "sample-avatar-2.jpg",
    },
  },
];

describe("Feed", () => {
  beforeEach(() => {
    fetchVideos.mockResolvedValue({ success: true, data: mockData });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders feed with data from Api", async () => {
    // Mock fetch function to return dummy data
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            data: [
              {
                _id: "1",
                title: "Video Title",
                userId: { channelName: "Channel Name" },
                views: 100,
                createdAt: new Date().toISOString(),
              },
            ],
          }),
      })
    );

    render(
      <BrowserRouter>
        <Feed category="someCategory" />
      </BrowserRouter>
    );

    const videoTitle = await screen.findByText(/Sample Video 1/i);
    expect(videoTitle).toBeInTheDocument();
  });

  test("renders feed component with mock data", async () => {
    render(
      <BrowserRouter>
        <Feed category="someCategory" />
      </BrowserRouter>
    );

    expect(fetchVideos).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      mockData.forEach((item) => {
        expect(screen.getByText(item.title)).toBeInTheDocument();
        expect(screen.getByText(item.userId.channelName)).toBeInTheDocument();
      });
    });
  });

  test("handles Api response with unexpected format", async () => {
    const invalidResponse = { success: true, invalidData: [] };
    fetchVideos.mockResolvedValue(invalidResponse);

    console.error = jest.fn();

    render(
      <BrowserRouter>
        <Feed category="someCategory" />
      </BrowserRouter>
    );

    expect(fetchVideos).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.queryByText("Sample Video 1")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "API response is not in the expected format:",
        invalidResponse
      );
    });

    console.error.mockRestore();
  });

  test("handles Api error response", async () => {
    fetchVideos.mockRejectedValue(new Error("API Error"));

    render(
      <BrowserRouter>
        <Feed category="someCategory" />
      </BrowserRouter>
    );

    expect(fetchVideos).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.queryByText("Sample Video 1")).not.toBeInTheDocument();
    });
  });
});
