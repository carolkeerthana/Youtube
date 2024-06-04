import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter} from 'react-router-dom';
import Feed from '../Feed';

    test('renders feed with data', async () => {
      // Mock fetch function to return dummy data
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ 
            success: true, 
            data: [{ 
              _id: '1', 
              title: 'Video Title', 
              userId: { channelName: 'Channel Name' }, 
              views: 100, 
              createdAt: new Date().toISOString() }] }),
        })
      );

      render(
        <BrowserRouter>
        <Feed category="someCategory" />
      </BrowserRouter>
      );

      const videoTitle = await screen.findByText(/Video Title/i);
      expect(videoTitle).toBeInTheDocument();
    });