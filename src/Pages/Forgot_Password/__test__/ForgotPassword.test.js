import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ForgotPassword from "../ForgotPassword";
import { forgotPasswordApi } from "../ForgotPasswordApi";
import ErrorPage from "../../Error/ErrorPage";
import FormInput from "../FormInput";


jest.mock('../ForgotPasswordApi.js')

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate ,
}));

describe("Forgot Password", () => {

    beforeEach(() => {
        jest.clearAllMocks();
      });

    test('renders forgot password page with all elements', () => {
        render(
            <BrowserRouter>
            <ForgotPassword/>
            </BrowserRouter>
        )

        expect(screen.getByTestId('utube-text')).toHaveTextContent('UTube');
        expect(screen.getByTestId('static-text')).toHaveTextContent('Account recovery');
        expect(screen.getByTestId('p-text')).toHaveTextContent('Enter the email address to get the reset password link');
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    test('displays error message, if email field is empty', () => {
        render(
            <BrowserRouter>
            <ForgotPassword/>
            </BrowserRouter>
        )

        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        expect(screen.getByText(/Enter an email/i)).toBeInTheDocument();
    });

    test('Clear fieldError when the user starts typing in the email field', () => {
        render(
            <BrowserRouter>
            <ForgotPassword/>
            </BrowserRouter>
        )

        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        expect(screen.getByText(/Enter an email/i)).toBeInTheDocument();

        const emailInput = screen.getByLabelText(/email/i);
        fireEvent.change(emailInput, {target: {value: 't'}});

        expect(screen.queryByText(/Enter an email/i)).not.toBeInTheDocument();
    });

    test('displays error message, if email is invalid', () => {
        render(
            <BrowserRouter>
            <ForgotPassword/>
            </BrowserRouter>
        )

        const emailInput = screen.getByLabelText(/email/i);
        fireEvent.change(emailInput, {target: {value: 'testgmail.com'}});

        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        expect(screen.getByText(/Please enter a valid email address!/i)).toBeInTheDocument();
    });

    test('display success message when email is valid', async() => {
        forgotPasswordApi.mockResolvedValueOnce({success: true})
        render(
            <BrowserRouter>
            <ForgotPassword/>
            </BrowserRouter>
        )

        const emailInput = screen.getByLabelText(/email/i);
        fireEvent.change(emailInput, {target: {value: 'test@gmail.com'}});

        fireEvent.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
        expect(screen.getByText('An email has been sent to your email address to reset your password')).toBeInTheDocument();
        })
    });

    test('display error message when email is not registered', async() => {
        forgotPasswordApi.mockResolvedValueOnce({success: false, error: 'There is no user with that email'})
        render(
            <BrowserRouter>
            <ForgotPassword/>
            </BrowserRouter>
        )

        const emailInput = screen.getByLabelText(/email/i);
        fireEvent.change(emailInput, {target: {value: 'test@gmail.com'}});

        fireEvent.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
        expect(screen.getByText('There is no user with that email')).toBeInTheDocument();
        })

    });

    test.skip('when clicking back button, should navigate to sign in page', async() => {
        render(
            <BrowserRouter>
            <ForgotPassword/>
            </BrowserRouter>
        )

        const backButton = screen.getByRole('button', { name: /back/i });
        expect(backButton).toBeInTheDocument();

        backButton.click();

        await waitFor(() => {
            // Check if the sign-in content is rendered
            expect(screen.getByText('Sign in')).toBeInTheDocument();
          });
    });

    test('if registration fails, it should redirect to error page and shows error message', async() => {
        const errorResponse = {
          message: "An error occurred. please try again",
          status: 500,
          data: {message: "Internal Server Error"}
        }
        forgotPasswordApi.mockRejectedValueOnce(errorResponse); 

        render(
            <BrowserRouter>
                <ForgotPassword/>
            </BrowserRouter>
        );

        const emailInput = screen.getByLabelText(/email/i);
        fireEvent.change(emailInput, {target: {value: 'test@gmail.com'}});

        fireEvent.click(screen.getByRole('button', { name: /submit/i }));

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

    test('should handle onFocus and onBlur events', () => {
        // Render the FormInput component with a label matching the text content
        render(<FormInput label="Email" />); // Adjust label text as per your component
      
        // Find the input element by its associated label text
        const inputElement = screen.getByLabelText('Email');
        expect(inputElement).toBeInTheDocument();
      
        // Simulate onFocus event
        fireEvent.focus(inputElement);
        expect(inputElement.classList.contains('focused')).toBe(true); // Check if 'focused' class is applied
      
        // Simulate onBlur event with empty value
        fireEvent.change(inputElement, { target: { value: '' } });
        fireEvent.blur(inputElement);
        expect(inputElement.classList.contains('focused')).toBe(false); // Check if 'focused' class is removed
      
        // Simulate onBlur event with non-empty value
        fireEvent.change(inputElement, { target: { value: 'example@example.com' } });
        fireEvent.blur(inputElement);
        expect(inputElement.classList.contains('focused')).toBe(true); // Check if 'focused' class is applied again
      });
    


});