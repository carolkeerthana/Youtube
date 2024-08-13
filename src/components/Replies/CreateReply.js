import React, { forwardRef, useEffect, useRef, useState } from "react";
import "./CreateReply.css";
import userProfile from "../../assets/user_profile.jpg";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons/faEllipsisVertical";
import { useAuth } from "../../util/AuthContext";
import { useNavigate } from "react-router-dom";
import { createReply } from "./Api/CreateReplyApi";
import { fetchUserDetails } from "../User/UserProfile/UserDetailsApi";

const CreateReply = forwardRef(({ commentId, onReplyAdded, onCancel }, ref) => {
  const [newReply, setNewReply] = useState("");
  const { isAuthenticated } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [focused, setFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await fetchUserDetails();
        setUserDetails(user);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleReplyChange = (e) => {
    setNewReply(e.target.value);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }

    if (!userDetails) {
      console.error("User details not available");
      return;
    }

    const replyData = {
      commentId: commentId,
      text: newReply,
    };
    console.log(replyData);

    try {
      const response = await createReply(replyData);
      if ((response.success || response.sucess) && response.data) {
        const replyWithChannel = {
          ...response.data,
          channelName: userDetails.channelName,
        };
        onReplyAdded(replyWithChannel);
        setNewReply("");
        setFocused(false);
      } else {
        console.error("API response is not in the expected format:", response);
      }
    } catch {
      navigate("/error");
    }
  };

  const handleFocus = () => {
    if (!isAuthenticated) {
      navigate("/signin");
    } else {
      setFocused(true);
    }
  };

  const handleBlur = () => {
    if (!newReply) {
      setFocused(false);
      onCancel(); // Trigger onCancel if the input is empty and loses focus
    }
  };

  return (
    <div className={`reply ${focused ? "focused" : ""}`}>
      <img
        src={userProfile}
        alt=""
        className={`reply-img ${focused ? "visible" : "hidden"}`}
        onClick={() => {
          ref.current.focus();
        }}
      />
      <div className="reply-detail">
        <div className="reply-field">
          <input
            className={`input-field ${focused ? "visible" : ""}`}
            // autoFocus
            ref={ref}
            type="text"
            placeholder="Add a reply..."
            value={newReply}
            onChange={handleReplyChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <div
            className={`reply-buttons ${focused ? "visible" : ""}`}
            data-testid="reply-buttons"
          >
            <button
              data-testid="reply-cancel-button"
              onClick={() => {
                setNewReply("");
                setFocused(false);
                onCancel();
              }}
            >
              Cancel
            </button>
            <button onClick={handleReplySubmit}>Reply</button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CreateReply;
