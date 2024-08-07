import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import notificationReducer, {
  showNotification,
  hideNotification,
} from "../notificationSlice";
import CustomNotification from "../CustomNotification";

const renderWithProviders = (ui, { initialState } = {}) => {
  const store = configureStore({
    reducer: {
      notifications: notificationReducer,
    },
    preloadedState: initialState,
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

test("should hide the notification after 3 seconds", async () => {
  const initialState = {
    notifications: {
      message: "Test notification",
      visible: true,
    },
  };

  renderWithProviders(<CustomNotification />, { initialState });

  expect(screen.getByText("Test notification")).toBeInTheDocument();

  await waitFor(
    () => {
      expect(screen.queryByText("Test notification")).toBeNull();
    },
    { timeout: 3500 }
  ); // Wait a bit longer than the timeout to ensure it's been cleared
});
