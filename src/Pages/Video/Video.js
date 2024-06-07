import React from 'react'
import './Video.css';
import PlayVideo from '../../components/PlayVideo/PlayVideo';
import Recommended from '../../components/Recommended/Recommended';
import { useParams } from 'react-router-dom';

const Video = () => {

  const {videoId, categoryId} = useParams();

  console.log("Rendering Video component with videoId:", videoId);

  return (
    <div className='play-container'>
      <PlayVideo videoId={videoId}/>
      <Recommended videoId={videoId} categoryId={categoryId}/>
    </div>
  ) 
}

export default Video
