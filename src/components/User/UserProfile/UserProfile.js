import './UserProfile.css';
// import {useNavigate } from "react-router-dom";
import { useAuth } from '../../../util/AuthContext';
import { getRandomColor } from '../../../util/Color';
import { FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa';

const UserProfile = ({userInitialColor }) => {
    const { user, logout } = useAuth();
    // const [user, setUser] = useState(null);
    // const navigate = useNavigate();

    return (
        <div className="user-profile">
            <div className="user-info">
                {user.photoUrl === 'no-photo.jpg' ? (
                    <div className="user-initial" 
                    style={{ backgroundColor: `rgba(${parseInt(userInitialColor.slice(1, 3), 16)}, ${parseInt(userInitialColor.slice(3, 5), 16)}, ${parseInt(userInitialColor.slice(5, 7), 16)}, 0.3)` }}>
                        {user.channelName.charAt(0)}
                    </div>
                ) : (
                    <img src={user.photoUrl} alt={user.channelName} className="user-photo" />
                )}
                <div>
                    <p className="user-name">{user.channelName}</p>
                    <p className="user-email">{user.email}</p>
                </div>
            </div>
            <ul className="user-options">
                <li><FaUser className="user-option-icon" /> Your Channel</li>
                <li><FaCog className="user-option-icon" />Studio</li>
                <li onClick={logout}><FaSignOutAlt className="user-option-icon" />Sign Out</li>
            </ul>
        </div>
    );
};

export default UserProfile;