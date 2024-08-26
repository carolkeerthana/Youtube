import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import SearchResults from "../SearchResults";
import moment from "moment";
import "@testing-library/jest-dom/extend-expect";

jest.mock("moment", () => {
  return (date) => ({
    fromNow: jest.fn(() => "a few seconds ago"),
  });
});

describe("SearchResults", () => {
  const renderWithRouter = (ui, { route = "/", state = {} } = {}) => {
    return render(
      <MemoryRouter initialEntries={[{ pathname: route, state }]}>
        <Routes>
          <Route path={route} element={ui} />
        </Routes>
      </MemoryRouter>
    );
  };

  test("should render correctly with search results", () => {
    const results = [
      {
        id: "1",
        thumbnailUrl: "thumbnail1.jpg",
        title: "Video 1",
        userId: { channelName: "Channel 1" },
        views: 100,
        createdAt: new Date(),
        description: "Description 1",
      },
      {
        id: "2",
        thumbnailUrl: "thumbnail2.jpg",
        title: "Video 2",
        userId: { channelName: "Channel 2" },
        views: 200,
        createdAt: new Date(),
        description: "Description 2",
      },
    ];

    renderWithRouter(<SearchResults />, {
      route: "/search",
      state: { results },
    });

    results.forEach((result) => {
      expect(screen.getByText(result.title)).toBeInTheDocument();
      expect(screen.getByText(result.userId.channelName)).toBeInTheDocument();
      expect(
        screen.getByText(`${result.views} views • a few seconds ago`)
      ).toBeInTheDocument();
      expect(screen.getByText(result.description)).toBeInTheDocument();
      expect(screen.getByAltText(result.title)).toHaveAttribute(
        "src",
        `https://apps.rubaktechie.me/uploads/thumbnails/${result.thumbnailUrl}`
      );
    });
  });

  test('should render "No results found." when there are no search results', () => {
    renderWithRouter(<SearchResults />, {
      route: "/search",
      state: { results: [] },
    });

    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  test("should handle missing or incomplete data gracefully", () => {
    const results = [
      {
        id: "1",
        thumbnailUrl: null,
        title: null,
        userId: null,
        views: null,
        createdAt: null,
        description: null,
      },
    ];

    renderWithRouter(<SearchResults />, {
      route: "/search",
      state: { results },
    });

    // expect(container.querySelector('.search-result-item')).toBeInTheDocument();
    expect(screen.getByAltText("No title")).toHaveAttribute(
      "src",
      "https://apps.rubaktechie.me/uploads/thumbnails/null"
    );
    expect(screen.getByText("No title")).toBeInTheDocument();
    expect(screen.getByText("No channel name")).toBeInTheDocument();
    expect(screen.getByText("No description")).toBeInTheDocument();
  });

  test("should handle partially complete data", () => {
    const results = [
      {
        id: "1",
        thumbnailUrl: "thumbnail1.jpg",
        title: "Video 1",
        userId: null,
        views: 100,
        createdAt: null,
        description: "Description 1",
      },
    ];

    renderWithRouter(<SearchResults />, {
      route: "/search",
      state: { results },
    });

    expect(screen.getByAltText("Video 1")).toHaveAttribute(
      "src",
      "https://apps.rubaktechie.me/uploads/thumbnails/thumbnail1.jpg"
    );
    expect(screen.getByText("Video 1")).toBeInTheDocument();
    expect(screen.getByText("No channel name")).toBeInTheDocument();
    expect(
      screen.getByText("100 views • a few seconds ago")
    ).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
  });

  test("should render without crashing if results is undefined", () => {
    renderWithRouter(<SearchResults />, {
      route: "/search",
      state: { results: undefined },
    });

    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });
});
