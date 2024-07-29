import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  BrowserRouter,
  MemoryRouter,
  Route,
  Router,
  Routes,
} from "react-router-dom";
import ForgotPassword from "../ForgotPassword";
import { forgotPasswordApi } from "../ForgotPasswordApi";
import ErrorPage from "../../Error/ErrorPage";
import FormInput from "../../../util/FormInput";
import { createMemoryHistory } from "history";

jest.mock("../ForgotPasswordApi.js");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Forgot Password", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders forgot password page with all elements", () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    expect(screen.getByTestId("utube-text")).toHaveTextContent("UTube");
    expect(screen.getByTestId("static-text")).toHaveTextContent(
      "Account recovery"
    );
    expect(screen.getByTestId("p-text")).toHaveTextContent(
      "Enter the email address to get the reset password link"
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  test("should throw error message, if email is empty and not valid", () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.getByText(/Enter an email/i)).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "test01gmail.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.getByText(/Enter a valid email/i)).toBeInTheDocument();
  });

  test("Clear fieldError when the user starts typing in the email field", () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(screen.getByText(/Enter an email/i)).toBeInTheDocument();

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "t" } });

    expect(screen.queryByText(/Enter an email/i)).not.toBeInTheDocument();
  });

  test("display success message when email is valid", async () => {
    forgotPasswordApi.mockResolvedValueOnce({ success: true });
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "An email has been sent to your email address to reset your password"
        )
      ).toBeInTheDocument();
    });
  });

  // test('display error message when email is not registered', async() => {
  //     forgotPasswordApi.mockResolvedValueOnce({success: false, error: 'There is no user with that email'})
  //     render(
  //         <BrowserRouter>
  //         <ForgotPassword/>
  //         </BrowserRouter>
  //     )

  //     const emailInput = screen.getByLabelText(/email/i);
  //     fireEvent.change(emailInput, {target: {value: 'test@gmail.com'}});

  //     fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  //     await waitFor(() => {
  //     expect(screen.getByText('There is no user with that email')).toBeInTheDocument();
  //     })

  // });

  test("displays error message when email is not registered", async () => {
    forgotPasswordApi.mockResolvedValueOnce({
      success: false,
      error: "There is no user with that email",
    });

    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      const errorMessage = screen.getByText("There is no user with that email");
      expect(errorMessage).toBeInTheDocument();
    });

    // Check if only one error message is present
    const errorMessages = screen.getAllByText(
      "There is no user with that email"
    );
    expect(errorMessages.length).toBe(1);
  });

  test("when clicking back button, should navigate to sign in page", async () => {
    render(
      <MemoryRouter initialEntries={["/forgot-password"]}>
        <Routes>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signin" element={<div>Sign in</div>} />
        </Routes>
      </MemoryRouter>
    );

    const backButton = screen.getByRole("button", { name: /back/i });
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByText("Sign in")).toBeInTheDocument();
    });
  });

  test("if registration fails, it should redirect to error page and shows error message", async () => {
    const errorResponse = {
      message: "An error occurred. please try again",
      status: 500,
      data: { message: "Internal Server Error" },
    };
    forgotPasswordApi.mockRejectedValueOnce(errorResponse);

    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

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

  test("handles focus event correctly", () => {
    render(
      <FormInput
        id="email"
        label="Email"
        value=""
        onChange={() => {}}
        errorMessage=""
        dataTestId="email-input"
      />
    );

    const inputElement = screen.getByTestId("email-input");
    fireEvent.focus(inputElement);

    // Checking for the class assignment on the parent element of the input using data-testid
    expect(screen.getByTestId("email-input-container")).toHaveClass("focused");
  });

  test("handles blur event correctly with non-empty value", () => {
    render(
      <FormInput
        id="email"
        label="Email"
        value="test@example.com"
        onChange={() => {}}
        errorMessage=""
        dataTestId="email-input"
      />
    );

    const inputElement = screen.getByTestId("email-input");
    fireEvent.blur(inputElement);

    expect(screen.getByTestId("email-input-container")).toHaveClass("focused");
  });

  test("handles blur event correctly with empty value", () => {
    render(
      <FormInput
        id="email"
        label="Email"
        value=""
        onChange={() => {}}
        errorMessage=""
        dataTestId="email-input"
      />
    );

    const inputElement = screen.getByTestId("email-input");
    fireEvent.blur(inputElement);

    expect(screen.getByTestId("email-input-container")).not.toHaveClass(
      "focused"
    );
  });

  test("remains focused with error-border when there is an error message", () => {
    render(
      <FormInput
        id="email"
        label="Email"
        value=""
        onChange={() => {}}
        errorMessage="Enter a valid email"
        dataTestId="email-input"
      />
    );

    const inputElement = screen.getByTestId("email-input");
    fireEvent.focus(inputElement);
    fireEvent.blur(inputElement);

    const containerElement = screen.getByTestId("email-input-container");
    expect(containerElement).toHaveClass("focused");
    expect(containerElement).toHaveClass("error-border");
  });
});
