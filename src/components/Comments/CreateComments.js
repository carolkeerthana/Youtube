import "./CreateComments.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userProfile from "../../assets/user_profile.jpg";
import { useAuth } from "../../util/AuthContext";
import { createCommentsApi } from "./Apis/CreateCommentsApi";
import { fetchUserDetails } from "../User/UserProfile/UserDetailsApi";

const CreateComments = ({ videoId, onCommentAdded }) => {
  console.log("CreateComments component rendered");
  console.log("Initial videoId:", videoId);
  console.log("Props:", { videoId, onCommentAdded });

  const [focused, setFocused] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isFetchingUserDetails, setIsFetchingUserDetails] = useState(true);

  useEffect(() => {
    console.log("State updated:", { videoId, newComment });
  }, [videoId, newComment]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await fetchUserDetails();
        console.log("Fetched user details:", user);
        setUserDetails(user);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setIsFetchingUserDetails(false); // Fetching completed
      }
    };

    if (isAuthenticated) {
      console.log("User is authenticated, fetching user details...");
      fetchUserData();
    } else {
      console.log("User is not authenticated, not fetching user details.");
    }
  }, [isAuthenticated]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
    console.log("New comment text:", e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    console.log("handleCommentSubmit triggered");

    if (!isAuthenticated) {
      console.log("User is not authenticated, redirecting to /signin");
      navigate("/signin");
      return;
    } else {
      console.log("User is authenticated");
      setFocused(true);
    }

    // if (isFetchingUserDetails) {
    //   console.log("Still fetching user details, cannot submit comment");
    //   return;
    // }

    if (userDetails.success) {
      console.log("User details not available", userDetails);
      console.error("User details not available, cannot submit comment");
      return;
    }
    console.log("User details:", userDetails);

    console.log("Submitting comment with videoId:", videoId);
    const commentsData = {
      videoId: videoId,
      text: newComment,
    };
    console.log("Comment data to be submitted:", commentsData);

    try {
      console.log("Before API call");
      const response = await createCommentsApi(commentsData);
      console.log("create comments", response);
      if ((response.success || response.sucess) && response.data) {
        const commentWithChannel = {
          ...response.data,
          channelName: userDetails.channelName,
        };
        console.log("Comment submitted:", commentWithChannel);
        onCommentAdded(commentWithChannel);

        setNewComment("");
        setFocused(false);
        console.log("Simulated API response success");
      } else {
        console.error("API response is not in the expected format:", response);
      }
    } catch (error) {
      console.error("Error in creating comment:", error);
      navigate("/error");
    }
    console.log("After API call");
  };

  const handleFocus = () => {
    if (!isAuthenticated) {
      console.log("User is not authenticated, redirecting to /signin");
      navigate("/signin");
    } else {
      console.log("Input field focused");
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
              console.log("Comment button clicked");
              handleCommentSubmit(e);
            }}
            // disabled={!userDetails || !newComment.trim()}
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateComments;
