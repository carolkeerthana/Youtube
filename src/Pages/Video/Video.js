import React, { useEffect } from "react";
import "./Video.css";
import PlayVideo from "../../components/PlayVideo/PlayVideo";
import Recommended from "../../components/Recommended/Recommended";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import menuIcon from "../../assets/menu.png";
import VideoSidebar from "./VideoSidebar";

const Video = ({ sidebar, setSidebar }) => {
  const { videoId, categoryId } = useParams();

  useEffect(() => {
    setSidebar(false);
  }, [setSidebar]);

  useEffect(() => {
    if (sidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Clean up on component unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebar]);

  const handleVideoSidebarToggle = () => {
    setSidebar((prevSidebar) => !prevSidebar);
  };

  console.log(videoId);

  return (
    <div
      className={`video-page-container ${
        sidebar ? "nav-menu active" : "nav-menu"
      }`}
    >
      {/* <img 
        className='menu-icon' 
        onClick={handleVideoSidebarToggle } 
        src={menuIcon} 
        alt='menu' 
        data-testid='menu-icon'
      /> */}
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} page="video" />
      <div className="main-content">
        <div className={`play-container ${sidebar ? "" : "large-container"}`}>
          <PlayVideo videoId={videoId} />
          <Recommended videoId={videoId} categoryId={categoryId} />
        </div>
      </div>
      {sidebar && (
        <div
          data-testid="overlay"
          className="video-sidebar-overlay"
          onClick={() => setSidebar(false)}
        ></div>
      )}
    </div>
  );
};

export default Video;
