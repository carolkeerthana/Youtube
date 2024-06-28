import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { fetchHistories } from "../HistoryApi/GetHistoryApi";
import SearchHistory from "../SearchHistory";
import { deleteHistory } from "../HistoryApi/DeleteHistoryApi";
import { BrowserRouter } from "react-router-dom";

jest.mock('../HistoryApi/GetHistoryApi');
jest.mock('../HistoryApi/DeleteHistoryApi');

const mockHistories = [
  {
    _id: '1',
    searchText: 'Search Text 1',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    searchText: 'Search Text 2',
    createdAt: new Date().toISOString(),
  },
];
describe('Search History', () => {
    let setHistoryMock;

    beforeEach(() => {
        setHistoryMock = jest.fn();
        fetchHistories.mockResolvedValue({ success: true, data: mockHistories, totalPages: 1 });
      });

      test('renders SearchHistory component', async () => {
        render(
        <BrowserRouter>
            <SearchHistory history={[]} setHistory={setHistoryMock} />
        </BrowserRouter>);
        
        expect(screen.getByText('Search History')).toBeInTheDocument();
        
        await waitFor(() => expect(fetchHistories).toHaveBeenCalled());
      });

      test('displays fetched search history items', async () => {
        render(<SearchHistory history={mockHistories} setHistory={setHistoryMock} />);
    
        expect(screen.getByText('Search Text 1')).toBeInTheDocument();
        expect(screen.getByText('Search Text 2')).toBeInTheDocument();
      });

      test('displays error message on fetch failure', async () => {
        fetchHistories.mockRejectedValueOnce(new Error('Error fetching data'));
        
        render(<SearchHistory history={[]} setHistory={setHistoryMock} />);
    
        await waitFor(() => {expect(screen.getByText('Error fetching data')).toBeInTheDocument()});
        expect(setHistoryMock).toHaveBeenCalledWith([]);
      });

      test.skip('sets correct state on successful fetch', async () => {
        render(<SearchHistory history={[]} setHistory={setHistoryMock} />);
    
        await waitFor(() => expect(fetchHistories).toHaveBeenCalled());
    
        await waitFor(() => expect(setHistoryMock).toHaveBeenCalledWith(mockHistories));

        expect(screen.getByText('Search Text 1')).toBeInTheDocument();
        expect(screen.getByText('Search Text 2')).toBeInTheDocument();
      });

      test('deletes search history item', async () => {
        render(<SearchHistory history={mockHistories} setHistory={setHistoryMock} setError={jest.fn()}/>);

        deleteHistory.mockResolvedValueOnce({ success: true });
        
        const deleteButton = screen.getAllByRole('button')[0];
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(deleteHistory).toHaveBeenCalledWith('1');
        });

        await waitFor(() => {
            expect(setHistoryMock).toHaveBeenCalledWith(expect.not.objectContaining({ _id: '1' }));
        });
    });

    test('displays notification after deleting history', async () => {
        render(<SearchHistory history={mockHistories} setHistory={setHistoryMock} />);

        deleteHistory.mockResolvedValueOnce({ success: true });
        
        const deleteButton = screen.getAllByRole('button')[0];
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.getByText('History deleted successfully')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.queryByText('History deleted successfully')).not.toBeInTheDocument(); // Ensure notification disappears after 3 seconds
        }, { timeout: 3500 });
    });

    test('handles delete history error', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
        deleteHistory.mockRejectedValueOnce(new Error('Failed to delete history'));
    
        render(
            <BrowserRouter>
                <SearchHistory history={mockHistories} setHistory={setHistoryMock} />
            </BrowserRouter>
        );
    
        const deleteButton = screen.getAllByRole('button')[0];
        fireEvent.click(deleteButton);
    
        await waitFor(() => {
            expect(deleteHistory).toHaveBeenCalledWith('1');
        });
    
        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting history:', expect.any(Error));
        });
    
        consoleErrorSpy.mockRestore();
    }); 

      test('displays no search history message if history is empty', () => {
        render(<SearchHistory history={[]} setHistory={setHistoryMock} />);
    
        expect(screen.getByText('No search history yet.')).toBeInTheDocument();
      });
})