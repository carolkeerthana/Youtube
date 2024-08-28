import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Navbar from "../Navbar";
import menuIcon from "../../../assets/menu.png";
import logo from "../../../assets/logo.png";
import searchIcon from "../../../assets/search.png";
import uploadIcon from "../../../assets/upload.png";
import notificationIcon from "../../../assets/notification.png";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "../../../util/AuthContext";
import { searchText } from "../../Search/SearchApi";

const setSidebarMock = jest.fn();
const mockNavigate = jest.fn();

jest.mock("../../Search/SearchApi.js");

jest.mock("../../../util/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Navbar", () => {
  describe("when authenticated", () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        isAuthenticated: true,
        user: {
          channelName: "TestUser",
          photoUrl: "test-photo.jpg",
          email: "test@example.com",
        },
        logout: jest.fn(),
      });
    });

    test('Menu icon must have src={menuIcon} alt="menu"', () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <Navbar />
        </MemoryRouter>
      );
      const menuImg = screen.getByTestId("menu-icon");
      expect(menuImg).toHaveAttribute("src", menuIcon);
      expect(menuImg).toHaveAttribute("alt", "menu");
    });

    test('Logo must have src={logo} alt="logo"', () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <Navbar />
        </MemoryRouter>
      );
      const logoImg = screen.getByTestId("youtube-logo");
      expect(logoImg).toHaveAttribute("src", logo);
      expect(logoImg).toHaveAttribute("alt", "logo");
    });

    test("Should have search placeholder", () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <Navbar />
        </MemoryRouter>
      );
      const searchInput = screen.queryByPlaceholderText("Search");
      fireEvent.change(searchInput, { target: { value: "test" } });
      expect(searchInput.value).toBe("test");
    });

    test('Search icon must have src={searchIcon} alt="search-icon"', () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <Navbar />
        </MemoryRouter>
      );
      const searchImg = screen.getByTestId("search-icon");
      expect(searchImg).toHaveAttribute("src", searchIcon);
      expect(searchImg).toHaveAttribute("alt", "search");
    });

    test('Upload icon must have src={uploadIcon} alt="upload"', () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <Navbar />
        </MemoryRouter>
      );
      const uploadImg = screen.getByTestId("upload-icon");
      expect(uploadImg).toHaveAttribute("src", uploadIcon);
      expect(uploadImg).toHaveAttribute("alt", "upload");
    });

    test('Notification icon must have src={notificationIcon} alt="notify"', () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <Navbar />
        </MemoryRouter>
      );
      const notificationImg = screen.getByTestId("notify-icon");
      expect(notificationImg).toHaveAttribute("src", notificationIcon);
      expect(notificationImg).toHaveAttribute("alt", "notify");
    });

    test("does not display the sign-in link on sign-in page", () => {
      render(
        <MemoryRouter initialEntries={["/signin"]}>
          <Navbar />
        </MemoryRouter>
      );

      const signInLink = screen.queryByRole("link", { name: /sign in/i });
      expect(signInLink).toBeNull();
    });

    // test('clicking sign-in link navigates to sign-in page without displaying navbar', () => {
    //     render(
    //       <MemoryRouter initialEntries={['/']}>
    //         <App />
    //       </MemoryRouter>
    //     );

    //     // Check for the sign-in link
    //     const signInLink = screen.getByRole('link', { name: /sign in/i });
    //     expect(signInLink).toBeInTheDocument();

    //     // Simulate user clicking the sign-in link
    //     userEvent.click(signInLink);

    //     // Verify that the sign-in page does not display the navbar
    //     expect(screen.queryByRole('navigation')).toBeNull();
    //   });

    test("toggleSidebar toggles sidebar state", () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <Navbar setSidebar={setSidebarMock} />
        </MemoryRouter>
      );

      const toggleButton = screen.getByTestId("menu-icon");

      // Initial click should call setSidebar with the toggled state function
      fireEvent.click(toggleButton);
      expect(setSidebarMock).toHaveBeenCalledWith(expect.any(Function));

      // calls the first agument frm first call
      const toggleFunction = setSidebarMock.mock.calls[0][0];
      let prevState = false;
      expect(toggleFunction(prevState)).toBe(true);

      // First toggle from false to true
      prevState = true;
      expect(toggleFunction(prevState)).toBe(false); // Second toggle from true to false

      // Ensure the function is called twice
      fireEvent.click(toggleButton);
      expect(setSidebarMock).toHaveBeenCalledTimes(2);
    });

    test("should toggle UserProfile dropdown on profile icon click when authenticated", () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <Navbar />
        </MemoryRouter>
      );

      expect(screen.queryByTestId("user-profile")).toBeNull();
      fireEvent.click(screen.getByTestId("profile-icon"));
      expect(screen.getByText("T")).toBeInTheDocument();
      expect(screen.queryByTestId("user-channel-name")).toHaveTextContent(
        "TestUser"
      );
      fireEvent.click(screen.getByTestId("profile-icon"));
      expect(screen.queryByTestId("user-profile")).toBeNull();
    });

    test("should close UserProfile dropdown when clicking outside", () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Navbar setSidebar={setSidebarMock} />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTestId("profile-icon"));
      expect(screen.getByTestId("user-profile")).toBeInTheDocument();
      fireEvent.mouseDown(document);
      expect(screen.queryByTestId("user-profile")).toBeNull();
    });

    test("searching valid text, should give the result", async () => {
      searchText.mockResolvedValue({ data: [{ id: 1, name: "test result" }] });

      render(
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <Navbar setSidebar={setSidebarMock} />
        </MemoryRouter>
      );

      const searchInput = screen.getByPlaceholderText(/Search/i);
      fireEvent.change(searchInput, { target: { value: "sample" } });
      const searchIcon = screen.getByTestId("search-icon");
      fireEvent.submit(searchIcon);

      await waitFor(() =>
        expect(mockNavigate).toHaveBeenCalledWith("/search-results", {
          state: { results: [{ id: 1, name: "test result" }] },
        })
      );
    });

    test("searching invalid text should not navigate", async () => {
      searchText.mockResolvedValue({ data: [] });
      render(
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <Navbar setSidebar={setSidebarMock} />
        </MemoryRouter>
      );

      const searchInput = screen.getByPlaceholderText(/Search/i);
      fireEvent.change(searchInput, { target: { value: "invalid" } });
      fireEvent.click(screen.getByTestId("search-icon"));

      await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
    });

    test("displays error when search fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      searchText.mockRejectedValue(new Error("Network Error"));

      render(
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <Navbar setSidebar={setSidebarMock} />
        </MemoryRouter>
      );

      const searchInput = screen.getByPlaceholderText(/Search/i);
      fireEvent.change(searchInput, { target: { value: "error" } });
      fireEvent.click(screen.getByTestId("search-icon"));

      await waitFor(() =>
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Error fetching search results:",
          expect.any(Error)
        )
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("when not authenticated", () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
      });
    });
    test("displays the sign-in link with icon and text when not on sign-in or sign-up page", () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <Navbar />
        </MemoryRouter>
      );

      const signInLink = screen.getByRole("link", { name: /sign in/i });
      expect(signInLink).toBeInTheDocument();

      const icon = screen.getByTestId("signin-icon");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass("signin-icon");
      expect(icon).toHaveStyle({ color: "#2d82d2" });

      const signInText = screen.getByText(/sign in/i);
      expect(signInText).toBeInTheDocument();
      expect(signInText).toHaveClass("signin-text");
    });

    test.skip("clicking sign-in link navigates to sign-in page", () => {
      render(
        <MemoryRouter initialEntries={["/signin"]}>
          <Navbar />
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="/signin" element={<div>Sign-in Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      // Before clicking
      console.log("Before click:", window.location.pathname);

      const signInLink = screen.getByText(/sign in/i); // Find the sign-in link
      fireEvent.click(signInLink); // Simulate a click on the sign-in link

      // After clicking
      console.log("After click:", window.location.pathname);

      // Assert that navigation to '/signin' should occur
      expect(window.location.pathname).toBe("/signin");
    });
  });
});
