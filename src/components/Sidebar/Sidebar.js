import React, { useState, useEffect } from 'react'
import './Sidebar.css'
import menuIcon from '../../assets/menu.png';
import logo from '../../assets/logo.png';
import home from '../../assets/home.png'
import gameIcon from '../../assets/game_icon.png'
import automobiles from '../../assets/automobiles.png'
import tech from '../../assets/tech.png'
import music from '../../assets/music.png'
import jack from '../../assets/jack.png'
import tom from '../../assets/tom.png'
import { Link} from 'react-router-dom';

const Sidebar = ({sidebar, setSidebar, page}) => { 
    const [videoSidebar, setVideoSidebar] = useState(false);
    const isVideoPage = page === 'video';
    const isHomePage = page === 'home';

    const handleVideoSidebarToggle = () => {
        setVideoSidebar(!videoSidebar);
        if (sidebar && isVideoPage) {
          setSidebar(false);
        }
      };

      useEffect(() => {
        if (isVideoPage) {
          setSidebar(false); // Reset global sidebar when navigating to video page
        }
      }, [isVideoPage, setSidebar]);

    const toggleSidebar = () =>{
        setSidebar(prev=>prev===false?true:false)
      }
  return (
    <>
    {(isVideoPage || (isHomePage && sidebar)) && (
    <>
    {isVideoPage && (
        <div className='video-icons' onClick={handleVideoSidebarToggle}>
            <img className='menu-icon' onClick={toggleSidebar} src={menuIcon} alt='menu' data-testid='menu-icon'/>
            <Link to='/'><img className='logo' src={logo} alt='logo' data-testid='youtube-logo'/></Link>
        </div>
    )}
        <div className={`sidebar ${sidebar ? "" : "small-sidebar"} ${isVideoPage ? "video-sidebar" : ""}`} data-testid="sidebar">
        <div className='shortcut-links'>
            <div className='side-link'>
                <img src={home} alt='' /><p>Home</p>
            </div>
            <div className='side-link'>
                <img src={gameIcon} alt=''/><p>Trending</p>
            </div>
            <div className='side-link'>
                <img src={automobiles} alt=''/><p>Subscriptions</p>
            </div>
            <hr/>
            <div className='shortcut-links'>
            <h3>You</h3>
            <div className='side-link'>
                <img src={tech} alt=''/><p>History</p>
            </div>
            <div className='side-link'>
                <img src={music} alt=''/><p>Liked videos</p>
            </div>
            </div>
            <hr/>
        </div> 
        <div className='subscribed-list'>
            <h3>Subscribed</h3>
            <div className='side-link'>
                <img src={jack} alt=''/><p>MrBeast</p>
            </div>
            <div className='side-link'>
                <img src={tom} alt=''/><p>5-min craft</p>
            </div>
        </div>
        <hr/>
        <div className='shortcut-links'>
            <h3>Explore</h3>
            <div className='side-link'>
                <img src={gameIcon} alt=''/><p>UTube Premium</p>
            </div>
            <div className='side-link'>
            <img src={gameIcon} alt=''/><p>Gaming</p>
            </div>
            <div className='side-link'>
            <img src={gameIcon} alt=''/><p>Live</p>
            </div>
        </div>
        <hr/>
        <div className='shortcut-links'>
            <div className='side-link'>
                <img src={gameIcon} alt=''/><p>Setting</p>
            </div>
            <div className='side-link'>
            <img src={gameIcon} alt=''/><p>Report History</p>
            </div>
            <div className='side-link'>
            <img src={gameIcon} alt=''/><p>Help</p>
            </div>
            <div className='side-link'>
            <img src={gameIcon} alt=''/><p>Send feedback</p>
            </div>
        </div>
    </div>
    </>
)}
    {isVideoPage && sidebar && <div className="overlay" onClick={() => setSidebar(false)}></div>}
    </>
  )
}

export default Sidebar