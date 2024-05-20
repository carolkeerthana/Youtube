import React from 'react'
import './Navbar.css';
import menuIcon from '../../assets/menu.png';
import logo from '../../assets/logo.png';
import searchIcon from '../../assets/search.png';
import uploadIcon from '../../assets/upload.png';
import notificationIcon from '../../assets/notification.png';
import signinIcon from '../../assets/signin.png';
import profileIcon from '../../assets/Woman-Icon.png';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Navbar = () => {
  const location = useLocation();

  const isSignInOrSignUp = location.pathname === '/signin' || location.pathname === '/signup';
  return (
    <nav className='flex-div'>
      <div className='nav-left flex-div'>
        <img className='menu-icon' src={menuIcon} alt=''/>
        <img className='logo' src={logo} alt=''/> 
      </div>

      <div className='nav-middle flex-div'>
        <div className='search-box flex-div'>
          <input type='text' placeholder='Search'></input>
          <img className='search-icon' src={searchIcon} alt=''/>
        </div>
      </div>

      <div className='nav-right flex-div'>
        <img src={uploadIcon} alt=''/>
        <img src={notificationIcon} alt=''/>
        {/* <img src={profileIcon} className='user-icon' alt=''/> */}
        <div className='user-icon flex-div'>
        {!isSignInOrSignUp && (
        <Link to="/signin" className='signin-container'>
          {/* <img src={signinIcon} alt=''/> */}
          <FontAwesomeIcon icon="fal fa-user-circle" style={{color: "#2d82d2",}} />
          <span className='signin-text'>SIGN IN</span>
        </Link>
        )}
    </div>
      </div>

    </nav>
  )
}

export default Navbar
