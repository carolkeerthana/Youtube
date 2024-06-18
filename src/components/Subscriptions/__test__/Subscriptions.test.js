import { fireEvent, render, screen} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../../Sidebar/Sidebar";
import Subscriptions from "../Subscriptions";
import { fetchSubscriptions } from "../SubscriptionApi";

jest.mock('../../Subscriptions/SubscriptionApi.js');
describe("Subscriptions", () => {

    const mockVideoData =[
        {
            _id: '1',
            title: 'Sample Subscription 1',
            thumbnailUrl: 'sample-thumbnail-1.jpg',
            views: 100,
            createdAt: new Date().toISOString(),
            userId: {
              channelName: 'Sample Channel 1',
              photoUrl: 'sample-avatar-1.jpg',
            },
          },
          {
            _id: '2',
            title: 'Sample Subscription 2',
            thumbnailUrl: 'sample-thumbnail-2.jpg',
            views: 200,
            createdAt: new Date().toISOString(),
            userId: {
              channelName: 'Sample Channel 2',
              photoUrl: 'sample-avatar-2.jpg',
            },
          },
        ];

    beforeEach(() => {
        jest.clearAllMocks();
      });

    test('should have active class on Subscriptions in sidebar', () => {
        render(
        <BrowserRouter>
            <Sidebar />
        </BrowserRouter>
        )
        const subscriptionsLink = screen.getByTestId('subscriptions-link');
        fireEvent.click(subscriptionsLink);
        expect(subscriptionsLink).toHaveClass('active');
    });

    test('should renders "No results found." message when channel is not subscribed', async() => {
        fetchSubscriptions.mockResolvedValueOnce({success: true, data: []})
        render(
        <BrowserRouter>
            <Subscriptions />
        </BrowserRouter>
        )   
        await expect(screen.getByText('No results found.')).toBeInTheDocument(); 
    }); 

    test('should renders videos from the channel subscribed', async() => {
        
        fetchSubscriptions.mockResolvedValueOnce({success: true, data: mockVideoData})
        render(
        <BrowserRouter>
            <Subscriptions />
        </BrowserRouter>
        )   
        await screen.findByText('Sample Subscription 1')
        await expect(screen.getByText('Sample Subscription 1')).toBeInTheDocument(); 
        await screen.findByText('Sample Subscription 2')
        await expect(screen.getByText('Sample Subscription 2')).toBeInTheDocument();
    });

    test('should handles Api success response', async() => {
        
        fetchSubscriptions.mockResolvedValueOnce({success: true, data: mockVideoData})
        render(
        <BrowserRouter>
            <Subscriptions />
        </BrowserRouter>
        )   
        const videoTitle = await screen.findByText('Sample Subscription 1')
        expect(videoTitle).toBeInTheDocument(); 
    });

    test('should handles Api error response', async() => {
        const errorResponse = {
            success: false,
            error: "Error fetching data",
          }
        fetchSubscriptions.mockResolvedValueOnce(errorResponse);
        render(
        <BrowserRouter>
            <Subscriptions />
        </BrowserRouter>
        )   
        const errorMessage = await screen.findByText('Error fetching data')
        expect(errorMessage).toBeInTheDocument(); 
    });

    test('handles network error', async () => {
        fetchSubscriptions.mockRejectedValueOnce(new Error('Network error'));

        render(
        <BrowserRouter>
            <Subscriptions />
        </BrowserRouter>
        ) 

        const errorMessage = await screen.findByText('Error fetching data');
        expect(errorMessage).toBeInTheDocument();
    });
});