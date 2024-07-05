import React, { useEffect } from 'react'
import './Video.css';
import PlayVideo from '../../components/PlayVideo/PlayVideo';
import Recommended from '../../components/Recommended/Recommended';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import menuIcon from '../../assets/menu.png'; 

const Video = ({sidebar, setSidebar}) => {

  const {videoId, categoryId} = useParams();

  // useEffect(() => {
  //   setSidebar(false); // Hide sidebar initially when Video component loads
  // }, [setSidebar]);

  const handleVideoSidebarToggle  = () => {
    setSidebar(prevSidebar => !prevSidebar);
  };

  console.log(videoId);

  return (
    <div className={`video-page-container ${sidebar ? 'nav-menu active' : 'nav-menu'}`}>
      {/* <img 
        className='menu-icon' 
        onClick={handleVideoSidebarToggle } 
        src={menuIcon} 
        alt='menu' 
        data-testid='menu-icon'
      /> */}
    <Sidebar sidebar={sidebar} setSidebar={setSidebar} page='video'/>
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
