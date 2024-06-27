import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { fetchHistories } from "../HistoryApi/GetHistoryApi";
import WatchHistory from "../WatchHistory";
import { BrowserRouter } from "react-router-dom";
import { deleteHistory } from "../HistoryApi/DeleteHistoryApi";
jest.mock('../HistoryApi/GetHistoryApi.js', () => ({
    fetchHistories: jest.fn(),
}));

// jest.mock('../HistoryApi/GetHistoryApi.js')
jest.mock('../HistoryApi/DeleteHistoryApi.js')

describe('WatchHistory', () => {
     // Mock data for testing
     const mockHistory = [
        {
            _id: '1',
            videoId: { thumbnailUrl: 'thumbnail.jpg', title: 'Video Title' },
            userId: { channelName: 'User' },
            views: 100,
            description: 'Video Description'
        }
    ];
    

    beforeEach(() => {
        fetchHistories.mockResolvedValue({ success: true, data: mockHistory }); // Mock the fetchHistories function
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    test('should renders watch history text', () => {
        render(
            <BrowserRouter>
            <WatchHistory history={[]} setHistory={jest.fn()}/>
            </BrowserRouter>
        )
        const watchHistoryText = screen.getByText('Watch History');
        expect(watchHistoryText).toBeInTheDocument();
    });

    test('renders watch history correctly', async () => {
        // fetchHistories.mockResolvedValueOnce({success: true, data: mockHistory })
        render(
        <BrowserRouter>
        <WatchHistory  history={mockHistory} setHistory={jest.fn()}/>
        </BrowserRouter>
        );
        
        await waitFor(() => {
            expect(fetchHistories).toHaveBeenCalledWith(1, 'watch');
        });

        const historyCard = screen.getByText(/Video Title/i);
        expect(historyCard).toBeInTheDocument(); // This won't throw an error if historyCard is null
    });

    test('handles delete history functionality', async () => {
        render(<WatchHistory history={mockHistory} setHistory={jest.fn()} />);

        deleteHistory.mockResolvedValueOnce({ success: true });
        
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(deleteHistory).toHaveBeenCalledWith('1'); // Ensure correct history ID is passed
        });

        await waitFor(() => {
            expect(screen.queryByText('Video Title')).not.toBeInTheDocument(); // Check if deleted history is removed from UI
        });
    });

    test('handles error state', async () => {
        fetchHistories.mockRejectedValueOnce(new Error('Failed to fetch history'));
        
        render(<WatchHistory history={[]} setHistory={jest.fn()} />);
        
        await waitFor(() => {
            expect(screen.getByText('Error fetching data')).toBeInTheDocument();
        });
    });

    test('displays notification after deleting history', async () => {
        render(<WatchHistory history={mockHistory} setHistory={jest.fn()} />);

        deleteHistory.mockResolvedValueOnce({ success: true });
        
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.getByText('History Deleted Successfully')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.queryByText('History Deleted Successfully')).not.toBeInTheDocument(); // Ensure notification disappears after 3 seconds
        }, { timeout: 3500 });
    });
})