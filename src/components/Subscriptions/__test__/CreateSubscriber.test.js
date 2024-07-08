import { fireEvent, getByRole, render, screen, waitFor } from "@testing-library/react"
import CreateSubscriber from "../CreateSubscriber/CreateSubscriber"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider, useAuth } from "../../../util/AuthContext"
import { CreateSubscriberApi } from "../CreateSubscriber/CreateSubscriberApi"

jest.mock('../../../util/AuthContext');
jest.mock('../CreateSubscriber/CreateSubscriberApi.js');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate ,
}));

describe('CreateSubscriber', () => {

    const setIsSubscribed = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useAuth.mockReturnValue({ isAuthenticated: false });
        CreateSubscriberApi.mockResolvedValue({ success: true });
      });

    test('renders subscribe button with initial state', () => {
        render(
        <BrowserRouter>
        <CreateSubscriber channelId="123" isSubscribed={false} setIsSubscribed={setIsSubscribed} />
        </BrowserRouter>
        );
        const subscribeButton = screen.getByRole('button', {name: /subscribe/i});
        expect(subscribeButton).toBeInTheDocument();
        expect(subscribeButton).toHaveClass('button');
        expect(subscribeButton).not.toHaveClass('active');
    });

    test('renders subscribed button when isSubscribed is true', () => {
      render(
      <BrowserRouter>
      <CreateSubscriber channelId="123" isSubscribed={true} setIsSubscribed={setIsSubscribed} />
      </BrowserRouter>
      );

      const subscribedButton = screen.getByText('SUBSCRIBED');
      expect(subscribedButton).toBeInTheDocument();
      expect(subscribedButton).toHaveClass('button');
      expect(subscribedButton).toHaveClass('active');
  });

    test('shows signInPopup when not authenticated and button is clicked', () => {
      useAuth.mockReturnValue({ isAuthenticated: false });
        render(
            <BrowserRouter>
            <CreateSubscriber channelId="123" isSubscribed={false} setIsSubscribed={setIsSubscribed} />
            </BrowserRouter>
            );

        expect(screen.queryByRole('button',{name: /Sign in/i})).not.toBeInTheDocument();
        const subscribeBtn = screen.getByRole('button', {name: /subscribe/i});
        fireEvent.click(subscribeBtn);
        
        expect(screen.getByText(/Sign in to subscribe to this channel./i)).toBeInTheDocument();
        expect(screen.getByRole('button',{name: /Sign in/i})).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button',{name: /Sign in/i}));
        expect(mockNavigate).toHaveBeenCalledWith("/signin")
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

        test('handles API errors on subscription failure', async () => {
          useAuth.mockReturnValue({ isAuthenticated: true });
          CreateSubscriberApi.mockResolvedValue({ success: false, error: 'Failed to subscribe' });
          render(
            <BrowserRouter>
          <CreateSubscriber channelId="123" isSubscribed={false} setIsSubscribed={setIsSubscribed} />
          </BrowserRouter>);
      
          fireEvent.click(screen.getByText('SUBSCRIBE'));
          await waitFor(() => {
            expect(CreateSubscriberApi).toHaveBeenCalledWith({ channelId: '123' });
          })
      
          await screen.findByText('SUBSCRIBE');
          expect(screen.getByText('SUBSCRIBE')).toBeInTheDocument();
        });

        test('shows error message when subscription fails', async () => {
          useAuth.mockReturnValue({ isAuthenticated: true });
          CreateSubscriberApi.mockRejectedValue({ success: false, error: 'Error processing subscription' });
          
          render(<CreateSubscriber channelId="1" isSubscribed={false} setIsSubscribed={setIsSubscribed} />);
      
          fireEvent.click(screen.getByText('SUBSCRIBE'));
      
          expect(await screen.findByText('Error processing subscription')).toBeInTheDocument();
        });

});