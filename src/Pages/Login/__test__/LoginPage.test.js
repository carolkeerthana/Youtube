import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginPage from "../LoginPage";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import {loginUser} from '../LoginApi';
import ErrorPage from "../../Error/ErrorPage";

const mockNavigate = jest.fn();
jest.mock('../LoginApi.js');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate ,
}));
describe('Login page', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login page with all elements', () => {
    render(
        <BrowserRouter>
            <LoginPage />
        </BrowserRouter>
    );
    expect(screen.getByTestId('utube-text')).toHaveTextContent('UTube');
    expect(screen.getByTestId('signin-text')).toHaveTextContent('Sign in');
    expect(screen.getByTestId('text')).toHaveTextContent('to continue to UTube');
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('handles change correctly', () => {
    render(
      <BrowserRouter>
            <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });

    expect(emailInput.value).toBe('test@gmail.com');
    expect(passwordInput.value).toBe('Password123');
  });

  test('should display error messages when all fields are empty', () => {
    render(
      <BrowserRouter>
      <LoginPage />
      </BrowserRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/Enter an email/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter password/i)).toBeInTheDocument();
  });

  test('if email & password are not valid', () => {
    render(
      <BrowserRouter>
      <LoginPage />
      </BrowserRouter>
    )

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'testgmail.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/Enter a valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/Password must be at least 8 characters long/i)).toBeInTheDocument();
  });

  test('should handle onFocus and onBlur events for email and password fields', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
  
    // Simulate focus event on email input
    fireEvent.focus(emailInput);
    expect(emailInput.className.includes('focused')).toBe(true);
  
    // Simulate blur event with non-empty value on email input
    fireEvent.change(emailInput, { target: { value: 'example@example.com' } });
    fireEvent.blur(emailInput);
    expect(emailInput.className.includes('focused')).toBe(true);
  
    // Simulate blur event with empty value on email input
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.blur(emailInput);
    expect(emailInput.className.includes('focused')).toBe(false);
  
    // Simulate focus event on password input
    fireEvent.focus(passwordInput);
    expect(passwordInput.className.includes('focused')).toBe(true);
  
    // Simulate blur event with non-empty value on password input
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.blur(passwordInput);
    expect(passwordInput.className.includes('focused')).toBe(true);
  
    // Simulate blur event with empty value on password input
    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.blur(passwordInput);
    expect(passwordInput.className.includes('focused')).toBe(false);
  });


  test('with correct data, api call should responds to home page', async() => {
    loginUser.mockResolvedValue({token: "fake-token"});
    render(
      <BrowserRouter>
            <LoginPage />
      </BrowserRouter>
    )

    fireEvent.change(screen.getByLabelText(/email/i), {target : {value: "test@gmail.com"}});
    fireEvent.change(screen.getByLabelText(/password/i), {target : {value: "12345678"}});

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {expect(localStorage.getItem("token")).toBe("fake-token") });
    await waitFor(() => {expect(mockNavigate).toHaveBeenCalledWith("/") });
  });

  test('if login fails, it should redirect to error page and shows error message', async() => {
    const errorResponse = {
      message: "An error occurred. please try again",
      status: 500,
      data: {message: "Internal Server Error"}
    }
    loginUser.mockRejectedValueOnce(errorResponse); 

    render(
        <BrowserRouter>
            <LoginPage />
        </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {target : {value: "test@gmail.com"}});
    fireEvent.change(screen.getByLabelText(/password/i), {target : {value: "12345678"}});

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/error")
    })

    render(
      <BrowserRouter>
      <ErrorPage/>
      </BrowserRouter>
    )

    expect(screen.getByText(/Couldn't sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/Oops something went wrong/i)).toBeInTheDocument();
});

});