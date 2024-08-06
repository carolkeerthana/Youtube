import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginPage from "../LoginPage";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { loginUser } from "../LoginApi";
import ErrorPage from "../../Error/ErrorPage";
import { AuthProvider } from "../../../util/AuthContext";
import FormInput from "../../../util/FormInput";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import CustomNotification from "../../Register/CustomNotification";

const FormInputsWrapper = ({
  emailValue,
  passwordValue,
  emailError,
  passwordError,
}) => (
  <>
    <FormInput
      id="email"
      label="Email"
      value={emailValue}
      onChange={() => {}}
      errorMessage={emailError}
      dataTestId="email-input"
    />
    <FormInput
      id="password"
      label="Password"
      value={passwordValue}
      onChange={() => {}}
      errorMessage={passwordError}
      dataTestId="password-input"
    />
  </>
);
const mockNavigate = jest.fn();
jest.mock("../LoginApi.js");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockStore = configureStore([]);

describe("Login page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = (
    ui,
    { initialState, store = mockStore(initialState) } = {}
  ) => {
    return render(
      <Provider store={store}>
        <AuthProvider>
          <BrowserRouter>{ui}</BrowserRouter>
        </AuthProvider>
      </Provider>
    );
  };

  test("renders login page with all elements", () => {
    const initialState = {
      notifications: {
        visible: false,
        message: "",
      },
    };

    renderWithProviders(<LoginPage />, { initialState });

    expect(screen.getByTestId("utube-text")).toHaveTextContent("UTube");
    expect(screen.getByTestId("signin-text")).toHaveTextContent("Sign in");
    expect(screen.getByTestId("text")).toHaveTextContent(
      "to continue to UTube"
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test("handles change correctly", () => {
    const initialState = {
      notifications: {
        visible: false,
        message: "",
      },
    };

    renderWithProviders(<LoginPage />, { initialState });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123" } });

    expect(emailInput.value).toBe("test@gmail.com");
    expect(passwordInput.value).toBe("Password123");
  });

  test("should display error messages when all fields are empty", () => {
    const initialState = {
      notifications: {
        visible: false,
        message: "",
      },
    };

    renderWithProviders(<LoginPage />, { initialState });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByText(/Enter an email/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter password/i)).toBeInTheDocument();
  });

  test("should throw error message, if email is not valid", () => {
    const initialState = {
      notifications: {
        visible: false,
        message: "",
      },
    };

    renderWithProviders(<LoginPage />, { initialState });

    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "test01gmail.com" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "Password1!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByText(/Enter a valid email/i)).toBeInTheDocument();
  });

  test("should throw error message if password is not valid", () => {
    const initialState = {
      notifications: {
        visible: false,
        message: "",
      },
    };

    renderWithProviders(<LoginPage />, { initialState });

    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "test01@gmail.com" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "1234" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(
      screen.getByText(/Password must be at least 8 characters long/i)
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "HelloWorld1234567890!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(
      screen.getByText(/Password must not exceed 20 characters/i)
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "hello1234567!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(
      screen.getByText(/Password must contain at least one uppercase letter/i)
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "K1234567!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(
      screen.getByText(/Password must contain at least one lowercase letter/i)
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "Helloworld!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(
      screen.getByText(/Password must contain at least one digit/i)
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "Helloworld123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(
      screen.getByText(/Password must contain at least one special character/i)
    ).toBeInTheDocument();
  });

  test("handles change correctly and clears fieldError when the user starts typing in the email or password field", async () => {
    const initialState = {
      notifications: {
        visible: false,
        message: "",
      },
    };

    renderWithProviders(<LoginPage />, { initialState });

    // Initially submit the form to trigger validation errors
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Expect validation errors to be shown
    expect(screen.getByText(/Enter an email/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter password/i)).toBeInTheDocument();

    // Simulate user input in the email field
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });

    // Expect the email validation error to be cleared and email state to be updated
    await waitFor(() => {
      expect(screen.queryByText(/Enter an email/i)).not.toBeInTheDocument();
    });
    expect(emailInput.value).toBe("test@gmail.com");

    // Simulate user input in the password field
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: "Password1!" } });

    // Expect the password validation error to be cleared and password state to be updated
    await waitFor(() => {
      expect(screen.queryByText(/Enter password/i)).not.toBeInTheDocument();
    });
    expect(passwordInput.value).toBe("Password1!");
  });

  test("handles focus event correctly for all fields", () => {
    render(
      <FormInputsWrapper
        emailValue=""
        passwordValue=""
        emailError=""
        passwordError=""
      />
    );

    const emailInputElement = screen.getByTestId("email-input");
    const passwordInputElement = screen.getByTestId("password-input");

    fireEvent.focus(emailInputElement);
    fireEvent.focus(passwordInputElement);

    expect(screen.getByTestId("email-input-container")).toHaveClass("focused");
    expect(screen.getByTestId("password-input-container")).toHaveClass(
      "focused"
    );
  });

  test("handles blur event correctly with non-empty values for all fields", () => {
    render(
      <FormInputsWrapper
        emailValue="tester@gmail.com"
        passwordValue="Password123!"
        emailError=""
        passwordError=""
      />
    );
    const emailInputElement = screen.getByTestId("email-input");
    const passwordInputElement = screen.getByTestId("password-input");

    fireEvent.blur(emailInputElement);
    fireEvent.blur(passwordInputElement);

    expect(screen.getByTestId("email-input-container")).toHaveClass("focused");
    expect(screen.getByTestId("password-input-container")).toHaveClass(
      "focused"
    );
  });

  test("handles blur event correctly with empty value", () => {
    render(
      <FormInputsWrapper
        emailValue=""
        passwordValue=""
        emailError=""
        passwordError=""
      />
    );

    const emailInputElement = screen.getByTestId("email-input");
    const passwordInputElement = screen.getByTestId("password-input");

    fireEvent.blur(emailInputElement);
    fireEvent.blur(passwordInputElement);

    expect(screen.getByTestId("email-input-container")).not.toHaveClass(
      "focused"
    );
    expect(screen.getByTestId("password-input-container")).not.toHaveClass(
      "focused"
    );
  });

  test("remains focused with error-border when there is an error message", () => {
    render(
      <FormInputsWrapper
        emailValue=""
        passwordValue=""
        emailError="Enter an email"
        passwordError="Enter a valid password"
      />
    );

    const emailInputElement = screen.getByTestId("email-input");
    const passwordInputElement = screen.getByTestId("password-input");

    fireEvent.focus(emailInputElement);
    fireEvent.focus(passwordInputElement);

    fireEvent.blur(emailInputElement);
    fireEvent.blur(passwordInputElement);

    expect(screen.getByTestId("email-input-container")).toHaveClass("focused");
    expect(screen.getByTestId("email-input-container")).toHaveClass(
      "error-border"
    );

    expect(screen.getByTestId("password-input-container")).toHaveClass(
      "focused"
    );
    expect(screen.getByTestId("password-input-container")).toHaveClass(
      "error-border"
    );
  });

  test("with correct data, api call should responds to home page", async () => {
    loginUser.mockResolvedValue({ token: "fake-token" });
    const initialState = {
      notifications: {
        visible: false,
        message: "",
      },
    };

    renderWithProviders(<LoginPage />, { initialState });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Password1!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("fake-token");
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("displays error message on failed login", async () => {
    loginUser.mockResolvedValue({});
    const initialState = {
      notifications: {
        visible: false,
        message: "",
      },
    };

    renderWithProviders(<LoginPage />, { initialState });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Password1!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText("Login failed. Please try again.")
    ).toBeInTheDocument();
  });

  test("if login fails, it should redirect to error page and shows error message", async () => {
    const errorResponse = {
      message: "An error occurred. please try again",
      status: 500,
      data: { message: "Internal Server Error" },
    };
    loginUser.mockRejectedValueOnce(errorResponse);

    const initialState = {
      notifications: {
        visible: false,
        message: "",
      },
    };

    renderWithProviders(<LoginPage />, { initialState });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Password1!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/error");
    });

    renderWithProviders(<ErrorPage />, { initialState });

    expect(screen.getByText(/Couldn't sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/Oops something went wrong/i)).toBeInTheDocument();
  });

  test("displays notification message on password reset success", async () => {
    jest.useFakeTimers();

    renderWithProviders(
      <AuthProvider>
        <LoginPage />
        <CustomNotification />
      </AuthProvider>,
      {
        initialState: {
          notifications: {
            visible: true,
            message:
              "Your password has been reset successfully. Please sign in with your new password.",
          },
        },
      }
    );

    // Find all elements with the notification message
    const notifications = screen.getAllByText(
      "Your password has been reset successfully. Please sign in with your new password."
    );
    // expect(notifications.length).toBe(1); // Ensure only one notification is present

    // Advance timers to simulate the passage of time
    jest.advanceTimersByTime(3000);

    // Verify that the notification disappears
    await waitFor(() => {
      expect(
        screen.queryByText(
          "Your password has been reset successfully. Please sign in with your new password."
        )
      ).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
