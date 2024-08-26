import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  BrowserRouter,
  MemoryRouter,
  Route,
  Router,
  Routes,
} from "react-router-dom";
import ResetPassword from "../ResetPassword";
import { resetPassword } from "../ResetPasswordApi";
import ErrorPage from "../../Error/ErrorPage";
import FormInput from "../../../util/FormInput";
import { configureStore, createStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { AuthProvider } from "../../../util/AuthContext";
import notificationReducer, {
  showNotification,
} from "../../../components/Notification/notificationSlice";
import LoginPage from "../../Login/LoginPage";

const rootReducer = {
  notification: notificationReducer,
};
const store = configureStore({
  reducer: rootReducer,
});

const FormInputsWrapper = ({
  passwordValue,
  confirmPasswordValue,
  passwordError,
  confirmPasswordError,
}) => (
  <>
    <FormInput
      id="password"
      label="Password"
      value={passwordValue}
      onChange={() => {}}
      errorMessage={passwordError}
      dataTestId="password-input"
    />
    <FormInput
      id="confirmPassword"
      label="Confirm Password"
      value={confirmPasswordValue}
      onChange={() => {}}
      errorMessage={confirmPasswordError}
      dataTestId="confirmPassword-input"
    />
  </>
);
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../ResetPasswordApi", () => ({
  resetPassword: jest.fn(),
}));

jest.mock("../../../components/Notification/notificationSlice", () => ({
  showNotification: jest.fn(),
}));

const renderWithProviders = (ui) => {
  return render(
    <Provider store={store}>
      <AuthProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </AuthProvider>
    </Provider>
  );
};

describe("ResetPassword", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should dispatch notification and redirect to login page on successful password reset", async () => {
    resetPassword.mockResolvedValue({
      success: true,
      token: "mock-token",
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<ResetPassword />} />
            <Route path="/signin" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "NewPassword@123" },
    });
    fireEvent.change(screen.getByTestId("confirmPassword"), {
      target: { value: "NewPassword@123" },
    });

    fireEvent.click(screen.getByText("Reset Password"));

    await waitFor(() => {
      console.log("showNotification calls:", showNotification.mock.calls);
      console.log("mockNavigate calls:", mockNavigate.mock.calls);

      expect(showNotification).toHaveBeenCalledWith(
        "Your password has been reset successfully. Please sign in with your new password."
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/signin");
    });

    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  test("renders reset password form", () => {
    renderWithProviders(<ResetPassword />);

    expect(screen.getByTestId("utube-text")).toBeInTheDocument();
    expect(screen.getByTestId("static-text")).toBeInTheDocument();
    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reset Password" })
    ).toBeInTheDocument();
  });

  test("should display error messages when all fields are empty", () => {
    renderWithProviders(<ResetPassword />);

    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    expect(screen.getByText(/Enter password/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter confirm password/i)).toBeInTheDocument();
  });

  test("validates form fields on submission", async () => {
    renderWithProviders(<ResetPassword />);

    const passwordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Reset Password" });

    fireEvent.change(passwordInput, { target: { value: "test" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "test123" } });
    fireEvent.click(submitButton);

    expect(
      screen.getByText("Password must be at least 8 characters long")
    ).toBeInTheDocument();
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "HelloWorld1234567890!" },
    });
    fireEvent.click(submitButton);
    expect(
      screen.getByText(/Password must not exceed 20 characters/i)
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "hello1234567!" },
    });
    fireEvent.click(submitButton);
    expect(
      screen.getByText(/Password must contain at least one uppercase letter/i)
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "K1234567!" },
    });
    fireEvent.click(submitButton);
    expect(
      screen.getByText(/Password must contain at least one lowercase letter/i)
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "Helloworld!" },
    });
    fireEvent.click(submitButton);
    expect(
      screen.getByText(/Password must contain at least one digit/i)
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "Helloworld123" },
    });
    fireEvent.click(submitButton);
    expect(
      screen.getByText(/Password must contain at least one special character/i)
    ).toBeInTheDocument();
  });

  test("should throw error message if password & confirm password does not match", () => {
    renderWithProviders(<ResetPassword />);

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByTestId("confirmPassword"), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test("if reset password fails, it should redirect to error page and shows error message", async () => {
    const errorResponse = {
      message: "An error occurred. please try again",
      status: 500,
      data: { message: "Internal Server Error" },
    };
    resetPassword.mockRejectedValueOnce(errorResponse);

    renderWithProviders(<ResetPassword />);

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "Password1!" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/error");
    });

    renderWithProviders(<ErrorPage />);

    expect(screen.getByText(/Couldn't sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/Oops something went wrong/i)).toBeInTheDocument();
  });

  test("displays error message when password reset fails", async () => {
    resetPassword.mockResolvedValueOnce({ success: false });

    renderWithProviders(<ResetPassword />);

    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "Password1!" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Password reset failed. Please try again.")
      ).toBeInTheDocument();
    });
  });

  test("handles focus event correctly for both fields", () => {
    render(
      <FormInputsWrapper
        passwordValue=""
        confirmPasswordValue=""
        passwordError=""
        confirmPasswordError=""
      />
    );

    const passwordInputElement = screen.getByTestId("password-input");
    const confirmPasswordInputElement = screen.getByTestId(
      "confirmPassword-input"
    );

    fireEvent.focus(passwordInputElement);
    fireEvent.focus(confirmPasswordInputElement);

    expect(screen.getByTestId("password-input-container")).toHaveClass(
      "focused"
    );
    expect(screen.getByTestId("confirmPassword-input-container")).toHaveClass(
      "focused"
    );
  });

  test("handles blur event correctly with non-empty values for both fields", () => {
    render(
      <FormInputsWrapper
        passwordValue="password123"
        confirmPasswordValue="password123"
        passwordError=""
        confirmPasswordError=""
      />
    );

    const passwordInputElement = screen.getByTestId("password-input");
    const confirmPasswordInputElement = screen.getByTestId(
      "confirmPassword-input"
    );

    fireEvent.blur(passwordInputElement);
    fireEvent.blur(confirmPasswordInputElement);

    expect(screen.getByTestId("password-input-container")).toHaveClass(
      "focused"
    );
    expect(screen.getByTestId("confirmPassword-input-container")).toHaveClass(
      "focused"
    );
  });

  test("handles blur event correctly with empty values for both fields", () => {
    render(
      <FormInputsWrapper
        passwordValue=""
        confirmPasswordValue=""
        passwordError=""
        confirmPasswordError=""
      />
    );

    const passwordInputElement = screen.getByTestId("password-input");
    const confirmPasswordInputElement = screen.getByTestId(
      "confirmPassword-input"
    );

    fireEvent.blur(passwordInputElement);
    fireEvent.blur(confirmPasswordInputElement);

    expect(screen.getByTestId("password-input-container")).not.toHaveClass(
      "focused"
    );
    expect(
      screen.getByTestId("confirmPassword-input-container")
    ).not.toHaveClass("focused");
  });

  test("remains focused with error-border when there are error messages for both fields", () => {
    render(
      <FormInputsWrapper
        passwordValue=""
        confirmPasswordValue=""
        passwordError="Enter a valid password"
        confirmPasswordError="Passwords do not match"
      />
    );

    const passwordInputElement = screen.getByTestId("password-input");
    const confirmPasswordInputElement = screen.getByTestId(
      "confirmPassword-input"
    );

    fireEvent.focus(passwordInputElement);
    fireEvent.blur(passwordInputElement);

    fireEvent.focus(confirmPasswordInputElement);
    fireEvent.blur(confirmPasswordInputElement);

    expect(screen.getByTestId("password-input-container")).toHaveClass(
      "focused"
    );
    expect(screen.getByTestId("password-input-container")).toHaveClass(
      "error-border"
    );
    expect(screen.getByTestId("confirmPassword-input-container")).toHaveClass(
      "focused"
    );
    expect(screen.getByTestId("confirmPassword-input-container")).toHaveClass(
      "error-border"
    );
  });

  test("updates password and confirmPassword state on input change and clears fieldErrors", () => {
    renderWithProviders(<ResetPassword />);

    const passwordInput = screen.getByTestId("password");
    const confirmPasswordInput = screen.getByTestId("confirmPassword");

    expect(passwordInput.value).toBe("");
    expect(confirmPasswordInput.value).toBe("");
    expect(
      screen.queryByText("Enter a valid password")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Passwords do not match")
    ).not.toBeInTheDocument();

    fireEvent.change(passwordInput, {
      target: { name: "password", value: "short" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { name: "confirmPassword", value: "mismatch" },
    });

    fireEvent.blur(passwordInput);
    fireEvent.blur(confirmPasswordInput);

    fireEvent.change(passwordInput, {
      target: { name: "password", value: "InvalidPass" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { name: "confirmPassword", value: "MismatchPass" },
    });

    fireEvent.change(passwordInput, {
      target: { name: "password", value: "NewPassword1!" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { name: "confirmPassword", value: "NewPassword1!" },
    });

    expect(passwordInput.value).toBe("NewPassword1!");
    expect(confirmPasswordInput.value).toBe("NewPassword1!");
    expect(
      screen.queryByText("Enter a valid password")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Passwords do not match")
    ).not.toBeInTheDocument();
  });
});
