import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "../../../Navbar/Navbar";
import { searchText } from "../../../Search/SearchApi";
import UserProfile from "../UserProfile";
import { AuthProvider, useAuth } from "../../../../util/AuthContext";
import { logoutUser } from "../LogoutApi";

const mockUser = {
  channelName: "testUser",
  email: "test@example.com",
  photoUrl: "user-photo.jpg",
};

const mockUserWithoutPhoto = {
  channelName: "testUser",
  email: "test@example.com",
  photoUrl: "no-photo.jpg",
};
jest.mock("../../../../util/AuthContext");
jest.mock("../LogoutApi.js");

describe("UserProfile Component", () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  test("renders sign in link when user is not authenticated", () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: mockLogout,
    });

    render(
      <Router>
        <Navbar setSidebar={() => {}} />
      </Router>
    );

    expect(screen.getByTestId("signin-icon")).toBeInTheDocument();
  });

  test("renders user profile without photo when user is authenticated and has no photo", () => {
    useAuth.mockReturnValue({
      user: mockUserWithoutPhoto,
      logout: jest.fn(),
    });

    render(
      <Router>
        <UserProfile userInitialColor="#FF5733" />
      </Router>
    );

    const userInitialElement = screen.getByText("t");
    expect(userInitialElement).toBeInTheDocument();
    expect(screen.getByText("testUser")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.queryByAltText("testUser")).not.toBeInTheDocument();
  });

  test("renders user profile when user is authenticated", () => {
    useAuth.mockReturnValue({
      user: mockUser,
      logout: jest.fn(),
    });

    render(
      <Router>
        <UserProfile userInitialColor="#FF5733" />
      </Router>
    );

    expect(screen.getByText("testUser")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();

    const userProfileImage = screen.getByAltText("testUser");
    expect(userProfileImage).toBeInTheDocument();
    expect(userProfileImage).toHaveAttribute("src", "user-photo.jpg");
  });

  test('renders "Guest" and no email when user is not authenticated', () => {
    useAuth.mockReturnValue({
      user: null,
      logout: mockLogout,
    });

    render(
      <Router>
        <UserProfile userInitialColor="#FF5733" />
      </Router>
    );

    expect(screen.getByText("Guest")).toBeInTheDocument();
    expect(screen.queryByText("test@example.com")).not.toBeInTheDocument();
  });

  test("renders user options", () => {
    useAuth.mockReturnValue({
      user: mockUser,
      logout: jest.fn(),
    });

    render(
      <Router>
        <UserProfile userInitialColor="#FF5733" />
      </Router>
    );

    expect(screen.getByText(/your channel/i)).toBeInTheDocument();
    expect(screen.getByText(/studio/i)).toBeInTheDocument();
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
  });

  test("calls logout API and handles successful logout", async () => {
    useAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
    logoutUser.mockResolvedValue({ success: true });

    render(
      <Router>
        <UserProfile userInitialColor="#FF5733" />
      </Router>
    );

    fireEvent.click(screen.getByText(/sign out/i));

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalled();
    });
    expect(mockLogout).toHaveBeenCalled();
  });

  test("handles failed logout", async () => {
    useAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
    logoutUser.mockResolvedValue({ success: false, message: "Logout failed" });

    render(
      <Router>
        <UserProfile userInitialColor="#FF5733" />
      </Router>
    );

    fireEvent.click(screen.getByText(/sign out/i));

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalled();
    });
    expect(mockLogout).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      "Logout failed:",
      "Logout failed"
    );
  });

  test("handles logout API error", async () => {
    useAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
    logoutUser.mockRejectedValue(new Error("API Error"));

    render(
      <Router>
        <UserProfile userInitialColor="#FF5733" />
      </Router>
    );

    fireEvent.click(screen.getByText(/sign out/i));

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalled();
    });
    expect(mockLogout).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      "Error logging out:",
      expect.any(Error)
    );
  });
});
