import { fireEvent, render, screen } from "@testing-library/react";
import Sidebar from "../Sidebar";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "../../../util/AuthContext";

jest.mock("../../../util/AuthContext.js", () => ({
  useAuth: jest.fn(),
}));

describe("Sidebar", () => {
  const setup = (page, sidebar) => {
  const setSidebar =  jest.fn();
    render(
      <BrowserRouter>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} page={page} />
      </BrowserRouter>
    );
    return setSidebar;
  };

    beforeEach(() => {
      useAuth.mockReturnValue({ isAuthenticated: true });
    });

    test('renders correctly with sidebar prop set to true', () => {
      render(
        <BrowserRouter>
          <Sidebar sidebar={true} setSidebar={jest.fn()} page="" />
        </BrowserRouter>
      );
  
      const sidebarElement = screen.getByTestId('sidebar');
      expect(sidebarElement).toBeInTheDocument();
      expect(sidebarElement).not.toHaveClass('small-sidebar');
    });

    test('renders correctly with sidebar prop set to false', () => {
        render(
          <BrowserRouter>
            <Sidebar sidebar={false} setSidebar={jest.fn()} page="" />
          </BrowserRouter>
        );
    
        const sidebarElement = screen.getByTestId('sidebar');
        expect(sidebarElement).toBeInTheDocument();
        expect(sidebarElement).toHaveClass('small-sidebar');
      });

      test('contains all shortcut links', () => {
        render(
          <BrowserRouter>
            <Sidebar sidebar={true} setSidebar={jest.fn()} page="" />
          </BrowserRouter>
        );

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Trending')).toBeInTheDocument();
        expect(screen.getByText('Subscriptions')).toBeInTheDocument();
        expect(screen.getByText('You')).toBeInTheDocument();
        expect(screen.getByText('History')).toBeInTheDocument();
        expect(screen.getByText('Liked videos')).toBeInTheDocument();
        expect(screen.getByText('Subscribed')).toBeInTheDocument();
        expect(screen.getByText('Explore')).toBeInTheDocument();
        expect(screen.getByText('UTube Premium')).toBeInTheDocument();
        expect(screen.getByText('Gaming')).toBeInTheDocument();
        expect(screen.getByText('Live')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Report History')).toBeInTheDocument();
        expect(screen.getByText('Help')).toBeInTheDocument();
        expect(screen.getByText('Send feedback')).toBeInTheDocument();
    });

    test('contains subscribed list', () => {
        render(
          <BrowserRouter>
            <Sidebar sidebar={true} setSidebar={jest.fn()} page="" />
          </BrowserRouter>
        );
    
        expect(screen.getByText('Subscribed')).toBeInTheDocument();
        expect(screen.getByText('MrBeast')).toBeInTheDocument();
        expect(screen.getByText('5-min craft')).toBeInTheDocument();
      });

      test('sets active class on click', () => {
        setup();
    
        const homeLink = screen.getByTestId('home-link');
        const trendingLink = screen.getByTestId('trending-link');

        fireEvent.click(trendingLink);

        expect(trendingLink).toHaveClass('active');
        expect(homeLink).not.toHaveClass('active');

        fireEvent.click(homeLink);

        expect(homeLink).toHaveClass('active');
        expect(trendingLink).not.toHaveClass('active');
      });

      test('should render sidebar with menu icon and home page as active', () => {
        const mockSetSidebar = jest.fn();
        render(
          <BrowserRouter>
        <Sidebar sidebar={true} setSidebar={mockSetSidebar} page="video" />
        </BrowserRouter>);

        const menuIcon = screen.getByAltText('menu');
        expect(menuIcon).toBeInTheDocument();
        expect(screen.getByTestId('home-link')).toHaveClass('active');

        fireEvent.click(menuIcon);

        expect(screen.getByTestId('sidebar')).toHaveClass('video-sidebar');

        const trendingLink = screen.getByTestId('trending-link');
        fireEvent.click(trendingLink);

        expect(trendingLink).toHaveClass('active');

        fireEvent.click(menuIcon);

        expect(screen.getByTestId('sidebar')).toHaveClass('sidebar video-sidebar');
        expect(mockSetSidebar).toHaveBeenCalledTimes(2);
      });

      test("should not render protected links if not authenticated", () => {
        useAuth.mockReturnValue({ isAuthenticated: false });
    
        const mockSetSidebar = jest.fn();
        render(
          <BrowserRouter>
            <Sidebar sidebar={true} setSidebar={mockSetSidebar} page="" />
          </BrowserRouter>
        );
    
        const subscriptionsLink = screen.getByTestId('subscriptions-link');
        const historyLink = screen.getByTestId('history-link');
        const likedVideosLink = screen.getByTestId('liked-videos-link');

        fireEvent.click(subscriptionsLink);
        fireEvent.click(historyLink);
        fireEvent.click(likedVideosLink);

        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(mockSetSidebar).not.toHaveBeenCalled();
      });

      test("should prevent navigation to protected routes if not authenticated", () => {
        useAuth.mockReturnValue({ isAuthenticated: false });
    
        render(
          <BrowserRouter>
            <Sidebar sidebar={true} setSidebar={jest.fn()} page="" />
          </BrowserRouter>
        );
    
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

      test('should close sidebar when overlay is clicked', () => {
        const setSidebar = setup('video', true);
    
        const overlay = screen.getByTestId('overlay');

        fireEvent.click(overlay);

        expect(setSidebar).toHaveBeenCalledWith(false);
      });

      test('should lock body scroll when sidebar is open on video page', () => {
        setup('video', true);
      
        expect(document.body.style.overflow).toBe('hidden');
      });
      
      test('should unlock body scroll when sidebar is closed on video page', () => {
        setup('video', true);
      
        fireEvent.click(screen.getByTestId('overlay'));
        fireEvent.click(screen.getByTestId('overlay'));
        setup('video', false);
      
        expect(document.body.style.overflow).toBe('auto');
      });
      
      
});