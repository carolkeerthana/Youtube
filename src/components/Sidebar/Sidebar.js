import React from 'react'
import './Sidebar.css'
import home from '../../assets/home.png'
import gameIcon from '../../assets/game_icon.png'
import automobiles from '../../assets/automobiles.png'
import sports from '../../assets/sports.png'
import entertainment from '../../assets/entertainment.png'
import tech from '../../assets/tech.png'
import music from '../../assets/music.png'
import blogs from '../../assets/blogs.png'
import news from '../../assets/music.png'
import jack from '../../assets/jack.png'
import tom from '../../assets/tom.png'

const Sidebar = ({sidebar, category, setCategory}) => { 
  return (
    <div className={`sidebar ${sidebar ? "" : "small-sidebar"}`} data-testid="sidebar">
        <div className='shortcut-links'>
            <div className='side-link' onClick={() => setCategory(0)}>
                <img src={home} alt='' /><p>Home</p>
            </div>
            <div className='side-link' onClick={() => setCategory(2)}>
                <img src={gameIcon} alt=''/><p>Trending</p>
            </div>
            <div className='side-link' onClick={() => setCategory(3)}>
                <img src={automobiles} alt=''/><p>Subscriptions</p>
            </div>
            <hr/>
            <div className='shortcut-links' >
            <h3>You</h3>
            <div className='side-link' onClick={() => setCategory(4)}>
                <img src={tech} alt=''/><p>History</p>
            </div>
            <div className='side-link' onClick={() => setCategory(5)}>
                <img src={music} alt=''/><p>Liked videos</p>
            </div>
            </div>
            <hr/>
        </div> 
        <div className='subscribed-list'>
            <h3>Subscribed</h3>
            <div className='side-link' onClick={() => setCategory(6)}>
                <img src={jack} alt=''/><p>MrBeast</p>
            </div>
            <div className='side-link' onClick={() => setCategory(7)}>
                <img src={tom} alt=''/><p>5-min craft</p>
            </div>
        </div>
        <hr/>
        <div className='shortcut-links'>
            <h3>Explore</h3>
            <div className='side-link' onClick={() => setCategory(8)}>
                <img src={gameIcon} alt=''/><p>UTube Premium</p>
            </div>
            <div className='side-link' onClick={() => setCategory(9)}>
            <img src={gameIcon} alt=''/><p>Gaming</p>
            </div>
            <div className='side-link' onClick={() => setCategory(10)}>
            <img src={gameIcon} alt=''/><p>Live</p>
            </div>
        </div>
        <hr/>
        <div className='shortcut-links'>
            <div className='side-link' onClick={() => setCategory(11)}>
                <img src={gameIcon} alt=''/><p>Setting</p>
            </div>
            <div className='side-link' onClick={() => setCategory(12)}>
            <img src={gameIcon} alt=''/><p>Report History</p>
            </div>
            <div className='side-link' onClick={() => setCategory(13)}>
            <img src={gameIcon} alt=''/><p>Help</p>
            </div>
            <div className='side-link' onClick={() => setCategory(14)}>
            <img src={gameIcon} alt=''/><p>Send feedback</p>
            </div>
        </div>
    </div>
  )
}

export default Sidebar