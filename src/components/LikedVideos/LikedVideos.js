import { Link } from 'react-router-dom';
import { getLikedVideos } from './GetLikedVideos';
import './LikedVideos.css';
import React, { useEffect, useState } from 'react'
import moment from 'moment';

const LikedVideos = () => {
    const [likedVideos, setLikedVideos] = useState([]);
    const [error, setError] = useState('');

    const fetchVideos = async() => {
        try {
            const response = await getLikedVideos();
            console.log('API response:', response);
            if(response.success && Array.isArray(response.data)){
                setLikedVideos(response.data);
            }else{
              setError(response.error);
              setLikedVideos([]);
            }   
          } catch (error) {
            setError('Error fetching data');
            setLikedVideos([]);
          }
    } 
    useEffect(() => {
        fetchVideos();         
}, [])
  return (
    <div className='liked-videos'>
      {error ? (
            <p>{error}</p>
        ) : (
            likedVideos && likedVideos.length > 0 ? (
            likedVideos.map((likedVideo) => {
            return(
            <Link to={`/watch/${likedVideo._id}`} className='liked-videos-card' key={likedVideo._id}>           
                <img src={`https://apps.rubaktechie.me/uploads/thumbnails/${likedVideo.thumbnailUrl}`} alt={likedVideo.title}/>
                <div className='liked-videos-details'>
                <img src={`https://apps.rubaktechie.me/uploads/avatars/${likedVideo.userId.photoUrl}`} alt={likedVideo.userId.channelName}/>
                <div>
                <h2>{likedVideo.title}</h2>
                <h3>{likedVideo.userId.channelName}</h3>
                <p>{likedVideo.views} views &bull; {moment(likedVideo.createdAt).fromNow()}</p>
                </div>
                </div>
            </Link>
            )
            })                 
            ) : (
                <p>No results found.</p>
            )
        )}
    </div>
  )
}

export default LikedVideos
