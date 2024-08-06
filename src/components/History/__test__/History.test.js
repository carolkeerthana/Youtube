import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import History from "../History";
import { BrowserRouter } from "react-router-dom";
import { deleteAllHistory } from "../HistoryApi/DeleteHistoriesApi";

jest.mock("../HistoryApi/DeleteHistoriesApi.js");
describe("History", () => {
  beforeEach(() => {
    deleteAllHistory.mockResolvedValue({ success: true });
  });

  test("renders WatchHistory component when historyType is watch", () => {
    render(<History />);

    expect(screen.getByLabelText("Watch History")).toBeInTheDocument();
  });

  test("renders SearchHistory component when historyType is search", () => {
    render(<History />);

    fireEvent.click(screen.getByLabelText("Search History"));
    expect(screen.getByLabelText("Search History")).toBeInTheDocument();
  });

  test("changes historyType state when selecting a different history type", () => {
    render(<History />);
    fireEvent.click(screen.getByLabelText("Search History"));
    expect(screen.getByLabelText("Search History")).toBeChecked();
    fireEvent.click(screen.getByLabelText("Watch History"));
    expect(screen.getByLabelText("Watch History")).toBeChecked();
  });

  test("clears all watch history when CLEAR ALL WATCH HISTORY button is clicked", async () => {
    render(<History />);
    fireEvent.click(screen.getByText("CLEAR ALL WATCH HISTORY"));
    await waitFor(() => expect(deleteAllHistory).toHaveBeenCalledWith("watch"));
    await waitFor(() =>
      expect(screen.getByTestId("notify-delete")).toHaveTextContent(
        "Watch Histories Deleted Successfully"
      )
    );
    await waitFor(
      () => {
        expect(
          screen.queryByText("Watch Histories Deleted Successfully")
        ).not.toBeInTheDocument(); // Ensure notification disappears after 3 seconds
      },
      { timeout: 3500 }
    );
  });

  test("clears all search history when CLEAR ALL SEARCH HISTORY button is clicked", async () => {
    render(<History />);
    fireEvent.click(screen.getByLabelText("Search History"));
    fireEvent.click(screen.getByText("CLEAR ALL SEARCH HISTORY"));
    await waitFor(() =>
      expect(deleteAllHistory).toHaveBeenCalledWith("search")
    );
    await waitFor(() =>
      expect(screen.getByTestId("notify-delete")).toHaveTextContent(
        "Search Histories Deleted Successfully"
      )
    );
    await waitFor(
      () => {
        expect(
          screen.queryByText("Search Histories Deleted Successfully")
        ).not.toBeInTheDocument(); // Ensure notification disappears after 3 seconds
      },
      { timeout: 3500 }
    );
  });

  test("handles failure to delete histories", async () => {
    deleteAllHistory.mockResolvedValueOnce({ success: false });
    render(<History />);
    fireEvent.click(screen.getByText("CLEAR ALL WATCH HISTORY"));
    await waitFor(() => expect(deleteAllHistory).toHaveBeenCalledWith("watch"));
    expect(screen.queryByTestId("notify-delete")).not.toBeInTheDocument();
  });

  test("logs error to console when deleteAllHistory throws an error", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const errorMessage = "Network Error";
    deleteAllHistory.mockRejectedValueOnce(new Error(errorMessage));

    render(<History />);
    fireEvent.click(screen.getByText("CLEAR ALL WATCH HISTORY"));

    await waitFor(() => expect(deleteAllHistory).toHaveBeenCalledWith("watch"));
    await waitFor(() =>
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error deleting histories:",
        expect.any(Error)
      )
    );

    consoleErrorSpy.mockRestore();
  });
});
