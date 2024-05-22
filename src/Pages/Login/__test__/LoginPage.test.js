import { render, screen } from "@testing-library/react";
import LoginPage from "../LoginPage";
import { MemoryRouter } from "react-router-dom";

describe('Login page', () => {

  test('check the text are present on left side', () => {
    render(
        <MemoryRouter initialEntries={[{ pathname: '/signin'}]}>
            <LoginPage />
        </MemoryRouter>
    );
    const utubeText = screen.getByTestId("utube-text");
    expect(utubeText.textContent).toBe("UTube");

    const signinText = screen.getByTestId("signin-text");
    expect(signinText.textContent).toMatch(/sign in/i);

    const textElt = screen.getByTestId("text");
    expect(textElt.textContent).toMatch(/to continue to utube/i);
  });

  test('check the text are present on Right side', () => {
    render(
        <MemoryRouter initialEntries={[{ pathname: '/signin'}]}>
            <LoginPage />
        </MemoryRouter>
    );
    const utubeText = screen.getByTestId("utube-text");
    expect(utubeText.textContent).toBe("UTube");
  })
});
