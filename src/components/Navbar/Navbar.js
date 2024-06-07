import React, { useEffect, useState } from 'react'
import './Navbar.css';
import menuIcon from '../../assets/menu.png';
import logo from '../../assets/logo.png';
import searchIcon from '../../assets/search.png';
import uploadIcon from '../../assets/upload.png';
import notificationIcon from '../../assets/notification.png';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from '../../util/AuthContext';
import UserProfile from '../User/UserProfile/UserProfile';

const Navbar = ({setSidebar}) => {
  const location = useLocation();
  const {isAuthenticated} = useAuth();
  const [showUserProfile, setShowUserProfile] = useState(false);
 
  const isSignInOrSignUp = location.pathname === '/signin' || location.pathname === '/signup';

  const toggleSidebar = () =>{
    setSidebar(prev=>prev===false?true:false)
  }

  useEffect(() => {
    setShowUserProfile(false); // Close user profile on navigation change
  }, [location]);

  return (
    <nav className='flex-div'>
      <div className='nav-left flex-div'>
        <img className='menu-icon' onClick={toggleSidebar} src={menuIcon} alt='menu' data-testid='menu-icon'/>
        <Link to='/'><img className='logo' src={logo} alt='logo' data-testid='youtube-logo'/></Link>
      </div>

      <div className='nav-middle flex-div'>
        <div className='search-box flex-div'>
          <input type='text' placeholder='Search'></input>
          <img className='search-icon' src={searchIcon} alt='search' data-testid='search-icon'/>
        </div>
      </div>

      <div className='nav-right flex-div'>
        <img src={uploadIcon} alt='upload' data-testid='upload-icon'/>
        <img src={notificationIcon} alt='notify' data-testid='notify-icon'/>

        {isAuthenticated ? (
          <div className='user-icon flex-div'>
          <div className='profile-icon' onClick={() => setShowUserProfile(!showUserProfile)}>
            {/* You can render the user's profile image or initial letter here */}
            {/* For now, I'm using a placeholder */}
            <FontAwesomeIcon className='signin-icon' icon={faUserCircle} style={{ color: "#2d82d2" }} data-testid="signin-icon" />
          </div>
          {showUserProfile && <UserProfile />}
        </div>
        ) : (

        // {!isSignInOrSignUp && (
        <Link to="/signin" className='signin-container'>
        <div>
          <FontAwesomeIcon className='signin-icon' icon={faUserCircle} style={{color: "#2d82d2",}} 
          data-testid="signin-icon"/>
          <span className='signin-text'>Sign in</span>
        </div>
        </Link>
        // )}
        )}

      </div>

    </nav>
  )
}

export default Navbar
