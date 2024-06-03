import { render, screen } from "@testing-library/react";
import Sidebar from "../Sidebar";

describe("Sidebar", () => {

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
        expect(screen.getByText('Gaming')).toBeInTheDocument();
        expect(screen.getByText('Automobiles')).toBeInTheDocument();
        expect(screen.getByText('Sports')).toBeInTheDocument();
        expect(screen.getByText('Entertainment')).toBeInTheDocument();
        expect(screen.getByText('Technology')).toBeInTheDocument();
        expect(screen.getByText('Music')).toBeInTheDocument();
        expect(screen.getByText('Blogs')).toBeInTheDocument();
        expect(screen.getByText('News')).toBeInTheDocument();
    });

    test('contains subscribed list', () => {
        render(<Sidebar sidebar={true} />);
    
        expect(screen.getByText('Subscribed')).toBeInTheDocument();
        expect(screen.getByText('MrBeast')).toBeInTheDocument();
        expect(screen.getByText('5-min craft')).toBeInTheDocument();
      });
});