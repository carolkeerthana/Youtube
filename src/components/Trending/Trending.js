import React, { useEffect, useState } from 'react'
import './Trending.css'
import { fetchVideos } from '../Feed/GetVideosApi';
import moment from 'moment';

const Trending = () => {
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState('');

    const fetchTrendingVideos = async() => {
        try {
            const response = await fetchVideos();
            console.log('API response:', response);
            if(response.success && Array.isArray(response.data)){
                const sortedVideos = response.data.sort((a,b) => b.views - a.views);
              setVideos(sortedVideos);
            }else{
              setError(response.error);
              setVideos([]);
            }   
          } catch (error) {
            setError('Error fetching data');
            setVideos([]);
          }
    } 
    useEffect(() => {
        fetchTrendingVideos();         
}, []);
    
  return (
    <div className='trending-page'>
        {error ? (
                <p>{error}</p>
            ) : ( 
                videos && videos.length > 0 ? (
                videos.map((video) => (
                    video &&
                    <div key={video.id} className="trending-result-item flex-div">
                        <img src={`https://apps.rubaktechie.me/uploads/thumbnails/${video.thumbnailUrl}`} alt={video.title}/>
                        <div className="result-details">
                            <h3>{video.title}</h3>
                            <p className="channel-name">{video.userId.channelName}</p>
                            <p className="views-time">{video.views} views &bull; {moment(video.createdAt).fromNow()}</p>
                            <p className="description">{video.description}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>No results found.</p>
            )
        )}
    </div>
  )
}

export default Trending
