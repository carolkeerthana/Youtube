import "./CreateComments.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userProfile from "../../assets/user_profile.jpg";
import { useAuth } from "../../util/AuthContext";
import { createCommentsApi } from "./Apis/CreateCommentsApi";
import { fetchUserDetails } from "../User/UserProfile/UserDetailsApi";

const CreateComments = ({ videoId, onCommentAdded }) => {
  const [focused, setFocused] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/signin");
      return;
    } else {
      setFocused(true);
    }

    if (!userDetails) {
      console.error("User details not available");
      return;
    }

    const commentsData = {
      videoId: videoId,
      text: newComment,
    };
    console.log(commentsData);

    try {
      const response = await createCommentsApi(commentsData);
      console.log("create comments", response);
      if ((response.success || response.sucess) && response.data) {
        const commentWithChannel = {
          ...response.data,
          channelName: userDetails ? userDetails.channelName : "Unknown",
        };
        onCommentAdded(commentWithChannel);
        setNewComment("");
        setFocused(false);
      } else {
        console.error("API response is not in the expected format:", response);
      }
    } catch (error) {
      console.error("Error in creating comment:", error);
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

  return (
    <div className="new-comment">
      <img src={userProfile} alt="" />
      <div className="input-field-comment">
        <input
          className={`input-field ${focused ? "visible" : ""}`}
          type="text"
          placeholder="Add a public comment..."
          value={newComment}
          onChange={handleCommentChange}
          onFocus={handleFocus}
          onBlur={() => !newComment && setFocused(false)}
        />
        <div className={`comment-buttons ${focused ? "visible" : ""}`}>
          <button
            onClick={() => {
              setNewComment("");
              setFocused(false);
            }}
          >
            Cancel
          </button>
          <button data-testid="comment-save-button" onClick={handleCommentSubmit}>Comment</button>
        </div>
      </div>
    </div>
  );
};

export default CreateComments;
