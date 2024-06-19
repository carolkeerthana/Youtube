import { fireEvent, getByRole, render, screen, waitFor } from "@testing-library/react"
import CreateSubscriber from "../CreateSubscriber/CreateSubscriber"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "../../../util/AuthContext"
import { CreateSubscriberApi } from "../CreateSubscriber/CreateSubscriberApi"

jest.mock("../CreateSubscriber/CreateSubscriberApi.js", () => ({
    CreateSubscriberApi: jest.fn(),
  }));
describe('CreateSubscriber', () => {

    const renderComponent = ({isAuthenticated, isSubscribed=false} ={})=>{
        const setIsSubscribed = jest.fn();

        render(
            <BrowserRouter>
                <AuthProvider value ={{isAuthenticated}}>
                    <CreateSubscriber channelId="test-channelId" isSubscribed={isSubscribed} 
                    setIsSubscribed= {setIsSubscribed} />
                </AuthProvider>
            </BrowserRouter>
        )

        return {setIsSubscribed};
    }

    test('check if subscribe button is present', () => {
        renderComponent({isAuthenticated:false})
        const subscribeBtn = screen.getByRole('button', {name: /subscribe/i});

        expect(subscribeBtn).toBeInTheDocument();
    });

    test('shows signInPopup when not authenticated and button is clicked', () => {
        renderComponent({isAuthenticated:false})
        const subscribeBtn = screen.getByRole('button', {name: /subscribe/i});
  
        fireEvent.click(subscribeBtn);
        expect(screen.getByText(/Sign in to subscribe to this channel./i)).toBeInTheDocument();
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