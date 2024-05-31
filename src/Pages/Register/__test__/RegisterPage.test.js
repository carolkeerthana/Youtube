import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import RegisterPage from "../RegisterPage";
import { BrowserRouter} from "react-router-dom";
import {registerUser} from '../RegisterApi';
import ErrorPage from "../../Error/ErrorPage";

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

  test('should render RegisterPage correctly', () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('channel')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByTestId('confirmPassword')).toBeInTheDocument();
  });

    test('check the text are present on left side', () => {
      render(
        <BrowserRouter>
        <RegisterPage/>
        </BrowserRouter>
      )
        const utubeText = screen.getByTestId("utube-text");
        expect(utubeText.textContent).toBe("UTube");
    
        const staticText = screen.getByTestId("static-text");
        expect(staticText.textContent).toMatch(/create a utube account/i);
      });

      test.skip('check the labels are present on right side', () => {
        render(
          render(
            <BrowserRouter>
            <RegisterPage/>
            </BrowserRouter>
          )
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

      test('should update formData when input changes', () => {
        render(
          <BrowserRouter>
          <RegisterPage/>
          </BrowserRouter>
        )

        const emailInput = screen.getByTestId("email");
        const channelInput = screen.getByTestId("channel");
        const passwordInput = screen.getByTestId("password");
        const confirmPasswordInput = screen.getByTestId("confirmPassword");

        fireEvent.change(emailInput, {target: {value: "test01@gmail.com"}});
        fireEvent.change(channelInput, {target: {value: "life on earth"}});
        fireEvent.change(passwordInput, {target: {value: "12345678"}});
        fireEvent.change(confirmPasswordInput, {target: {value: "12345678"}});

        expect(emailInput.value).toBe("test01@gmail.com");
        expect(channelInput.value).toBe("life on earth");
        expect(passwordInput.value).toBe("12345678");
        expect(confirmPasswordInput.value).toBe("12345678");
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

      test('if password & confirm password does not match', () => {
        render(
          <BrowserRouter>
          <RegisterPage/>
          </BrowserRouter>
        )

        fireEvent.change(screen.getByTestId("email"), {target : {value: "test01@gmail.com"}});
        fireEvent.change(screen.getByTestId("channel"), {target : {value: "life on earth"}});
        fireEvent.change(screen.getByTestId("password"), {target : {value: "12345678"}});
        fireEvent.change(screen.getByTestId("confirmPassword"), {target : {value: "74945093839"}});

        fireEvent.click(screen.getByText(/sign up/i));

        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
      });

      test('should throw error message if channel name is below 3 characters', () => {
        render(
          <BrowserRouter>
          <RegisterPage/>
          </BrowserRouter>
        )

        fireEvent.change(screen.getByTestId("email"), {target : {value: "test01@gmail.com"}});
        fireEvent.change(screen.getByTestId("channel"), {target : {value: "li"}});
        fireEvent.change(screen.getByTestId("password"), {target : {value: "12345678"}});
        fireEvent.change(screen.getByTestId("confirmPassword"), {target : {value: "12345678"}});

        fireEvent.click(screen.getByText(/sign up/i));

        expect(screen.getByText(/Channel name must be at least 3 characters long/i)).toBeInTheDocument();
      });

      test('should throw error message if password is below 8 characters', () => {
        render(
          <BrowserRouter>
          <RegisterPage/>
          </BrowserRouter>
        )

        fireEvent.change(screen.getByTestId("email"), {target : {value: "test01@gmail.com"}});
        fireEvent.change(screen.getByTestId("channel"), {target : {value: "life on earth"}});
        fireEvent.change(screen.getByTestId("password"), {target : {value: "1234"}});
        fireEvent.change(screen.getByTestId("confirmPassword"), {target : {value: "12345678"}});

        fireEvent.click(screen.getByText(/sign up/i));

        expect(screen.getByText(/Password must be at least 8 characters long/i)).toBeInTheDocument();
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

      test('if registration fails, it should redirect to error page and shows error message', async() => {
        const errorResponse = {
          message: "An error occurred. please try again",
          status: 500,
          data: {message: "Internal Server Error"}
        }
        registerUser.mockRejectedValueOnce(errorResponse); 

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
}) 