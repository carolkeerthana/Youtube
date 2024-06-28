import React, { useEffect, useState } from 'react'
import './Navbar.css';
import menuIcon from '../../assets/menu.png';
import logo from '../../assets/logo.png';
import searchIcon from '../../assets/search.png';
import uploadIcon from '../../assets/upload.png';
import notificationIcon from '../../assets/notification.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from '../../util/AuthContext';
import UserProfile from '../User/UserProfile/UserProfile';
import { getRandomColor } from '../../util/Color';
import { searchText } from '../Search/SearchApi';
import { CreateHistory } from '../History/HistoryApi/CreateHistoryApi';

const Navbar = ({setSidebar}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {isAuthenticated, user} = useAuth();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userInitialColor, setUserInitialColor] = useState(getRandomColor());
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
 
  const isSignInOrSignUp = location.pathname === '/signin' || location.pathname === '/signup';

  const toggleSidebar = () =>{
    setSidebar(prev=>prev===false?true:false)
  }

  useEffect(() => {
    setShowUserProfile(false); // Close user profile on navigation change

    // search history is created

    // Fetch search history from API
    // const createSearchHistory = async () => {
    //   try {
    //     const historyData = {
    //       searchText : searchInput,
    //       type: 'watch', 
    //     }
    //     const historyResponse = await CreateHistory(historyData);
    //     console.log('History response:', historyResponse);
    //         if (!(historyResponse.success || historyResponse.sucess)) {
    //           console.error('Failed to create history:', historyResponse);
    //       } else {
    //         console.error('API response is not in the expected format:', historyResponse);
    //       }
    //     } catch (error) {
    //       console.error('Error fetching data:', error);
    //       navigate('/error');
    //     }
    // };
    // createSearchHistory();
  }, [location]);

  const handleSearch = async(e) => {
    e.preventDefault();
    try {
        const results = await searchText({text : searchInput});
        if(results && results.data){
          setSearchResults(results.data);
          navigate('/search-results', {state: {results: results.data}});
          console.log(results);
          const historyData = {
          searchText : searchInput,
          type: 'search', 
        }
        const historyResponse = await CreateHistory(historyData);
        console.log(historyResponse)
          setSearchInput('');
        }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }

  return (
    <nav className='flex-div'>
      <div className='nav-left flex-div'>
        <img className='menu-icon' onClick={toggleSidebar} src={menuIcon} alt='menu' data-testid='menu-icon'/>
        <Link to='/'><img className='logo' src={logo} alt='logo' data-testid='youtube-logo'/></Link>
      </div>

      <div className='nav-middle flex-div'>
        <form className='search-box flex-div' onSubmit={handleSearch}>
          <input 
          type='text' 
          placeholder='Search'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type='submit'>
            <img className='search-icon' src={searchIcon} alt='search' data-testid='search-icon'/>
          </button>


          
          </form>
      </div>

      <div className={`nav-right flex-div ${isAuthenticated && user ? 'logged-in' : ''}`}>
        <img src={uploadIcon} alt='upload' data-testid='upload-icon'/>
        <img src={notificationIcon} alt='notify' data-testid='notify-icon'/>
        {isAuthenticated && user ? (
          <>

          <div className='user-icon flex-div'>
          <div className='profile-icon' onClick={() => setShowUserProfile(!showUserProfile)} data-testid="profile-icon">
            <div className="user-initial" style={{ backgroundColor: userInitialColor }}>
              {user.channelName.charAt(0).toUpperCase()}
            </div>  
          </div>
          {showUserProfile && <UserProfile userInitialColor={userInitialColor}/>}
        </div>
        </>
        ) : (

        !isSignInOrSignUp && (
        <Link to="/signin" className='signin-container'>
        <div>
          <FontAwesomeIcon className='signin-icon' icon={faUserCircle} style={{color: "#2d82d2",}}
          data-testid="signin-icon"/>
          <span className='signin-text'>Sign in</span>
        </div>
        </Link>
        )
        )}

      </div>

    </nav>
  )
}

export default Navbar


