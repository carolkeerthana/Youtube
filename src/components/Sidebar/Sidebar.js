import React, { useEffect, useState } from 'react'
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
    const isVideoPage = page === 'video';
    const [activePage, setActivePage] = useState('home');

    const handleActivePageClick = (item) => {
        if(item !== activePage){
            setActivePage(item);
        }
    }

    const handleVideoSidebarToggle = () => {
          setSidebar((prevSidebar) => !prevSidebar);
      };

      useEffect(() => {
        if (isVideoPage && sidebar) {
            document.body.style.overflow = 'hidden'; // Prevent scrolling when sidebar is open on video page
        } else {
            document.body.style.overflow = 'auto'; // Enable scrolling when sidebar is closed
        }
    }, [isVideoPage, sidebar]);

  return (
    <>
        {isVideoPage && sidebar &&(
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
            <div className={`side-link ${activePage === 'home' ? 'active' : ''}`} onClick={() =>handleActivePageClick('home')} data-testid='home-link'>
                <img src={home} alt='' /><p>Home</p>
            </div>
            <div className={`side-link ${activePage === 'trending' ? 'active' : ''}`} onClick={() =>handleActivePageClick('trending')} data-testid='trending-link'>
                <img src={gameIcon} alt=''/><p>Trending</p>
            </div>
            <div className={`side-link ${activePage === 'subscriptions' ? 'active' : ''}`} onClick={() =>handleActivePageClick('subscriptions')} data-testid='subscriptions-link'>
                <img src={automobiles} alt=''/><p>Subscriptions</p>
            </div>
            <hr/>
            <div className='shortcut-links'>
            <h3>You</h3>
            <div className={`side-link ${activePage === 'history' ? 'active' : ''}`} onClick={() =>handleActivePageClick('history')} data-testid='history-link'>
                <img src={tech} alt=''/><p>History</p>
            </div>
            <div className={`side-link ${activePage === 'liked videos' ? 'active' : ''}`} onClick={() =>handleActivePageClick('liked videos')} data-testid='liked-videos-link'>
                <img src={music} alt=''/><p>Liked videos</p>
            </div>
            </div>
            <hr/>
        </div> 
        <div className='subscribed-list'>
            <h3>Subscribed</h3>
            <div className={`side-link ${activePage === 'MrBeast' ? 'active' : ''}`} onClick={() =>handleActivePageClick('MrBeast')} data-testid='MrBeast-link'>
                <img src={jack} alt=''/><p>MrBeast</p>
            </div>
            <div className={`side-link ${activePage === '5-min craft' ? 'active' : ''}`} onClick={() =>handleActivePageClick('5-min craft')} data-testid='5-min-craft-link'>
                <img src={tom} alt=''/><p>5-min craft</p>
            </div>
        </div>
        <hr/>
        <div className='shortcut-links'>
            <h3>Explore</h3>
            <div className={`side-link ${activePage === 'uTube Premium' ? 'active' : ''}`} onClick={() =>handleActivePageClick('uTube Premium')} data-testid='uTube-Premium-link'>
                <img src={gameIcon} alt=''/><p>UTube Premium</p>
            </div>
            <div className={`side-link ${activePage === 'gaming' ? 'active' : ''}`} onClick={() =>handleActivePageClick('gaming')} data-testid='gaming-link'>
            <img src={gameIcon} alt=''/><p>Gaming</p>
            </div>
            <div className={`side-link ${activePage === 'live' ? 'active' : ''}`} onClick={() =>handleActivePageClick('live')} data-testid='live-link'>
            <img src={gameIcon} alt=''/><p>Live</p>
            </div>
        </div>
        <hr/>
        <div className='shortcut-links'>
            <div className={`side-link ${activePage === 'settings' ? 'active' : ''}`} onClick={() =>handleActivePageClick('settings')} data-testid='settings-link'>
                <img src={gameIcon} alt=''/><p>Settings</p>
            </div>
            <div className={`side-link ${activePage === 'report history' ? 'active' : ''}`} onClick={() =>handleActivePageClick('report history')} data-testid='report-history-link'>
            <img src={gameIcon} alt=''/><p>Report History</p>
            </div>
            <div className={`side-link ${activePage === 'help' ? 'active' : ''}`} onClick={() =>handleActivePageClick('help')} data-testid='help-link'>
            <img src={gameIcon} alt=''/><p>Help</p>
            </div>
            <div className={`side-link ${activePage === 'send feedback' ? 'active' : ''}`} onClick={() =>handleActivePageClick('send feedback')} data-testid='send-feedback-link'>
            <img src={gameIcon} alt=''/><p>Send feedback</p>
            </div>
        </div>
    </div>
    )}
    {isVideoPage && sidebar && <div className="overlay" data-testid="overlay" onClick={handleVideoSidebarToggle}></div>}
            {!isVideoPage && (
                <div className={`sidebar ${sidebar ? "" : "small-sidebar"}`} data-testid="sidebar">
                    <div className='shortcut-links'>
                    <div className={`side-link ${activePage === 'home' ? 'active' : ''}`} onClick={() =>handleActivePageClick('home')} data-testid='home-link'>
                <img src={home} alt='' /><p>Home</p>
            </div>
            <div className={`side-link ${activePage === 'trending' ? 'active' : ''}`} onClick={() =>handleActivePageClick('trending')} data-testid='trending-link'>
                <img src={gameIcon} alt=''/><p>Trending</p>
            </div>
            <div className={`side-link ${activePage === 'subscriptions' ? 'active' : ''}`} onClick={() =>handleActivePageClick('subscriptions')} data-testid='subscriptions-link'>
                <img src={automobiles} alt=''/><p>Subscriptions</p>
            </div>
            <hr/>
            <div className='shortcut-links'>
            <h3>You</h3>
            <div className={`side-link ${activePage === 'history' ? 'active' : ''}`} onClick={() =>handleActivePageClick('history')} data-testid='history-link'>
                <img src={tech} alt=''/><p>History</p>
            </div>
            <div className={`side-link ${activePage === 'liked videos' ? 'active' : ''}`} onClick={() =>handleActivePageClick('liked videos')} data-testid='liked-videos-link'>
                <img src={music} alt=''/><p>Liked videos</p>
            </div>
            </div>
            <hr/>
        </div> 
        <div className='subscribed-list'>
            <h3>Subscribed</h3>
            <div className={`side-link ${activePage === 'MrBeast' ? 'active' : ''}`} onClick={() =>handleActivePageClick('MrBeast')} data-testid='MrBeast-link'>
                <img src={jack} alt=''/><p>MrBeast</p>
            </div>
            <div className={`side-link ${activePage === '5-min craft' ? 'active' : ''}`} onClick={() =>handleActivePageClick('5-min craft')} data-testid='5-min-craft-link'>
                <img src={tom} alt=''/><p>5-min craft</p>
            </div>
        </div>
        <hr/>
        <div className='shortcut-links'>
            <h3>Explore</h3>
            <div className={`side-link ${activePage === 'uTube Premium' ? 'active' : ''}`} onClick={() =>handleActivePageClick('uTube Premium')} data-testid='uTube-Premium-link'>
                <img src={gameIcon} alt=''/><p>UTube Premium</p>
            </div>
            <div className={`side-link ${activePage === 'gaming' ? 'active' : ''}`} onClick={() =>handleActivePageClick('gaming')} data-testid='gaming-link'>
            <img src={gameIcon} alt=''/><p>Gaming</p>
            </div>
            <div className={`side-link ${activePage === 'live' ? 'active' : ''}`} onClick={() =>handleActivePageClick('live')} data-testid='live-link'>
            <img src={gameIcon} alt=''/><p>Live</p>
            </div>
        </div>
        <hr/>
        <div className='shortcut-links'>
            <div className={`side-link ${activePage === 'settings' ? 'active' : ''}`} onClick={() =>handleActivePageClick('settings')} data-testid='settings-link'>
                <img src={gameIcon} alt=''/><p>Settings</p>
            </div>
            <div className={`side-link ${activePage === 'report history' ? 'active' : ''}`} onClick={() =>handleActivePageClick('report history')} data-testid='report-history-link'>
            <img src={gameIcon} alt=''/><p>Report History</p>
            </div>
            <div className={`side-link ${activePage === 'help' ? 'active' : ''}`} onClick={() =>handleActivePageClick('help')} data-testid='help-link'>
            <img src={gameIcon} alt=''/><p>Help</p>
            </div>
            <div className={`side-link ${activePage === 'send feedback' ? 'active' : ''}`} onClick={() =>handleActivePageClick('send feedback')} data-testid='send-feedback-link'>
            <img src={gameIcon} alt=''/><p>Send feedback</p>
            </div>
        </div>
    </div>
            )}
        </>
  )
}

export default Sidebar