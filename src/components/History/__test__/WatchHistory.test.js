import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { fetchHistories } from "../HistoryApi/GetHistoryApi";
import WatchHistory from "../WatchHistory";
import { BrowserRouter } from "react-router-dom";
import { deleteHistory } from "../HistoryApi/DeleteHistoryApi";
import { Provider } from "react-redux";
import store from "../../Notification/store";

jest.mock("../HistoryApi/GetHistoryApi.js", () => ({
  fetchHistories: jest.fn(),
}));

// jest.mock('../HistoryApi/GetHistoryApi.js')
jest.mock("../HistoryApi/DeleteHistoryApi.js");

const mockHistory = [
  {
    _id: "1",
    videoId: {
      thumbnailUrl: "thumbnail1.jpg",
      title: "Video Title1",
      views: 100,
      description: "Description 1",
    },
    userId: {
      channelName: "Channel 1",
    },
  },
  {
    _id: "2",
    videoId: {
      thumbnailUrl: "thumbnail2.jpg",
      title: "Video Title2",
      views: 200,
      description: "Description 2",
    },
    userId: {
      channelName: "Channel 2",
    },
  },
];
describe("WatchHistory", () => {
  const setError = jest.fn();
  const setHistory = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    fetchHistories.mockResolvedValue({
      success: true,
      data: mockHistory,
      totalPages: 1,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should renders watch history text", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <WatchHistory history={[]} setHistory={jest.fn()} />
        </BrowserRouter>
      </Provider>
    );
    const watchHistoryText = screen.getByText("Watch History");
    expect(watchHistoryText).toBeInTheDocument();
  });

  test("renders watch history", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <WatchHistory history={mockHistory} setHistory={setHistory} />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(fetchHistories).toHaveBeenCalledWith(1, "watch");
    });

    const historyCard = screen.getByText(/Video Title1/i);
    expect(historyCard).toBeInTheDocument();
  });

  test("sets correct state on successful fetch", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <WatchHistory history={mockHistory} setHistory={setHistory} />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => expect(fetchHistories).toHaveBeenCalled());

    await waitFor(() => expect(setHistory).toHaveBeenCalledWith(mockHistory));
    expect(screen.getByText("Video Title1")).toBeInTheDocument();
    expect(screen.getByText("Video Title2")).toBeInTheDocument();
  });

  test("displays error message on fetch failure", async () => {
    fetchHistories.mockRejectedValueOnce(new Error("Error fetching data"));

    render(
      <Provider store={store}>
        <WatchHistory history={[]} setHistory={setHistory} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Error fetching data")).toBeInTheDocument();
    });
    expect(setHistory).toHaveBeenCalledWith([]);
  });

  test.skip("handles delete history", async () => {
    const setHistoryMock = jest.fn();
    render(
      <Provider store={store}>
        <WatchHistory
          history={mockHistory}
          setHistory={setHistoryMock}
          setError={jest.fn()}
        />
      </Provider>
    );

    deleteHistory.mockResolvedValueOnce({ success: true });

    const deleteButton = screen.getByTestId("history-delete-1");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteHistory).toHaveBeenCalledWith("1");
    });

    await waitFor(() => {
      expect(setHistoryMock).toHaveBeenCalledWith(
        expect.not.objectContaining({ _id: "1" })
      );
    });
  });

  test("successfully deletes a history item", async () => {
    deleteHistory.mockResolvedValue({ success: true });

    let localHistory = [...mockHistory];

    setHistory.mockImplementation((update) => {
      if (typeof update === "function") {
        localHistory = update(localHistory);
      } else {
        localHistory = update;
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <WatchHistory history={mockHistory} setHistory={setHistory} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Video Title1")).toBeInTheDocument();
    expect(screen.getByText("Video Title2")).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole("button");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteHistory).toHaveBeenCalledWith("1");
    });

    expect(setHistory).toHaveBeenCalledWith(expect.any(Function));

    await waitFor(() => {
      expect(localHistory).toEqual([
        {
          _id: "2",
          videoId: {
            thumbnailUrl: "thumbnail2.jpg",
            title: "Video Title2",
            views: 200,
            description: "Description 2",
          },
          userId: {
            channelName: "Channel 2",
          },
        },
      ]);
    });
  });

  test("displays notification after deleting history", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <WatchHistory history={mockHistory} setHistory={jest.fn()} />
        </BrowserRouter>
      </Provider>
    );

    deleteHistory.mockResolvedValueOnce({ success: true });

    const deleteButton = screen.getByTestId("history-delete-1");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(
        screen.getByText("History Deleted Successfully")
      ).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(
          screen.queryByText("History Deleted Successfully")
        ).not.toBeInTheDocument();
      },
      { timeout: 3500 }
    );
  });

  test("handles delete history error", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    deleteHistory.mockRejectedValueOnce(new Error("Failed to delete history"));

    render(
      <Provider store={store}>
        <BrowserRouter>
          <WatchHistory history={mockHistory} setHistory={jest.fn()} />
        </BrowserRouter>
      </Provider>
    );

    const deleteButton = screen.getByTestId("history-delete-1");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteHistory).toHaveBeenCalledWith("1");
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error deleting history:",
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  test("displays no watch history message if history is empty", () => {
    render(
      <Provider store={store}>
        <WatchHistory history={[]} setHistory={setHistory} />
      </Provider>
    );

    expect(screen.getByText("No watch history yet.")).toBeInTheDocument();
  });
});
