import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { fetchHistories } from "../HistoryApi/GetHistoryApi";
import SearchHistory from "../SearchHistory";
import { deleteHistory } from "../HistoryApi/DeleteHistoryApi";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../Notification/store";

jest.mock("../HistoryApi/GetHistoryApi");
jest.mock("../HistoryApi/DeleteHistoryApi");

const mockHistories = [
  {
    _id: "1",
    searchText: "Search Text 1",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    searchText: "Search Text 2",
    createdAt: new Date().toISOString(),
  },
];

describe("Search History", () => {
  const setHistoryMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    fetchHistories.mockResolvedValue({
      success: true,
      data: mockHistories,
      totalPages: 1,
    });
  });

  test("renders SearchHistory component", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SearchHistory history={[]} setHistory={setHistoryMock} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Search History")).toBeInTheDocument();

    await waitFor(() => expect(fetchHistories).toHaveBeenCalled());
  });

  test("displays fetched search history items", async () => {
    render(
      <Provider store={store}>
        <SearchHistory history={mockHistories} setHistory={setHistoryMock} />
      </Provider>
    );

    expect(screen.getByText("Search Text 1")).toBeInTheDocument();
    expect(screen.getByText("Search Text 2")).toBeInTheDocument();
  });

  test("displays error message on fetch failure", async () => {
    fetchHistories.mockRejectedValueOnce(new Error("Error fetching data"));

    render(
      <Provider store={store}>
        <SearchHistory history={[]} setHistory={setHistoryMock} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Error fetching data")).toBeInTheDocument();
    });
    expect(setHistoryMock).toHaveBeenCalledWith([]);
  });

  test("sets correct state on successful fetch", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SearchHistory history={[]} setHistory={setHistoryMock} />
        </BrowserRouter>
      </Provider>
    );

    // Ensure fetchHistories has been called
    await waitFor(() => expect(fetchHistories).toHaveBeenCalled());

    // Simulate the setHistory call
    await waitFor(() =>
      expect(setHistoryMock).toHaveBeenCalledWith(mockHistories)
    );

    // Re-render the component with the new history
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SearchHistory history={mockHistories} setHistory={setHistoryMock} />
        </BrowserRouter>
      </Provider>
    );

    // Ensure the history items are rendered after state update
    await waitFor(() => {
      expect(screen.getByText("Search Text 1")).toBeInTheDocument();
    });
    expect(screen.getByText("Search Text 2")).toBeInTheDocument();
  });

  test("deletes search history item", async () => {
    render(
      <Provider store={store}>
        <SearchHistory
          history={mockHistories}
          setHistory={setHistoryMock}
          setError={jest.fn()}
        />
      </Provider>
    );

    deleteHistory.mockResolvedValueOnce({ success: true });

    const deleteButton = screen.getAllByRole("button")[0];
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

  test.skip("displays notification after deleting history", async () => {
    render(
      <Provider store={store}>
        <SearchHistory history={mockHistories} setHistory={setHistoryMock} />
      </Provider>
    );

    deleteHistory.mockResolvedValueOnce({ success: true });

    const deleteButton = screen.getByTestId("search-history-delete-1");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(
        screen.getByText("History deleted successfully")
      ).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(
          screen.queryByText("History deleted successfully")
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
          <SearchHistory history={mockHistories} setHistory={setHistoryMock} />
        </BrowserRouter>
      </Provider>
    );

    const deleteButton = screen.getAllByRole("button")[0];
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

  test("displays no search history message if history is empty", () => {
    render(
      <Provider store={store}>
        <SearchHistory history={[]} setHistory={setHistoryMock} />
      </Provider>
    );

    expect(screen.getByText("No search history yet.")).toBeInTheDocument();
  });

  test("successfully deletes a history item", async () => {
    deleteHistory.mockResolvedValue({ success: true });

    let localHistory = [...mockHistories];

    // Mock implementation of setHistory to update localHistory
    setHistoryMock.mockImplementation((update) => {
      if (typeof update === "function") {
        localHistory = update(localHistory);
      } else {
        localHistory = update;
      }
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <SearchHistory history={mockHistories} setHistory={setHistoryMock} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText("Search Text 1")).toBeInTheDocument();
    expect(screen.getByText("Search Text 2")).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole("button");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteHistory).toHaveBeenCalledWith("1");
    });

    expect(setHistoryMock).toHaveBeenCalledWith(expect.any(Function));

    // Ensure that the deleted history item is not in the state anymore
    await waitFor(() => {
      expect(localHistory).toEqual([
        {
          _id: "2",
          searchText: "Search Text 2",
          createdAt: expect.any(String),
        },
      ]);
    });
  });
});
