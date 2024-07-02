import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { fetchVideos } from "../../Feed/GetVideosApi";
import { BrowserRouter } from "react-router-dom";
import Recommended from "../Recommended";

jest.mock('../../Feed/GetVideosApi.js');

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));
describe('Recommended', () => {
    test('renders video list on successful API call', async () => {
        const mockVideos = [
            {
                _id: '1',
                thumbnailUrl: 'thumbnail1.jpg',
                title: 'Video 1',
                userId: { channelName: 'Channel 1' },
                views: 1000,
                createdAt: new Date().toISOString(),
            },
            {
                _id: '2',
                thumbnailUrl: 'thumbnail2.jpg',
                title: 'Video 2',
                userId: { channelName: 'Channel 2' },
                views: 2000,
                createdAt: new Date().toISOString(),
            },
        ];

        fetchVideos.mockResolvedValue({
            json: async () => ({ success: true, data: mockVideos }),
        });

        render(
            <BrowserRouter>
                <Recommended videoId="123" />
            </BrowserRouter>
        );

        await waitFor(() =>
            mockVideos.forEach((video) => {
                expect(screen.getByText(video.title)).toBeInTheDocument();
                expect(screen.getByText(video.userId.channelName)).toBeInTheDocument();
                expect(screen.getByText((content, element) =>
                    content.startsWith(`${video.views} Views`) && content.includes('•')
                )).toBeInTheDocument();
            })
        );   
    });

    test('navigates to video watch page on video click', async () => {
        const mockVideoId = '1';
        const mockVideos = [
            {
                _id: mockVideoId,
                thumbnailUrl: 'thumbnail1.jpg',
                title: 'Video 1',
                userId: { channelName: 'Channel 1' },
                views: 1000,
                createdAt: new Date().toISOString(),
            },
        ];

        fetchVideos.mockResolvedValue({
            json: async () => ({ success: true, data: mockVideos }),
        });

        render(
            <BrowserRouter>
                <Recommended videoId="123" />
            </BrowserRouter>
        );

        // Wait for the video list to be rendered
        await waitFor(() => {
            mockVideos.forEach((video) => {
                expect(screen.getByText(video.title)).toBeInTheDocument();
                expect(screen.getByText(video.userId.channelName)).toBeInTheDocument();
                expect(screen.getByText((content, element) =>
                    content.startsWith(`${video.views} Views`) && content.includes('•')
                )).toBeInTheDocument();
            });
        });

        // Simulate clicking on the video thumbnail
        const videoElement = screen.getByAltText(`Thumbnail for ${mockVideos[0].title}`);
        fireEvent.click(videoElement);

        // Wait for navigation to occur
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(`/watch/${mockVideoId}`);
        });
    });

    test('navigates to error page on API error', async () => {
        fetchVideos.mockRejectedValue(new Error('API error'));

        render(
            <BrowserRouter>
                <Recommended videoId="123" />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/error');
        });
    });

    test('handles unexpected API response format', async () => {
        // Mock console.error to spy on its calls
        const originalConsoleError = console.error;
        console.error = jest.fn();

        // Mock fetchVideos to return an unexpected format
        fetchVideos.mockResolvedValue({
            json: async () => ({ success: false, error: 'Unexpected format' }),
        });

        render(
            <BrowserRouter>
                <Recommended videoId="123" />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('API response is not in the expected format:', { success: false, error: 'Unexpected format' });
        });


        // Restore the original console.error after the test
        console.error = originalConsoleError;
    });
})