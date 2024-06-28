import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import Navbar from "../Navbar"
import menuIcon from '../../../assets/menu.png'
import logo from '../../../assets/logo.png'
import searchIcon from '../../../assets/search.png'
import uploadIcon from '../../../assets/upload.png'
import notificationIcon from '../../../assets/notification.png'
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../../util/AuthContext"
import { searchText } from "../../Search/SearchApi"

const setSidebarMock = jest.fn();
const MockedAuthProvider = ({ children }) => (
    <AuthProvider>
      {children}
    </AuthProvider>
  );

  const mockNavigate = jest.fn();
  jest.mock('../../Search/SearchApi.js');
  
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate ,
  }));

describe("Navbar", () => {

    beforeEach(() => {
        jest.clearAllMocks();
      });

    test('Menu icon must have src={menuIcon} alt="menu"', () => {
        render(
        <MemoryRouter initialEntries={[{ pathname: '/'}]}>
            <MockedAuthProvider>
            <Navbar />
            </MockedAuthProvider>
        </MemoryRouter>
        )
        const menuImg = screen.getByTestId('menu-icon');
        expect(menuImg).toHaveAttribute('src', menuIcon);
        expect(menuImg).toHaveAttribute('alt', 'menu');
    });

    test('Logo must have src={logo} alt="logo"', () => {
        render(
        <MemoryRouter initialEntries={[{ pathname: '/'}]}>
            <MockedAuthProvider>
            <Navbar />
            </MockedAuthProvider>
        </MemoryRouter>
        )
        const logoImg = screen.getByTestId('youtube-logo');
        expect(logoImg).toHaveAttribute('src', logo);
        expect(logoImg).toHaveAttribute('alt', 'logo');
    });

    test('Should have search placeholder', () => {
        render(
        <MemoryRouter initialEntries={[{ pathname: '/'}]}>
            <MockedAuthProvider>
            <Navbar />
            </MockedAuthProvider>
        </MemoryRouter>
        )
        const searchInput = screen.queryByPlaceholderText('Search');
        fireEvent.change(searchInput, {target: {value: 'test'}});
        expect(searchInput.value).toBe('test');
    });

    test('Search icon must have src={searchIcon} alt="search-icon"', () => {
        render(
        <MemoryRouter initialEntries={[{ pathname: '/'}]}>
            <MockedAuthProvider>
            <Navbar />
            </MockedAuthProvider>
        </MemoryRouter>
        )
        const searchImg = screen.getByTestId('search-icon');
        expect(searchImg).toHaveAttribute('src', searchIcon);
        expect(searchImg).toHaveAttribute('alt', 'search');
    });

    test('Upload icon must have src={uploadIcon} alt="upload"', () => {
        render(
        <MemoryRouter initialEntries={[{ pathname: '/'}]}>
            <MockedAuthProvider>
            <Navbar />
            </MockedAuthProvider>
        </MemoryRouter>
        )
        const uploadImg = screen.getByTestId('upload-icon');
        expect(uploadImg).toHaveAttribute('src', uploadIcon);
        expect(uploadImg).toHaveAttribute('alt', 'upload');
    });

    test('Notification icon must have src={notificationIcon} alt="notify"', () => {
        render(
        <MemoryRouter initialEntries={[{ pathname: '/'}]}>
            <MockedAuthProvider>
            <Navbar />
            </MockedAuthProvider>
        </MemoryRouter>
        )
        const notificationImg = screen.getByTestId('notify-icon');
        expect(notificationImg).toHaveAttribute('src', notificationIcon);
        expect(notificationImg).toHaveAttribute('alt', 'notify');
    });

    test('displays the sign-in link with icon and text when not on sign-in or sign-up page', () => {
        render(
        <MemoryRouter initialEntries={[{ pathname: '/'}]}>
            <MockedAuthProvider>
            <Navbar />
            </MockedAuthProvider>
        </MemoryRouter>
        )
        // Check for the link to the sign-in page
        const signInLink = screen.getByRole('link', { name: /sign in/i });
        expect(signInLink).toBeInTheDocument();

        // Check for the FontAwesome icon within the link
        const icon = screen.getByTestId('signin-icon');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('signin-icon');
        expect(icon).toHaveStyle({ color: '#2d82d2' });

        // Check for the sign-in text within the link
        const signInText = screen.getByText(/sign in/i);
        expect(signInText).toBeInTheDocument();
        expect(signInText).toHaveClass('signin-text');
        });

    test('does not display the sign-in link on sign-in page', () => {
        render(
        <MemoryRouter initialEntries={['/signin']}>
        <MockedAuthProvider>
            <Navbar />
            </MockedAuthProvider>
        </MemoryRouter>
        );
        
        const signInLink = screen.queryByRole('link', { name: /sign in/i });
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

    test.skip('clicking sign-in link navigates to sign-in page without displaying navbar', () => {
        render(
          <MemoryRouter initialEntries={['/']}>
            <MockedAuthProvider>
            <Navbar />
            </MockedAuthProvider>
          </MemoryRouter>
        );
    
        // Check for the sign-in link
        const signInLink = screen.getByRole('link', { name: /sign in/i });
        fireEvent.click(signInLink);
    
        // Verify that the sign-in page does not display the navbar
        const navbarElement = screen.queryByTestId('menu-icon'); // Assuming 'menu-icon' is a test ID for navbar
        expect(navbarElement).not.toBeInTheDocument();
      });

      test('toggleSidebar toggles sidebar state', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <MockedAuthProvider>
                <Navbar setSidebar={setSidebarMock} />
                </MockedAuthProvider>
            </MemoryRouter>
        );
    
        const toggleButton = screen.getByTestId('menu-icon');
    
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

        test('clicking profile icon toggles user profile display', async () => {
            render(
              <MemoryRouter initialEntries={['/']}>
                <MockedAuthProvider>
                  <Navbar />
                </MockedAuthProvider>
              </MemoryRouter>
            );
        
            // Find profile icon and click it
            const profileIcon = screen.getByTestId('profile-icon');
            fireEvent.click(profileIcon);
        
            // Use waitFor to wait for the user profile to be visible
            await waitFor(() => {
              const userProfile = screen.getByText('User Profile');
              expect(userProfile).toBeInTheDocument();
            });
        
            // Verify that user profile is visible
            const userProfile = screen.getByText('User Profile');
            expect(userProfile).toBeInTheDocument();
        
            // Click profile icon again to hide user profile
            fireEvent.click(profileIcon);
        
            // Use waitFor to wait for the user profile to be hidden
            await waitFor(() => {
              const userProfile = screen.queryByText('User Profile');
              expect(userProfile).not.toBeInTheDocument();
            });
        
            // Verify that user profile is hidden
            const hiddenUserProfile = screen.queryByText('User Profile');
            expect(hiddenUserProfile).not.toBeInTheDocument();
          });
          
        test('searching valid text, should give the result', async() => {
            searchText.mockResolvedValue({ data: [{ id: 1, name: 'test result' }] });
            render(
                <MemoryRouter initialEntries={['/']}>
                    <MockedAuthProvider>
                    <Navbar setSidebar={setSidebarMock}/>
                    </MockedAuthProvider>
                </MemoryRouter>
            )
    
            const searchInput = screen.getByPlaceholderText(/Search/i);
            fireEvent.change(searchInput, { target: { value: 'sample' } });
            fireEvent.click(screen.getByTestId('search-icon'));

            await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/search-results', { state: { results: [{ id: 1, name: 'test result' }] } }));
          });

          test('searching invalid text should not navigate', async () => {
            searchText.mockResolvedValue({ data: [] });
            render(
              <MemoryRouter initialEntries={['/']}>
                <MockedAuthProvider>
                  <Navbar setSidebar={setSidebarMock} />
                </MockedAuthProvider>
              </MemoryRouter>
            );
        
            const searchInput = screen.getByPlaceholderText(/Search/i);
            fireEvent.change(searchInput, { target: { value: 'invalid' } });
            fireEvent.click(screen.getByTestId('search-icon'));
        
            await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
          });

          test('displays error when search fails', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            searchText.mockRejectedValue(new Error('Network Error'));
        
            render(
              <MemoryRouter initialEntries={['/']}>
                <MockedAuthProvider>
                  <Navbar setSidebar={setSidebarMock} />
                </MockedAuthProvider>
              </MemoryRouter>
            );
        
            const searchInput = screen.getByPlaceholderText(/Search/i);
            fireEvent.change(searchInput, { target: { value: 'error' } });
            fireEvent.click(screen.getByTestId('search-icon'));
        
            await waitFor(() => expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching search results:', expect.any(Error)));
        
            consoleErrorSpy.mockRestore();
          });
        
});