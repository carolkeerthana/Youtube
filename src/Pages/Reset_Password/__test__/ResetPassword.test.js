import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import ResetPassword from "../ResetPassword";
import { resetPassword } from "../ResetPasswordApi";
import ErrorPage from "../../Error/ErrorPage";
import FormInput from "../../../util/FormInput";

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
const mockNavigate = jest.fn();
// Mock useParams and useNavigate from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ token: "mock-token" }),
  useNavigate: () => mockNavigate,
}));

// Mock resetPassword function
jest.mock("../ResetPasswordApi", () => ({
  resetPassword: jest.fn(),
}));

describe("ResetPassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders reset password form", () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    expect(screen.getByTestId("utube-text")).toBeInTheDocument();
    expect(screen.getByTestId("static-text")).toBeInTheDocument();
    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reset Password" })
    ).toBeInTheDocument();
  });

  test("should display error messages when all fields are empty", () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    expect(screen.getByText(/Enter password/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter confirm password/i)).toBeInTheDocument();
  });

  test("validates form fields on submission", async () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

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
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByTestId("confirmPassword"), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test("submits the form successfully", async () => {
    resetPassword.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", { name: "Reset Password" });

    fireEvent.change(passwordInput, { target: { value: "Password123!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Password123!" },
    });
    fireEvent.click(submitButton);

    expect(resetPassword).toHaveBeenCalledWith("mock-token", "Password123!");

    await waitFor(() => {
      expect(
        screen.getByText("Your password has been reset successfully.")
      ).toBeInTheDocument();
    });
  });

  test("if reset password fails, it should redirect to error page and shows error message", async () => {
    const errorResponse = {
      message: "An error occurred. please try again",
      status: 500,
      data: { message: "Internal Server Error" },
    };
    resetPassword.mockRejectedValueOnce(errorResponse);

    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );

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

    render(
      <BrowserRouter>
        <ErrorPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Couldn't sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/Oops something went wrong/i)).toBeInTheDocument();
  });

  test("displays error message when password reset fails", async () => {
    resetPassword.mockResolvedValueOnce({ success: false });

    render(<ResetPassword />);

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
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    const passwordInput = screen.getByTestId("password");
    const confirmPasswordInput = screen.getByTestId("confirmPassword");

    // Initial state
    expect(passwordInput.value).toBe("");
    expect(confirmPasswordInput.value).toBe("");
    expect(
      screen.queryByText("Enter a valid password")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Passwords do not match")
    ).not.toBeInTheDocument();

    // Simulate error state
    fireEvent.change(passwordInput, {
      target: { name: "password", value: "short" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { name: "confirmPassword", value: "mismatch" },
    });

    // Simulate the presence of errors by triggering blur
    fireEvent.blur(passwordInput);
    fireEvent.blur(confirmPasswordInput);

    // Simulate the presence of error messages
    fireEvent.change(passwordInput, {
      target: { name: "password", value: "InvalidPass" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { name: "confirmPassword", value: "MismatchPass" },
    });

    // Clear errors by changing values again
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
