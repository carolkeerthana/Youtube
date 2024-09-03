import "./CreateComments.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userProfile from "../../assets/user_profile.jpg";
import { useAuth } from "../../util/AuthContext";
import { createCommentsApi } from "./Apis/CreateCommentsApi";
import { fetchUserDetails } from "../User/UserProfile/UserDetailsApi";
import { apiRequest } from "../../util/Api";

const CreateComments = ({ videoId, onCommentAdded }) => {
  console.log("CreateComments component rendered");
  console.log("Initial videoId:", videoId);
  console.log("Props:", { videoId, onCommentAdded });

  const [focused, setFocused] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.log("State updated:", { videoId, newComment });
  }, [videoId, newComment]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await apiRequest({
          endpoint: "/auth/me",
          method: "POST",
          auth: true,
        });
        console.log("Fetched user details:", user);
        setUserDetails(user.data);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    } else {
      console.log("User is not authenticated, not fetching user details.");
    }
  }, [isAuthenticated]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // if (!isAuthenticated) {
    //   navigate("/signin");
    //   return;
    // } else {
    //   console.log("User is authenticated");
    //   setFocused(true);
    // }

    if (!userDetails) {
      console.error("User details not available, cannot submit comment");
      return;
    }

    const commentsData = {
      videoId: videoId,
      text: newComment,
    };

    try {
      const response = await apiRequest({
        endpoint: `/comments/`,
        method: "POST",
        body: commentsData,
        auth: true,
      });
      console.log("create comments", response);
      if ((response.success || response.sucess) && response.data) {
        const commentWithChannel = {
          ...response.data,
          channelName: userDetails.channelName,
        };
        console.log("channelName: ", userDetails.channelName);
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
            data-testid="comment-cancel-button"
            onClick={() => {
              setNewComment("");
              setFocused(false);
              console.log("Comment cancelled, input cleared");
            }}
          >
            Cancel
          </button>
          <button
            data-testid="comment-save-button"
            onClick={(e) => {
              handleCommentSubmit(e);
            }}
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateComments;
