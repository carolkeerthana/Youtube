import { render, screen } from "@testing-library/react";
import RegisterPage from "../RegisterPage";
import { MemoryRouter } from "react-router-dom";
import {registerUser} from '../RegisterApi';

describe("Register page", () => {
    test('check the text are present on left side', () => {
        render(
            <MemoryRouter initialEntries={[{ pathname: '/signup'}]}>
                <RegisterPage />
            </MemoryRouter>
        );
        const utubeText = screen.getByTestId("utube-text");
        expect(utubeText.textContent).toBe("UTube");
    
        const staticText = screen.getByTestId("static-text");
        expect(staticText.textContent).toMatch(/create a utube account/i);
      });

      test.skip('check the labels are present on right side', () => {
        render(
            <MemoryRouter initialEntries={[{ pathname: '/signup'}]}>
                <RegisterPage />
            </MemoryRouter>
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

      test('should be able to make POST request', async () => {
        registerUser.mockResolvedValue({
            
        })
      })
})