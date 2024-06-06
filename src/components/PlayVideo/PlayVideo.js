import React, { useEffect, useState } from 'react'
import './PlayVideo.css'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import userProfile from '../../assets/user_profile.jpg'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import Comments from '../Comments/Comments'

const PlayVideo = ({videoId}) => {

    const[videoData, setVideoData] = useState(null);
    const navigate = useNavigate();
   
    useEffect(() => {
    const fetchData = async () =>{
    const videoUrl= `https://apps.rubaktechie.me/api/v1/videos/${videoId}`

    try {
      const response = await fetch(videoUrl);
      const json = await response.json();
      console.log('API response:', json);
      if((json.success || json.sucess) && json.data) {
        setVideoData(json.data);
      }else{
        console.error('API response is not in the expected format:', json);
      }   
    } catch (error) {
      navigate('/error');
    }
  };

  fetchData();
  }, [videoId, navigate]);

  if (!videoData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='play-video'>
      <video type controls autoPlay >
        <source src={`https://apps.rubaktechie.me/uploads/videos/${videoData.url}`} type="video/mp4"/>
    </video>
      <h3>{videoData.title}</h3>
      <div className='play-video-info'>
        <p>{videoData.views} Views &bull; {moment(videoData.createdAt).fromNow()}</p>
      <div>
        <span><img src={like} alt=''/> {videoData.likes}</span>
        <span><img src={dislike} alt=''/> {videoData.dislikes}</span>
        <span><img src={share} alt=''/> Share</span>
        <span><img src={save} alt=''/> Save</span>
      </div>
    </div>
    <hr />
    {videoData.userId && (
    <div className='publisher'>
        <img src={videoData.userId.photoUrl} alt={videoData.userId.channelName} avatar/>
        <div>
            <p>{videoData.userId.channelName}</p>
            <span>{videoData.userId.subscribers} subscribers</span>
        </div>
        <button>Subscribe</button>
    </div>
    )}
    <div className='vid-description'>
        <p>{videoData.description}</p>
        <p>Subscribe to {videoData.userId.channelName} to watch more videos like this</p>
        <hr/>
        <Comments videoId={videoId}/>
    </div>
    </div>
  )
}

export default PlayVideo
