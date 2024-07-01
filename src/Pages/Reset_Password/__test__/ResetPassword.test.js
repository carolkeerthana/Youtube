import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import ResetPassword from '../ResetPassword';
import { resetPassword } from '../ResetPasswordApi';
import ErrorPage from '../../Error/ErrorPage';

const mockNavigate = jest.fn();
// Mock useParams and useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ token: 'mock-token' }),
  useNavigate: () => mockNavigate,
}));

// Mock resetPassword function
jest.mock('../ResetPasswordApi', () => ({
  resetPassword: jest.fn(),
}));

describe('ResetPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders reset password form', () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    expect(screen.getByTestId('utube-text')).toBeInTheDocument();
    expect(screen.getByTestId('static-text')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();
  });

  test('should display error messages when all fields are empty', () => {
    render(
      <BrowserRouter>
      <ResetPassword />
      </BrowserRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

    expect(screen.getByText(/Enter password/i)).toBeInTheDocument();
    expect(screen.getByText(/Confirm your password/i)).toBeInTheDocument();
  }); 

  test('validates form fields on submission', async () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Reset Password' });

    fireEvent.change(passwordInput, { target: { value: 'test' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'test123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  test('focus and blur events on password input', () => {
    render(<ResetPassword />);

    const passwordInput = screen.getByLabelText('New Password');
    const passwordContainer = screen.getByTestId('password-container');

    expect(passwordContainer).not.toHaveClass('focused');

    fireEvent.focus(passwordInput);

    expect(passwordContainer).toHaveClass('focused');

    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.blur(passwordInput);

    expect(passwordContainer).toHaveClass('focused');

    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.blur(passwordInput);

    expect(passwordContainer).not.toHaveClass('focused');
  });

  test('focus and blur events on confirm password input', () => {
    render(<ResetPassword />);

    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const confirmPasswordContainer = screen.getByTestId('confirm-password-container');

    expect(confirmPasswordContainer).not.toHaveClass('focused');

    fireEvent.focus(confirmPasswordInput);

    expect(confirmPasswordContainer).toHaveClass('focused');

    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } });
    fireEvent.blur(confirmPasswordInput);

    expect(confirmPasswordContainer).toHaveClass('focused');

    fireEvent.change(confirmPasswordInput, { target: { value: '' } });
    fireEvent.blur(confirmPasswordInput);

    expect(confirmPasswordContainer).not.toHaveClass('focused');
  });

  test('submits the form successfully', async () => {
    resetPassword.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: 'Reset Password' });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(resetPassword).toHaveBeenCalledWith('mock-token', 'password123');

    await waitFor(() => {
      expect(screen.getByText('Your password has been reset successfully.')).toBeInTheDocument();
    });
  });

  test('if reset password fails, it should redirect to error page and shows error message', async() => {
    const errorResponse = {
      message: "An error occurred. please try again",
      status: 500,
      data: {message: "Internal Server Error"}
    }
    resetPassword.mockRejectedValueOnce(errorResponse); 

    render(
        <BrowserRouter>
            <ResetPassword />
        </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('New Password'), {target : {value: "password123"}});
    fireEvent.change(screen.getByLabelText('Confirm Password'), {target : {value: "password123"}});

    fireEvent.click(screen.getByRole('button', { name: 'Reset Password' }));

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

    test('displays error message when password reset fails', async () => {
        resetPassword.mockResolvedValueOnce({ success: false });
    
        render(<ResetPassword />);
    
        fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'Password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'Password123' } });
    
        fireEvent.submit(screen.getByRole('button', { name: /reset password/i }));

        await waitFor(() => {
          expect(screen.getByText('Password reset failed. Please try again.')).toBeInTheDocument();
        });
      });

});