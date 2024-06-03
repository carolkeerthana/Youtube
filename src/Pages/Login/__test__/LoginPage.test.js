import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginPage from "../LoginPage";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import {loginUser} from '../LoginApi';

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

});