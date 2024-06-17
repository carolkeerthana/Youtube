import { findByText, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Trending from "../Trending";
import Sidebar from "../../Sidebar/Sidebar";
import { fetchVideos } from "../../Feed/GetVideosApi";

jest.mock('../../Feed/GetVideosApi.js');
describe("Trending", () => {

    const mockVideoData =[
        { id: 1, 
        title: 'Video 1', 
        userId: { channelName: 'Channel 1' }, 
        views: 100, 
        createdAt: '2022-01-01', 
        description: 'Description 1', 
        thumbnailUrl: 'thumbnail1.jpg' },
        { id: 2, 
        title: 'Video 2', 
        userId: { channelName: 'Channel 2' }, 
        views: 200, 
        createdAt: '2022-01-02', 
        description: 'Description 2', 
        thumbnailUrl: 'thumbnail2.jpg' },
    ]

    beforeEach(() => {
        jest.clearAllMocks();
      });

    test('should have active class on trending in sidebar', () => {
        render(
        <BrowserRouter>
            <Sidebar />
        </BrowserRouter>
        )
        const trendingLink = screen.getByTestId('trending-link');
        fireEvent.click(trendingLink);
        expect(trendingLink).toHaveClass('active');
    });

    test('should renders "No results found." message when no videos returned', async() => {
        fetchVideos.mockResolvedValueOnce({success: true, data: []})
        render(
        <BrowserRouter>
            <Trending />
        </BrowserRouter>
        )   
        await expect(screen.getByText('No results found.')).toBeInTheDocument(); 
    }); 

    test('should renders videos when videos are returned', async() => {
        
        fetchVideos.mockResolvedValueOnce({success: true, data: mockVideoData})
        render(
        <BrowserRouter>
            <Trending />
        </BrowserRouter>
        )   
        await screen.findByText('Video 1')
        await expect(screen.getByText('Video 1')).toBeInTheDocument(); 
        await screen.findByText('Video 2')
        await expect(screen.getByText('Video 2')).toBeInTheDocument();
    });

    test('should handles Api success response', async() => {
        
        fetchVideos.mockResolvedValueOnce({success: true, data: mockVideoData})
        render(
        <BrowserRouter>
            <Trending />
        </BrowserRouter>
        )   
        const videoTitle = await screen.findByText('Video 1')
        expect(videoTitle).toBeInTheDocument(); 
    });

    test('should handles Api error response', async() => {
        const errorResponse = {
            success: false,
            error: "Resource not found",
          }
        fetchVideos.mockResolvedValueOnce(errorResponse);
        render(
        <BrowserRouter>
            <Trending />
        </BrowserRouter>
        )   
        const errorMessage = await screen.findByText('Resource not found')
        expect(errorMessage).toBeInTheDocument(); 
    });

    test('handles network error', async () => {
        fetchVideos.mockRejectedValueOnce(new Error('Network error'));

        render(
        <BrowserRouter>
            <Trending />
        </BrowserRouter>
        ) 

        const errorMessage = await screen.findByText('Error fetching data');
        expect(errorMessage).toBeInTheDocument();
    });
});