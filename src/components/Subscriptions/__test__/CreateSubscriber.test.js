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

        test('displays error message on subscription failure', async () => {
            // Mock API response to simulate subscription failure
            CreateSubscriberApi.mockResolvedValue({ success: false, error: 'Subscription failed' });
        
            render(
              <BrowserRouter>
                <CreateSubscriber channelId="123" isSubscribed={false} setIsSubscribed={setIsSubscribed} />
              </BrowserRouter>
            );
        
            const subscribeBtn = screen.getByRole('button', { name: /subscribe/i });
            fireEvent.click(subscribeBtn);
        
            // Wait for the error message to appear
            await waitFor(() => {
              expect(screen.getByText(/subscription failed/i)).toBeInTheDocument();
            });
          });

    test.skip('if it is authenticated calls CreateSubscriberApi and toggles the subscription state', async() => {
        const {setIsSubscribed} = renderComponent({isAuthenticated:true});
        CreateSubscriberApi.mockResolvedValue({success:true});

        const subscribeBtn = screen.getByRole('button', {name: /subscribe/i});
        fireEvent.click(subscribeBtn);

        await waitFor(() => {expect(CreateSubscriberApi).toHaveBeenCalledWith({channelId: 'test-channelId'}) });
        await waitFor(() => {expect(setIsSubscribed).toHaveBeenCalledWith(true)});
    });

    test.skip('handles Api error and displays error message', async() => {
        renderComponent({isAuthenticated:true})
        CreateSubscriberApi.mockResolvedValue({success: false, error: 'Subscription failed'});

        const subscribeBtn = screen.getByRole('button', {name: /subscribe/i});
        fireEvent.click(subscribeBtn);

        // await waitFor(()=>{
        //     expect(screen.getByText(/Subscription failed/i)).toBeInTheDocument();
        // })
        const errorMessage = await screen.findByText('Subscription failed')
        expect(errorMessage).toBeInTheDocument(); 
    });

    test.skip('handles network error', async () => {
        renderComponent({isAuthenticated:true, })
        CreateSubscriberApi.mockRejectedValueOnce(new Error('Network error'));

        console.error = jest.fn();
        const subscribeBtn = screen.getByRole('button', {name: /subscribe/i});
        fireEvent.click(subscribeBtn);

        const errorMessage = await screen.findByText('Error processing subscription');
        expect(errorMessage).toBeInTheDocument();
        // await waitFor(()=>{
        //     expect(console.error).toHaveBeenCalledWith('Error processing subscription');
        //   })
        //   console.error.mockRestore();
    });

})