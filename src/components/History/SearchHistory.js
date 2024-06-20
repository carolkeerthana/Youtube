import { Link } from 'react-router-dom';
import { fetchHistories } from './HistoryApi/GetHistoryApi';
import './History.css'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import Pagination from './Pagination';

const SearchHistory = () => {
    const [histories, setHistories] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchHistoryVideos = async(page) => {
        try {
            const response = await fetchHistories(page, 'search');
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

  return (
        <div className='left-side-history'>
        <h2>Search History</h2>
        {error ? (
                <p>{error}</p>
            ) : ( 
                histories && histories.length > 0 ? (
                    <>
                   {histories.map((history) => (
                    <Link to={`/watch/${history._id}`} className='history-card' key={history._id}>           
                        <img src={`https://apps.rubaktechie.me/uploads/thumbnails/${history.thumbnailUrl}`} alt={history.title}/>
                        <div className='history-details'>
                        <img src={`https://apps.rubaktechie.me/uploads/avatars/${history.userId.photoUrl}`} alt={history.userId.channelName}/>
                        <div>
                        <h2>{history.searchText}</h2>
                        <h3>{history.userId.channelName}</h3>
                        <p>{history.views} views &bull; {moment(history.createdAt).fromNow()}</p>
                        </div>
                        </div>
                    </Link>
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
        </div>
  )
}

export default SearchHistory
