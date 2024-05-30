import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import RegisterPage from "../RegisterPage";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import {registerUser} from '../RegisterApi';

const mockNavigate = jest.fn();

jest.mock('../RegisterApi.js');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate ,
}));

describe("Register page", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

    test('check the text are present on left side', () => {
        render(
            <MemoryRouter initialEntries={[{ pathname: '/signup'}]}>
                <RegisterPage />
            </MemoryRouter>
        );
        const utubeText = screen.getByTestId("utube-text");
        expect(utubeText.textContent).toBe("UTube");
    
        const staticText = screen.getByTestId("static-text");
        expect(staticText.textContent).toMatch(/create a utube account/i);
      });

      test.skip('check the labels are present on right side', () => {
        render(
            <MemoryRouter initialEntries={[{ pathname: '/signup'}]}>
                <RegisterPage />
            </MemoryRouter>
        );
        const emailField = screen.getByLabelText(/email/i);
        const channelField = screen.getByLabelText(/channel name/i);
        const passwordField = screen.getByLabelText(/password/i);
        const confirmField = screen.getByLabelText(/confirm password/i);

        expect(emailField).toBeInTheDocument();
        expect(channelField).toBeInTheDocument();
        expect(passwordField).toBeInTheDocument();
        expect(confirmField).toBeInTheDocument();
      });

      test('should display error messages when all fields are empty', () => {
        render(
          <BrowserRouter>
          <RegisterPage />
          </BrowserRouter>
        )
        fireEvent.click(screen.getByText(/sign up/i));

        expect(screen.getByText(/Enter an email/i)).toBeInTheDocument();
        expect(screen.getByText(/Enter channel name/i)).toBeInTheDocument();
        expect(screen.getByText(/Enter password/i)).toBeInTheDocument();
        expect(screen.getByText(/Enter confirm password/i)).toBeInTheDocument();
      });

      test('with correct data, api call should responds to sign in page', async() => {
        registerUser.mockResolvedValue({token: "fake-token"});
        render(
          <BrowserRouter>
          <RegisterPage/>
          </BrowserRouter>
        )

        fireEvent.change(screen.getByTestId("email"), {target : {value: "test01@gmail.com"}});
        fireEvent.change(screen.getByTestId("channel"), {target : {value: "life on earth"}});
        fireEvent.change(screen.getByTestId("password"), {target : {value: "12345678"}});
        fireEvent.change(screen.getByTestId("confirmPassword"), {target : {value: "12345678"}});

        fireEvent.click(screen.getByText(/sign up/i));

        await waitFor(() => {expect(localStorage.getItem("token")).toBe("fake-token") });
        await waitFor(() => {expect(mockNavigate).toHaveBeenCalledWith("/signin") });
      });

      test('if registration fails, it should show error message', async() => {
        registerUser.mockRejectedValue({
          status: 500,
          data: { message: "Registration failed" }
      });  

        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByTestId("email"), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByTestId("channel"), { target: { value: 'testChannel' } });
        fireEvent.change(screen.getByTestId("password"), { target: { value: 'password123' } });
        fireEvent.change(screen.getByTestId("confirmPassword"), { target: { value: 'password123' } });

        fireEvent.click(screen.getByText(/sign up/i));

        expect(await screen.findByText(/oops something went wrong/i)).toBeInTheDocument();
    });
}) 