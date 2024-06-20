import { Link } from 'react-router-dom';
import './WatchHistory.css'
import { fetchHistories } from './HistoryApi/GetHistoryApi';
import './History.css'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import Pagination from './Pagination';
import closeIcon from '../../assets/close.png';
import { deleteHistory } from './HistoryApi/DeleteHistoryApi';

const WatchHistory = () => {
    const [histories, setHistories] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [notification, setNotification] = useState('');

    const fetchHistoryVideos = async(page) => {
        try {
            const response = await fetchHistories(page, 'watch');
            console.log('API response:', response);
            if(response.success && Array.isArray(response.data)){
                setHistories(response.data);
                setTotalPages(response.totalPages);
            }else{
              setError(response.error);
              setHistories([]);
            }  
          } catch (error) {
            setError('Error fetching data');
            setHistories([]);
          }
    } 
    useEffect(() => {
        fetchHistoryVideos(currentPage);         
}, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleDeleteHistory = async(historyId) => {
        try {
            const response = await deleteHistory(historyId);
            if(response.success){
                setHistories((prevHistories) => prevHistories.filter((history) => history._id !== historyId));
                setNotification('History deleted successfully');
                setTimeout(() => setNotification(''), 3000); // Hide notification after 3 seconds
            }else {
                console.error('Failed to delete history:', response);
            }
        } catch (error) {
            console.error('Error deleting history:', error);
        }
    }

  return (
        <div className='left-side-history'>
        <h2>Watch History</h2>
        {error ? (
                <p>{error}</p>
            ) : ( 
                histories && histories.length > 0 ? (
                    <>
                   {histories.map((history) => (
                       <div className='history-card' key={history._id}>           
                        <div className='history-image'>
                        <img src={`https://apps.rubaktechie.me/uploads/thumbnails/${history.videoId.thumbnailUrl}`} alt={history.videoId.title}/>
                        </div>
                        <div className='history-details'> 
                            <div className='title-header'>
                                <h2>{history.videoId.title}</h2>
                                <button className='delete-button' onClick={()=>handleDeleteHistory(history._id)}><img src={closeIcon} alt=''/></button>
                            </div>  
                        <p>{history.userId.channelName} &bull; {history.videoId.views} views</p>
                        <p>{history.videoId.description}</p>
                        </div>
                    </div>
                    ))}
                  <Pagination
                  currentPage = {currentPage}
                  totalPages = {totalPages}
                  onPageChange={handlePageChange}/>    
                  </>          
            ) : (
                <p>No results found.</p>
            )
        )}
        {notification && <div className='notification'>{notification}</div>}
        </div>
  )
}

export default WatchHistory
