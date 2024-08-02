import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import RegisterPage from "../RegisterPage";
import { BrowserRouter } from "react-router-dom";
import { registerUser } from "../RegisterApi";
import ErrorPage from "../../Error/ErrorPage";
import { default as validateAllFields } from "../../../util/ValidationForm";
import FormInput from "../../../util/FormInput";

const FormInputsWrapper = ({
  emailValue,
  channelNameValue,
  passwordValue,
  confirmPasswordValue,
  emailError,
  channelError,
  passwordError,
  confirmPasswordError,
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
      id="channel"
      label="Channel Name"
      value={channelNameValue}
      onChange={() => {}}
      errorMessage={channelError}
      dataTestId="channel-input"
    />
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

jest.mock("../RegisterApi.js");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Register page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render RegisterPage correctly", () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId("email")).toBeInTheDocument();
    expect(screen.getByTestId("channelName")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(screen.getByTestId("confirmPassword")).toBeInTheDocument();
  });

  test("check the text are present on left side", () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );
    const utubeText = screen.getByTestId("utube-text");
    expect(utubeText.textContent).toBe("UTube");

    const staticText = screen.getByTestId("static-text");
    expect(staticText.textContent).toMatch(/create a utube account/i);
  });

  test("check the labels are present on right side", () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );
    const emailField = screen.getByLabelText(/email/i, { selector: "input" });
    const channelField = screen.getByLabelText(/user name/i, {
      selector: "input",
    });
    const passwordField = screen.getByLabelText("Password", {
      selector: "input",
    });
    const confirmField = screen.getByLabelText("Confirm Password", {
      selector: "input",
    });

    expect(emailField).toBeInTheDocument();
    expect(channelField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
    expect(confirmField).toBeInTheDocument();
  });

  test("should update formData when input changes", () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByTestId("email");
    const channelInput = screen.getByTestId("channelName");
    const passwordInput = screen.getByTestId("password");
    const confirmPasswordInput = screen.getByTestId("confirmPassword");

    fireEvent.change(emailInput, { target: { value: "test01@gmail.com" } });
    fireEvent.change(channelInput, { target: { value: "life on earth" } });
    fireEvent.change(passwordInput, { target: { value: "Password1" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "Password1" } });

    expect(emailInput.value).toBe("test01@gmail.com");
    expect(channelInput.value).toBe("life on earth");
    expect(passwordInput.value).toBe("Password1");
    expect(confirmPasswordInput.value).toBe("Password1");
  });

  test("should display error messages when all fields are empty", () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText(/sign up/i));

    expect(screen.getByText(/Enter an email/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter user name/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter password/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter confirm password/i)).toBeInTheDocument();
  });

  test("should throw error message, if email is not valid", () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "test01gmail.com" },
    });
    fireEvent.change(screen.getByTestId("channelName"), {
      target: { value: "life on earth" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByTestId("confirmPassword"), {
      target: { value: "Password1!" },
    });

    fireEvent.click(screen.getByText(/sign up/i));

    expect(screen.getByText(/Enter a valid email/i)).toBeInTheDocument();
  });

  test("should throw error message if password & confirm password does not match", () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "test01@gmail.com" },
    });
    fireEvent.change(screen.getByTestId("channelName"), {
      target: { value: "life on earth" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByTestId("confirmPassword"), {
      target: { value: "74945093839" },
    });

    fireEvent.click(screen.getByText(/sign up/i));

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test("should throw error message if user name is below 3 characters", () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "test01@gmail.com" },
    });
    fireEvent.change(screen.getByTestId("channelName"), {
      target: { value: "li" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByTestId("confirmPassword"), {
      target: { value: "12345678" },
    });

    fireEvent.click(screen.getByText(/sign up/i));

    expect(
      screen.getByText(/User name must be at least 3 characters long/i)
    ).toBeInTheDocument();
  });

  test("should throw error message if password is not valid", () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "test01@gmail.com" },
    });
    fireEvent.change(screen.getByTestId("channelName"), {
      target: { value: "life on earth" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "1234" },
    });
    fireEvent.change(screen.getByTestId("confirmPassword"), {
      target: { value: "12345678" },
    });

    fireEvent.click(screen.getByText(/sign up/i));
    expect(
      screen.getByText(/Password must be at least 8 characters long/i)
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "HelloWorld1234567890!" },
    });
    fireEvent.click(screen.getByText(/sign up/i));
    expect(
      screen.getByText(/Password must not exceed 20 characters/i)
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "hello1234567!" },
    });
    fireEvent.click(screen.getByText(/sign up/i));
    expect(
      screen.getByText(/Password must contain at least one uppercase letter/i)
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "K1234567!" },
    });
    fireEvent.click(screen.getByText(/sign up/i));
    expect(
      screen.getByText(/Password must contain at least one lowercase letter/i)
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "Helloworld!" },
    });
    fireEvent.click(screen.getByText(/sign up/i));
    expect(
      screen.getByText(/Password must contain at least one digit/i)
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "Helloworld123" },
    });
    fireEvent.click(screen.getByText(/sign up/i));
    expect(
      screen.getByText(/Password must contain at least one special character/i)
    ).toBeInTheDocument();
  });

  test("handles focus event correctly for all fields", () => {
    render(
      <FormInputsWrapper
        emailValue=""
        channelNameValue=""
        passwordValue=""
        confirmPasswordValue=""
        emailError=""
        channelError=""
        passwordError=""
        confirmPasswordError=""
      />
    );

    const emailInputElement = screen.getByTestId("email-input");
    const channelInputElement = screen.getByTestId("channel-input");
    const passwordInputElement = screen.getByTestId("password-input");
    const confirmPasswordInputElement = screen.getByTestId(
      "confirmPassword-input"
    );

    fireEvent.focus(emailInputElement);
    fireEvent.focus(channelInputElement);
    fireEvent.focus(passwordInputElement);
    fireEvent.focus(confirmPasswordInputElement);

    expect(screen.getByTestId("email-input-container")).toHaveClass("focused");
    expect(screen.getByTestId("channel-input-container")).toHaveClass(
      "focused"
    );
    expect(screen.getByTestId("password-input-container")).toHaveClass(
      "focused"
    );
    expect(screen.getByTestId("confirmPassword-input-container")).toHaveClass(
      "focused"
    );
  });

  test("handles blur event correctly with non-empty values for all fields", () => {
    render(
      <FormInputsWrapper
        emailValue="tester@gmail.com"
        channelNameValue="John"
        passwordValue="Password123!"
        confirmPasswordValue="Password123!"
        emailError=""
        channelError=""
        passwordError=""
        confirmPasswordError=""
      />
    );
    const emailInputElement = screen.getByTestId("email-input");
    const channelInputElement = screen.getByTestId("channel-input");
    const passwordInputElement = screen.getByTestId("password-input");
    const confirmPasswordInputElement = screen.getByTestId(
      "confirmPassword-input"
    );

    fireEvent.blur(emailInputElement);
    fireEvent.blur(channelInputElement);
    fireEvent.blur(passwordInputElement);
    fireEvent.blur(confirmPasswordInputElement);

    expect(screen.getByTestId("email-input-container")).toHaveClass("focused");
    expect(screen.getByTestId("channel-input-container")).toHaveClass(
      "focused"
    );
    expect(screen.getByTestId("password-input-container")).toHaveClass(
      "focused"
    );
    expect(screen.getByTestId("confirmPassword-input-container")).toHaveClass(
      "focused"
    );
  });

  test("handles blur event correctly with empty value", () => {
    render(
      <FormInputsWrapper
        emailValue=""
        channelNameValue=""
        passwordValue=""
        confirmPasswordValue=""
        emailError=""
        channelError=""
        passwordError=""
        confirmPasswordError=""
      />
    );

    const emailInputElement = screen.getByTestId("email-input");
    const channelInputElement = screen.getByTestId("email-input");
    const passwordInputElement = screen.getByTestId("password-input");
    const confirmPasswordInputElement = screen.getByTestId(
      "confirmPassword-input"
    );

    fireEvent.blur(emailInputElement);
    fireEvent.blur(channelInputElement);
    fireEvent.blur(passwordInputElement);
    fireEvent.blur(confirmPasswordInputElement);

    expect(screen.getByTestId("email-input-container")).not.toHaveClass(
      "focused"
    );
    expect(screen.getByTestId("channel-input-container")).not.toHaveClass(
      "focused"
    );
    expect(screen.getByTestId("password-input-container")).not.toHaveClass(
      "focused"
    );
    expect(
      screen.getByTestId("confirmPassword-input-container")
    ).not.toHaveClass("focused");
  });

  test("remains focused with error-border when there is an error message", () => {
    render(
      <FormInputsWrapper
        emailValue=""
        channelNameValue=""
        passwordValue=""
        confirmPasswordValue=""
        emailError="Enter an email"
        channelError="Enter channel name"
        passwordError="Enter a valid password"
        confirmPasswordError="Passwords do not match"
      />
    );

    const emailInputElement = screen.getByTestId("email-input");
    const channelInputElement = screen.getByTestId("email-input");
    const passwordInputElement = screen.getByTestId("password-input");
    const confirmPasswordInputElement = screen.getByTestId(
      "confirmPassword-input"
    );

    fireEvent.focus(emailInputElement);
    fireEvent.focus(channelInputElement);
    fireEvent.focus(passwordInputElement);
    fireEvent.focus(confirmPasswordInputElement);

    fireEvent.blur(emailInputElement);
    fireEvent.blur(channelInputElement);
    fireEvent.blur(passwordInputElement);
    fireEvent.blur(confirmPasswordInputElement);

    expect(screen.getByTestId("email-input-container")).toHaveClass("focused");
    expect(screen.getByTestId("email-input-container")).toHaveClass(
      "error-border"
    );
    expect(screen.getByTestId("channel-input-container")).toHaveClass(
      "focused"
    );
    expect(screen.getByTestId("channel-input-container")).toHaveClass(
      "error-border"
    );
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

  test("with correct data, api call should responds to sign in page", async () => {
    registerUser.mockResolvedValue({ token: "fake-token" });
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "test01@gmail.com" },
    });
    fireEvent.change(screen.getByTestId("channelName"), {
      target: { value: "life on earth" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByTestId("confirmPassword"), {
      target: { value: "Password1!" },
    });

    fireEvent.click(screen.getByText(/sign up/i));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("fake-token");
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/signin");
    });
  });

  test("if registration fails, it should redirect to error page and shows error message", async () => {
    registerUser.mockRejectedValueOnce(new Error("API error"));

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("channelName"), {
      target: { value: "testChannel" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByTestId("confirmPassword"), {
      target: { value: "Password1!" },
    });

    fireEvent.click(screen.getByText(/sign up/i));

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

  test("should not return an error if email is valid", () => {
    const errors = validateAllFields({ email: "test@example.com" });
    expect(errors.email).toBeUndefined();
  });

  test("should not return an error if password is valid", () => {
    const errors = validateAllFields({ password: "Password1!" });
    expect(errors.password).toBeUndefined();
  });

  test("should not return an error if confirm password matches", () => {
    const errors = validateAllFields({
      password: "Password1!",
      confirmPassword: "Password1!",
    });
    expect(errors.confirmPassword).toBeUndefined();
  });

  test("should not return an error if channel name is valid", () => {
    const errors = validateAllFields({ channel: "Channel" });
    expect(errors.channel).toBeUndefined();
  });
});
