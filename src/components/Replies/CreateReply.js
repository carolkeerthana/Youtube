import React, { forwardRef, useEffect, useRef, useState } from "react";
import "./CreateReply.css";
import userProfile from "../../assets/user_profile.jpg";
import { useAuth } from "../../util/AuthContext";
import { useNavigate } from "react-router-dom";
import { createReplyApi } from "./Api/CreateReplyApi";
import { fetchUserDetails } from "../User/UserProfile/UserDetailsApi";
import { apiRequest } from "../../util/Api";

const CreateReply = forwardRef(({ commentId, onReplyAdded, onCancel }, ref) => {
  console.log("entered create reply");
  const [newReply, setNewReply] = useState("");
  const { isAuthenticated } = useAuth();
  const [userDetails, setUserDetails] = useState([]);
  const [focused, setFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Attempting to fetch user details...");
        const user = await apiRequest({
          endpoint: "/auth/me",
          method: "POST",
          auth: true,
        });
        console.log("Fetched reply user details:", user);
        setUserDetails(user.data);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  // const toggleDropdown = () => {
  //   setDropdownOpen(!dropdownOpen);
  // };

  const handleReplyChange = (e) => {
    setNewReply(e.target.value);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    console.log("entered submit fnc");

    // if (!isAuthenticated) {
    //   navigate("/signin");
    //   return;
    // }

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
      const response = await apiRequest({
        endpoint: `/replies/`,
        method: "POST",
        body: replyData,
        auth: true,
      });
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
    } catch (error) {
      console.error("Error in creating reply:", error);
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
            <button data-testid="reply-save-button" onClick={handleReplySubmit}>
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CreateReply;
