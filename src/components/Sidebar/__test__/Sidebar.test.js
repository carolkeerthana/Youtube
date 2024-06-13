import { fireEvent, render, screen } from "@testing-library/react";
import Sidebar from "../Sidebar";
import { BrowserRouter } from "react-router-dom";

describe("Sidebar", () => {
  const setup = (page = '', sidebar = false) => {
  const setSidebar =  jest.fn();
    render(
      <BrowserRouter>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} page={page} />
      </BrowserRouter>
    );
    return setSidebar;
  };

    test('renders correctly with sidebar prop set to true', () => {
      render(<Sidebar sidebar={true} />);
  
      const sidebarElement = screen.getByTestId('sidebar');
      expect(sidebarElement).toBeInTheDocument();
      expect(sidebarElement).not.toHaveClass('small-sidebar');
    });

    test('renders correctly with sidebar prop set to false', () => {
        render(<Sidebar sidebar={false} />);
    
        const sidebarElement = screen.getByTestId('sidebar');
        expect(sidebarElement).toBeInTheDocument();
        expect(sidebarElement).toHaveClass('small-sidebar');
      });

      test('contains all shortcut links', () => {
        render(<Sidebar sidebar={true} />);

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
        render(<Sidebar sidebar={true} />);
    
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

      test.skip('should render sidebar with menu icon and home page as active', () => {
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

        expect(screen.getByTestId('sidebar')).toHaveClass('hidden-sidebar');
        expect(mockSetSidebar).toHaveBeenCalledTimes(2);
      });

      test.skip('should close sidebar when overlay is clicked', () => {
        const setSidebar = setup('video', true);
    
        const overlay = screen.getByTestId('overlay');

        fireEvent.click(overlay);

        expect(setSidebar).toHaveBeenCalledWith(false);
      });
});