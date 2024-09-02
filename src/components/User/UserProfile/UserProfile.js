import "./UserProfile.css";
import { useAuth } from "../../../util/AuthContext";
import { FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";
import { apiRequest } from "../../../util/Api";

const UserProfile = ({ userInitialColor }) => {
  const { user, logout } = useAuth();
  console.log("user:", user);

  const handleLogout = async () => {
    try {
      const response = await apiRequest({
        endpoint: "/auth/logout",
        method: "POST",
      });

      if (response.success) {
        logout(); // Call the logout function from context to handle local state and storage
      } else {
        console.error("Logout failed:", response.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="user-profile">
      <div className="user-info">
        {user && user.photoUrl === "no-photo.jpg" ? (
          <div
            className="user-initial"
            style={{ backgroundColor: userInitialColor }}
          >
            {user.channelName.charAt(0)}
          </div>
        ) : (
          user && (
            <img
              src={user.photoUrl}
              alt={user.channelName}
              className="user-photo"
            />
          )
        )}
        <div>
          <p className="user-name" data-testid="user-channel-name">
            {user ? user.channelName : "Guest"}
          </p>
          <p className="user-email">{user ? user.email : ""}</p>
        </div>
      </div>
      <ul className="user-options">
        <li>
          <FaUser className="user-option-icon" /> Your Channel
        </li>
        <li>
          <FaCog className="user-option-icon" />
          Studio
        </li>
        <li onClick={handleLogout}>
          <FaSignOutAlt className="user-option-icon" />
          Sign Out
        </li>
      </ul>
    </div>
  );
};

export default UserProfile;
