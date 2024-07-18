import React, { useEffect, useState } from 'react'
import './VideoSidebar.css'
import menuIcon from '../../assets/menu.png';
import logo from '../../assets/logo.png';
import home from '../../assets/home.png'
import trending from '../../assets/trending-topic.png'
import subscriptions from '../../assets/subscribe.png'
import history from '../../assets/history.png'
import like from '../../assets/like.png'
import gameIcon from '../../assets/game_icon.png'
import live from '../../assets/live.png'
import settings from '../../assets/settings.png'
import report from '../../assets/report.png'
import help from '../../assets/help.png'
import feedback from '../../assets/feedback.png'
import youtube from '../../assets/youtube.png'
import jack from '../../assets/jack.png'
import tom from '../../assets/tom.png'
import {useAuth} from '../../util/AuthContext'
import { Link, useLocation} from 'react-router-dom';

const VideoSidebar = ({sidebar, setSidebar, page, compactSidebar}) => { 
    const location = useLocation();
    const isVideoPage = page === 'video';
    const {isAuthenticated} = useAuth();
    const [activePage, setActivePage] = useState(location.pathname);

    useEffect(()=>{
        setActivePage(location.pathname);
        console.log('Active page:', location.pathname);
    }, [location]);

      const handleActivePageClick = (path) => {
        setActivePage(path); // Update active page when a sidebar link is clicked
      };

    const handleVideoSidebarToggle = () => {
        setSidebar(!sidebar);
      };

      useEffect(() => {
        if (isVideoPage && sidebar) {
            document.body.style.overflow = 'hidden'; // Prevent scrolling when sidebar is open on video page
        } else {
            document.body.style.overflow = 'auto'; // Enable scrolling when sidebar is closed
        }
    }, [isVideoPage, sidebar]);

    const handleProtectedLinkClick = (e, path) => {
        if (!isAuthenticated) {
            e.preventDefault();
            // alert('You must be signed in to access this page.');
        } else {
            console.log('Clicked path:', path);
            setActivePage(path);
        }
    };

  return (
    <>
        {isVideoPage  &&(
        <div className={`sidebar video-sidebar ${sidebar ? '' : 'hidden-sidebar'}`} data-testid="sidebar">
        <div className='video-icons' >
            <img 
            className='menu-icon' 
            onClick={handleVideoSidebarToggle}      
            src={menuIcon} 
            alt='menu' 
            data-testid='menu-icon'/>
            <Link to='/'><img className='logo' src={logo} alt='logo' data-testid='youtube-logo'/></Link>
        </div>
        <div className='shortcut-links'>
            <Link to={'/'} className='linked-icons specific-link'>
            <div className={`side-link ${activePage === '/' ? 'active' : ''}`} onClick={() =>handleActivePageClick('/')} data-testid='home-link'>
                <img src={home} alt='' /><p>Home</p>    
            </div>
            </Link>
            <Link to={'/trending'} className='linked-icons specific-link'>
            <div className={`side-link ${activePage === '/trending' ? 'active' : ''}`} onClick={() =>handleActivePageClick('/trending')} data-testid='trending-link'>
                <img src={trending} alt=''/><p>Trending</p>
            </div>
            </Link>
            <Link to='/subscriptions' className='linked-icons specific-link'>
            <div className={`side-link ${activePage === '/subscriptions' ? 'active' : ''}`} onClick={(e) =>handleProtectedLinkClick(e,'/subscriptions') } data-testid='subscriptions-link'>
                <img src={subscriptions} alt=''/><p>Subscriptions</p>
            </div>
            </Link>
            <hr/>
            <div className='shortcut-links'>
            <h3>You</h3>
            <Link to='/history' className='linked-icons specific-link'>
                <div className={`side-link ${activePage === '/history' ? 'active' : ''}`}  onClick={(e) =>handleProtectedLinkClick(e, '/history')} data-testid='history-link'>
                <img src={history} alt=''/><p>History</p>
                </div>
            </Link>
            <Link to='/liked-videos' className='linked-icons specific-link'>
            <div className={`side-link ${activePage === '/liked-videos' ? 'active' : ''}`} onClick={(e) =>handleProtectedLinkClick(e,'/liked-videos')} data-testid='liked-videos-link'>
                <img src={like} alt=''/><p>Liked videos</p>
            </div>
            </Link>
            </div>
            <hr/>
        </div> 
        <div className='subscribed-list'>
            <h3>Subscribed</h3>
            <div className='side-link' data-testid='MrBeast-link'>
                <img src={jack} alt=''/><p>MrBeast</p>
            </div>
            <div className='side-link' data-testid='5-min-craft-link'>
                <img src={tom} alt=''/><p>5-min craft</p>
            </div>
        </div>
        <hr/>
        <div className='shortcut-links'>
            <h3>Explore</h3>
            <div className={`side-link ${activePage === 'uTube Premium' ? 'active' : ''}`} onClick={() =>handleActivePageClick('uTube Premium')} data-testid='uTube-Premium-link'>
                <img src={youtube} alt=''/><p>UTube Premium</p>
            </div>
            <div className={`side-link ${activePage === 'gaming' ? 'active' : ''}`} onClick={() =>handleActivePageClick('gaming')} data-testid='gaming-link'>
            <img src={gameIcon} alt=''/><p>Gaming</p>
            </div>
            <div className={`side-link ${activePage === 'live' ? 'active' : ''}`} onClick={() =>handleActivePageClick('live')} data-testid='live-link'>
            <img src={live} alt=''/><p>Live</p>
            </div>
        </div>
        <hr/>
        <div className='shortcut-links'>
            <div className={`side-link ${activePage === 'settings' ? 'active' : ''}`} onClick={() =>handleActivePageClick('settings')} data-testid='settings-link'>
                <img src={settings} alt=''/><p>Settings</p>
            </div>
            <div className={`side-link ${activePage === 'report history' ? 'active' : ''}`} onClick={() =>handleActivePageClick('report history')} data-testid='report-history-link'>
            <img src={report} alt=''/><p>Report History</p>
            </div>
            <div className={`side-link ${activePage === 'help' ? 'active' : ''}`} onClick={() =>handleActivePageClick('help')} data-testid='help-link'>
            <img src={help} alt=''/><p>Help</p>
            </div>
            <div className={`side-link ${activePage === 'send feedback' ? 'active' : ''}`} onClick={() =>handleActivePageClick('send feedback')} data-testid='send-feedback-link'>
            <img src={feedback} alt=''/><p>Send feedback</p>
            </div>
        </div>
    </div>
    )}
    {/* {sidebar && <div className="video-sidebar-overlay" data-testid="overlay" onClick={() => setSidebar(false)}></div>} */}
</> 
  )    
}

export default VideoSidebar