import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Sidebar from "../Sidebar";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "../../../util/AuthContext";
import Video from "../../../Pages/Video/Video";

jest.mock("../../../util/AuthContext.js", () => ({
  useAuth: jest.fn(),
}));

const resizeWindow = (width) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event("resize"));
};

describe("Sidebar", () => {
  const setup = (page, sidebar) => {
    const setSidebar = jest.fn();

    render(
      <BrowserRouter>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} page={page} />
      </BrowserRouter>
    );
    return setSidebar;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ isAuthenticated: true });
  });

  test("renders correctly with sidebar prop set to true", () => {
    resizeWindow(1400);
    render(
      <BrowserRouter>
        <Sidebar sidebar={true} setSidebar={jest.fn()} page="" />
      </BrowserRouter>
    );

    const sidebarElement = screen.getByTestId("sidebar");
    expect(sidebarElement).toBeInTheDocument();
    expect(sidebarElement).not.toHaveClass("small-sidebar");
  });

  test("renders correctly with sidebar prop set to false", () => {
    render(
      <BrowserRouter>
        <Sidebar sidebar={false} setSidebar={jest.fn()} page="" />
      </BrowserRouter>
    );

    const sidebarElement = screen.getByTestId("sidebar");
    expect(sidebarElement).toBeInTheDocument();
    expect(sidebarElement).toHaveClass("small-sidebar");
  });

  test("renders correctly on home page", () => {
    setup("home", true);

    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toHaveClass("sidebar");

    const homeLink = screen.getByTestId("home-link");
    expect(homeLink.classList).toContain("active");
  });

  test("renders protected links and allows click when authenticated", () => {
    setup("home", false);

    const subscriptionsLink = screen.getByTestId("subscriptions-link");
    fireEvent.click(subscriptionsLink);

    expect(subscriptionsLink.classList).toContain("active");
  });

  test("renders You section links correctly", () => {
    setup("home", true);

    const historyLink = screen.getByTestId("history-link");
    const likedVideosLink = screen.getByTestId("liked-videos-link");

    fireEvent.click(historyLink);
    expect(historyLink.classList).toContain("active");

    fireEvent.click(likedVideosLink);
    expect(likedVideosLink.classList).toContain("active");
    expect(historyLink.classList).not.toContain("active");
  });

  test("renders Explore section links correctly", () => {
    resizeWindow(1400);
    setup("home", true);

    const premiumLink = screen.getByTestId("uTube-Premium-link");
    const gamingLink = screen.getByTestId("gaming-link");
    const liveLink = screen.getByTestId("live-link");

    fireEvent.click(premiumLink);
    expect(premiumLink.classList).toContain("active");

    fireEvent.click(gamingLink);
    expect(gamingLink.classList).toContain("active");
    expect(premiumLink.classList).not.toContain("active");

    fireEvent.click(liveLink);
    expect(liveLink.classList).toContain("active");
    expect(gamingLink.classList).not.toContain("active");
  });

  test("renders Settings section links correctly", () => {
    resizeWindow(1400);
    setup("home", true);

    const settingsLink = screen.getByTestId("settings-link");
    const reportHistoryLink = screen.getByTestId("report-history-link");
    const helpLink = screen.getByTestId("help-link");
    const feedbackLink = screen.getByTestId("send-feedback-link");

    fireEvent.click(settingsLink);
    expect(settingsLink.classList).toContain("active");

    fireEvent.click(reportHistoryLink);
    expect(reportHistoryLink.classList).toContain("active");
    expect(settingsLink.classList).not.toContain("active");

    fireEvent.click(helpLink);
    expect(helpLink.classList).toContain("active");
    expect(reportHistoryLink.classList).not.toContain("active");

    fireEvent.click(feedbackLink);
    expect(feedbackLink.classList).toContain("active");
    expect(helpLink.classList).not.toContain("active");
  });

  test("contains all shortcut links", () => {
    resizeWindow(1400);
    render(
      <BrowserRouter>
        <Sidebar sidebar={true} setSidebar={jest.fn()} page="" />
      </BrowserRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Trending")).toBeInTheDocument();
    expect(screen.getByText("Subscriptions")).toBeInTheDocument();
    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("Liked videos")).toBeInTheDocument();
    expect(screen.getByText("Subscribed")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("UTube Premium")).toBeInTheDocument();
    expect(screen.getByText("Gaming")).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Report History")).toBeInTheDocument();
    expect(screen.getByText("Help")).toBeInTheDocument();
    expect(screen.getByText("Send feedback")).toBeInTheDocument();
  });

  test("contains subscribed list", () => {
    resizeWindow(1400);
    render(
      <BrowserRouter>
        <Sidebar sidebar={true} setSidebar={jest.fn()} page="" />
      </BrowserRouter>
    );

    expect(screen.getByText("Subscribed")).toBeInTheDocument();
    expect(screen.getByText("MrBeast")).toBeInTheDocument();
    expect(screen.getByText("5-min craft")).toBeInTheDocument();
  });

  test("sets active class on click", () => {
    setup();

    const homeLink = screen.getByTestId("home-link");
    const trendingLink = screen.getByTestId("trending-link");

    fireEvent.click(trendingLink);

    expect(trendingLink).toHaveClass("active");
    expect(homeLink).not.toHaveClass("active");

    fireEvent.click(homeLink);

    expect(homeLink).toHaveClass("active");
    expect(trendingLink).not.toHaveClass("active");
  });

  test("should prevent navigation to protected routes if not authenticated", () => {
    useAuth.mockReturnValue({ isAuthenticated: false });

    setup("home", false);

    const subscriptionsLink = screen.getByTestId("subscriptions-link");
    fireEvent.click(subscriptionsLink);

    expect(subscriptionsLink).not.toHaveClass("active");

    const historyLink = screen.getByTestId("history-link");
    fireEvent.click(historyLink);

    expect(historyLink).not.toHaveClass("active");

    const likedVideosLink = screen.getByTestId("liked-videos-link");
    fireEvent.click(likedVideosLink);

    expect(likedVideosLink).not.toHaveClass("active");
  });

  test("renders correctly on video page", () => {
    setup("video", true);

    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toHaveClass("sidebar");

    const homeLink = screen.getByTestId("home-link");
    expect(homeLink.classList).toContain("active");
  });

  test("renders Home link with active class on initial render", () => {
    setup("/", true); // Render Sidebar with '/' as active page and sidebar visible

    const homeLink = screen.getByTestId("home-link");

    // Check if the home link is rendered
    expect(homeLink).toBeInTheDocument();

    // Check if the active class is applied correctly
    expect(homeLink).toHaveClass("active");
  });

  test("activates Home link on click", () => {
    setup("/", true);

    const homeLink = screen.getByTestId("home-link");

    fireEvent.click(homeLink);

    expect(homeLink).toHaveClass("active");
  });

  test("should render sidebar with menu icon, youtube logo and home page as active", () => {
    const mockSetSidebar = jest.fn();
    render(
      <BrowserRouter>
        <Sidebar sidebar={true} setSidebar={mockSetSidebar} page="video" />
      </BrowserRouter>
    );

    const menuIcon = screen.getByAltText("menu");
    expect(menuIcon).toBeInTheDocument();
    expect(screen.getByTestId("youtube-logo")).toBeInTheDocument();
    expect(screen.getByTestId("home-link")).toHaveClass("active");

    fireEvent.click(menuIcon);

    expect(screen.getByTestId("sidebar")).toHaveClass("video-sidebar");

    const trendingLink = screen.getByTestId("trending-link");
    fireEvent.click(trendingLink);

    expect(trendingLink).toHaveClass("active");

    fireEvent.click(menuIcon);

    expect(screen.getByTestId("sidebar")).toHaveClass("sidebar video-sidebar");
    expect(mockSetSidebar).toHaveBeenCalledTimes(2);
  });

  test("renders You section links correctly in video page", () => {
    setup("video", true);

    const subscriptionsLink = screen.getByTestId("subscriptions-link");
    const historyLink = screen.getByTestId("history-link");
    const likedVideosLink = screen.getByTestId("liked-videos-link");

    fireEvent.click(subscriptionsLink);
    expect(subscriptionsLink.classList).toContain("active");

    fireEvent.click(historyLink);
    expect(historyLink.classList).toContain("active");

    fireEvent.click(likedVideosLink);
    expect(likedVideosLink.classList).toContain("active");
    expect(historyLink.classList).not.toContain("active");
  });

  test("renders sidebar class correctly in video page", () => {
    setup("video", true);

    const sidebarElement = screen.getByTestId("sidebar");

    expect(sidebarElement).toHaveClass("sidebar");
    expect(sidebarElement).toHaveClass("video-sidebar");
  });

  test("sets forceSmallSidebar to true when window width is 1300px or less", () => {
    resizeWindow(1300);
    render(
      <BrowserRouter>
        <Sidebar sidebar={true} setSidebar={() => {}} page="video" />
      </BrowserRouter>
    );

    const sidebarElement = screen.getByTestId("sidebar");
    expect(sidebarElement).toHaveClass("small-sidebar");
  });

  test("sets isSmallScreen and forceSmallSidebar to false when window width is more than 1300px", () => {
    resizeWindow(1400);

    render(
      <BrowserRouter>
        <Sidebar sidebar={true} setSidebar={() => {}} page="video" />
      </BrowserRouter>
    );

    const sidebarElement = screen.getByTestId("sidebar");
    expect(sidebarElement).not.toHaveClass("small-sidebar");
  });

  test("updates class name correctly on window resize", () => {
    resizeWindow(1400);

    const { rerender } = render(
      <BrowserRouter>
        <Sidebar sidebar={true} setSidebar={() => {}} page="video" />
      </BrowserRouter>
    );

    let sidebarElement = screen.getByTestId("sidebar");
    expect(sidebarElement).not.toHaveClass("small-sidebar");

    resizeWindow(1300);

    rerender(
      <BrowserRouter>
        <Sidebar sidebar={true} setSidebar={() => {}} page="video" />
      </BrowserRouter>
    );

    sidebarElement = screen.getByTestId("sidebar");
    expect(sidebarElement).toHaveClass("small-sidebar");
  });

  test("should not contain menu from subscribe till send feedback when window width is less than 1300px in video page", () => {
    resizeWindow(1000);
    setup("video", true);

    expect(screen.queryByText("Subscribed")).not.toBeInTheDocument();
    expect(screen.queryByText("MrBeast")).not.toBeInTheDocument();
    expect(screen.queryByText("5-min craft")).not.toBeInTheDocument();
    expect(screen.queryByTestId("uTube-Premium-link")).not.toBeInTheDocument();
    expect(screen.queryByTestId("gaming-link")).not.toBeInTheDocument();
    expect(screen.queryByTestId("live-link")).not.toBeInTheDocument();
    expect(screen.queryByTestId("live-link")).not.toBeInTheDocument();
    expect(screen.queryByTestId("settings-link")).not.toBeInTheDocument();
    expect(screen.queryByTestId("report-history-link")).not.toBeInTheDocument();
    expect(screen.queryByTestId("help-link")).not.toBeInTheDocument();
    expect(screen.queryByTestId("send-feedback-link")).not.toBeInTheDocument();
  });

  test("renders sidebar class correctly when window width is more than 1300px", () => {
    resizeWindow(1400);

    render(
      <BrowserRouter>
        <Sidebar sidebar={true} setSidebar={() => {}} page="video" />
      </BrowserRouter>
    );

    const sidebarElement = screen.getByTestId("sidebar");

    expect(sidebarElement).toHaveClass("sidebar");
    expect(sidebarElement).not.toHaveClass("small-sidebar");
  });

  test("contains subscribed list in video page", () => {
    resizeWindow(1400);
    setup("video", true);

    expect(screen.getByText("Subscribed")).toBeInTheDocument();
    expect(screen.getByText("MrBeast")).toBeInTheDocument();
    expect(screen.getByText("5-min craft")).toBeInTheDocument();
  });

  test("renders Explore section links correctly in video page", () => {
    resizeWindow(1400);
    setup("video", true);

    const premiumLink = screen.getByTestId("uTube-Premium-link");
    const gamingLink = screen.getByTestId("gaming-link");
    const liveLink = screen.getByTestId("live-link");

    fireEvent.click(premiumLink);
    expect(premiumLink.classList).toContain("active");

    fireEvent.click(gamingLink);
    expect(gamingLink.classList).toContain("active");
    expect(premiumLink.classList).not.toContain("active");

    fireEvent.click(liveLink);
    expect(liveLink.classList).toContain("active");
    expect(gamingLink.classList).not.toContain("active");
  });

  test("renders Settings section links correctly in video page", () => {
    resizeWindow(1400);

    // Render Sidebar with the props
    render(
      <BrowserRouter>
        <Sidebar sidebar={true} setSidebar={() => {}} page="video" />
      </BrowserRouter>
    );

    const settingsLink = screen.getByTestId("settings-link");
    const reportHistoryLink = screen.getByTestId("report-history-link");
    const helpLink = screen.getByTestId("help-link");
    const feedbackLink = screen.getByTestId("send-feedback-link");

    fireEvent.click(settingsLink);
    expect(settingsLink.classList).toContain("active");

    fireEvent.click(reportHistoryLink);
    expect(reportHistoryLink.classList).toContain("active");
    expect(settingsLink.classList).not.toContain("active");

    fireEvent.click(helpLink);
    expect(helpLink.classList).toContain("active");
    expect(reportHistoryLink.classList).not.toContain("active");

    fireEvent.click(feedbackLink);
    expect(feedbackLink.classList).toContain("active");
    expect(helpLink.classList).not.toContain("active");
  });

  test("toggles sidebar visibility on video page", () => {
    const mockSetSidebar = jest.fn();

    render(
      <BrowserRouter>
        <Sidebar sidebar={true} setSidebar={mockSetSidebar} page="video" />
      </BrowserRouter>
    );

    const menuIcon = screen.getByTestId("menu-icon");
    fireEvent.click(menuIcon);

    // Check if the function has been called
    expect(mockSetSidebar).toHaveBeenCalledTimes(1);
    // Check if it has been called with false
    expect(mockSetSidebar).toHaveBeenCalledWith(false); // Ensure proper call
  });

  test("should not render protected links if not authenticated", () => {
    useAuth.mockReturnValue({ isAuthenticated: false });

    const mockSetSidebar = jest.fn();
    render(
      <BrowserRouter>
        <Sidebar sidebar={true} setSidebar={mockSetSidebar} page="" />
      </BrowserRouter>
    );

    const subscriptionsLink = screen.getByTestId("subscriptions-link");
    const historyLink = screen.getByTestId("history-link");
    const likedVideosLink = screen.getByTestId("liked-videos-link");

    fireEvent.click(subscriptionsLink);
    fireEvent.click(historyLink);
    fireEvent.click(likedVideosLink);

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(mockSetSidebar).not.toHaveBeenCalled();
  });

  test("renders overlay when sidebar is open on video page", () => {
    const mockSetSidebar = jest.fn();

    render(
      <BrowserRouter>
        <Video sidebar={true} setSidebar={mockSetSidebar} />
      </BrowserRouter>
    );

    expect(screen.getByTestId("overlay")).toBeInTheDocument();
  });

  test("should close sidebar when overlay is clicked", () => {
    const setSidebar = setup("video", true);
    render(
      <BrowserRouter>
        <Video sidebar={true} setSidebar={setSidebar} />
      </BrowserRouter>
    );
    const overlay = screen.getByTestId("overlay");
    fireEvent.click(overlay);

    expect(setSidebar).toHaveBeenCalledWith(false);
  });

  test("prevents scrolling when sidebar is open on video page", () => {
    setup("video", true);

    expect(document.body.style.overflow).toBe("hidden");
  });

  test("allows scrolling when sidebar is closed on video page", () => {
    const setSidebar = setup("video", true);

    render(
      <BrowserRouter>
        <Video sidebar={true} setSidebar={setSidebar} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByTestId("overlay"));
    fireEvent.click(screen.getByTestId("overlay"));
    setup("video", false);

    expect(document.body.style.overflow).toBe("auto");
  });
});
