import { fireEvent, getByRole, render, screen, waitFor } from "@testing-library/react"
import CreateSubscriber from "../CreateSubscriber/CreateSubscriber"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider, useAuth } from "../../../util/AuthContext"
import { CreateSubscriberApi } from "../CreateSubscriber/CreateSubscriberApi"

jest.mock('../../../util/AuthContext');
jest.mock('../CreateSubscriber/CreateSubscriberApi.js');

describe('CreateSubscriber', () => {

    const setIsSubscribed = jest.fn();

    beforeEach(() => {
        useAuth.mockReturnValue({ isAuthenticated: false });
        CreateSubscriberApi.mockResolvedValue({ success: true });
      });

    afterEach(() => {
        jest.clearAllMocks();
      });

    test('check if subscribe button is present', () => {
        render(
        <BrowserRouter>
        <CreateSubscriber channelId="123" isSubscribed={false} setIsSubscribed={setIsSubscribed} />
        </BrowserRouter>
        );
        const subscribeBtn = screen.getByRole('button', {name: /subscribe/i});

        expect(subscribeBtn).toBeInTheDocument();

        fireEvent.click(subscribeBtn);

        expect(screen.getByText(/sign in to subscribe/i)).toBeInTheDocument();
    });

    test('shows signInPopup when not authenticated and button is clicked', () => {
        render(
            <BrowserRouter>
            <CreateSubscriber channelId="123" isSubscribed={false} setIsSubscribed={setIsSubscribed} />
            </BrowserRouter>
            );
        const subscribeBtn = screen.getByRole('button', {name: /subscribe/i});
  
        fireEvent.click(subscribeBtn);
        expect(screen.getByText(/Sign in to subscribe to this channel./i)).toBeInTheDocument();
    });

    test('toggles subscription when authenticated', async () => {
        useAuth.mockReturnValue({ isAuthenticated: true });
    
        render(
        <BrowserRouter>
            <CreateSubscriber channelId="123" isSubscribed={false} setIsSubscribed={setIsSubscribed} />
        </BrowserRouter>
        )
    
        const subscribeBtn = screen.getByRole('button', {name: /subscribe/i});
        expect(subscribeBtn).toBeInTheDocument();
    
        fireEvent.click(subscribeBtn);
    
        expect(CreateSubscriberApi).toHaveBeenCalledWith({ channelId: '123' });
    
        await waitFor(() => {
            expect(setIsSubscribed).toHaveBeenCalledWith(true);
          });
      
        render(
        <BrowserRouter>
            <CreateSubscriber channelId="123" isSubscribed={true} setIsSubscribed={setIsSubscribed} />
        </BrowserRouter>
        );

        const updatedSubscribeBtn = screen.getByRole('button', { name: /subscribed/i });
        expect(updatedSubscribeBtn).toBeInTheDocument();
        });

        test('handles API errors', async () => {
          CreateSubscriberApi.mockResolvedValueOnce({ success: false, error: 'Subscription failed' });
          render(
            <BrowserRouter>
          <CreateSubscriber channelId="1" isSubscribed={false} setIsSubscribed={setIsSubscribed} />
          </BrowserRouter>);
      
          fireEvent.click(screen.getByText('SUBSCRIBE'));
          expect(CreateSubscriberApi).toHaveBeenCalledWith({ channelId: '1' });
      
          // Wait for state updates and re-renders
          await screen.findByText('SUBSCRIBE'); // remains as 'SUBSCRIBE'
          expect(screen.getByText('SUBSCRIBE')).toBeInTheDocument();
        });

        test('shows error message when subscription fails', async () => {
          useAuth.mockReturnValue({ isAuthenticated: true });
          CreateSubscriberApi.mockRejectedValue(new Error('Network error'));
          render(<CreateSubscriber channelId="1" isSubscribed={false} setIsSubscribed={setIsSubscribed} />);
      
          fireEvent.click(screen.getByText('SUBSCRIBE'));
      
          expect(screen.getByText('Error processing subscription')).toBeInTheDocument();
        });

        test('shows error message on API error', async () => {
          CreateSubscriberApi.mockResolvedValue({ success: false, error: 'Failed to subscribe' });
          render(
          <BrowserRouter>
          <CreateSubscriber channelId="1" isSubscribed={false} setIsSubscribed={setIsSubscribed} />
          </BrowserRouter>);
          fireEvent.click(screen.getByText('SUBSCRIBE'));
          expect(await screen.findByText('Failed to subscribe')).toBeInTheDocument();
        });

        test('shows generic error message on API exception', async () => {
          CreateSubscriberApi.mockRejectedValue(new Error('Network error'));
          render(
            <BrowserRouter>
            <CreateSubscriber channelId="1" isSubscribed={false} setIsSubscribed={setIsSubscribed} />
            </BrowserRouter>);
          fireEvent.click(screen.getByText('SUBSCRIBE'));
          expect(await screen.findByText('Error processing subscription')).toBeInTheDocument();
        });
})