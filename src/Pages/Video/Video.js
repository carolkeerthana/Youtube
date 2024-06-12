import React from 'react'
import './Video.css';
import PlayVideo from '../../components/PlayVideo/PlayVideo';
import Recommended from '../../components/Recommended/Recommended';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';

const Video = ({sidebar, setSidebar}) => {

  const {videoId, categoryId} = useParams();

  console.log(videoId);

  return (
    <div className={`video-page-container ${sidebar ? 'dimmed' : ''}`}>
    <Sidebar sidebar={sidebar} setSidebar={setSidebar} showOverlay={true} page='video'/>
    <div className="main-content">
      <div className={`play-container ${sidebar ? "" : 'large-container'}`}>
        <PlayVideo videoId={videoId}/>
        <Recommended videoId={videoId} categoryId={categoryId}/>
        </div>
    </div>
      {sidebar && <div className="overlay" onClick={() => setSidebar(false)}></div>}
    </div>
  )
}

export default Video
