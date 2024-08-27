import React, { useEffect, useState } from "react";
import "./UpdateReply.css";
import { useNavigate } from "react-router-dom";
import userProfile from "../../assets/user_profile.jpg";
import { useAuth } from "../../util/AuthContext";
import { fetchUserDetails } from "../User/UserProfile/UserDetailsApi";
import { updateReplyApi } from "./Api/UpdateReplyApi";

const UpdateReply = ({
  replyId,
  reply,
  channelName,
  onUpdateReply,
  cancelEdit,
}) => {
  const [editReply, setEditReply] = useState(reply.text || "");
  const [focused, setFocused] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
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

  const handleReplyChange = (e) => {
    console.log("changes done");
    setEditReply(e.target.value);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    // if (!isAuthenticated) {
    //   navigate("/signin");
    //   return;
    // }

    if (!userDetails) {
      console.error("User details not available");
      return;
    }

    try {
      console.log({ text: editReply });
      console.log(replyId);
      const response = await updateReplyApi({ text: editReply }, replyId);
      console.log(response);
      if ((response.success || response.sucess) && response.data) {
        const updatedReply = {
          ...response.data,
          channelName: reply.channelName,
        };
        onUpdateReply(updatedReply);
        setFocused(false);
      } else {
        console.error("API response is not in the expected format:", response);
      }
    } catch (error) {
      console.error("Failed to update reply:", error);
      navigate("/error");
    }
  };

  const handleFocus = (e) => {
    if (!isAuthenticated) {
      navigate("/signin");
    } else {
      setFocused(true);
    }
  };

  const handleCancel = () => {
    cancelEdit();
  };

  return (
    <div className="update-reply-container">
      {/* <img src={userProfile} alt="" /> */}
      <input
        className={`update-reply-input ${focused ? "visible" : ""}`}
        type="text"
        autoFocus
        placeholder={editReply}
        value={editReply}
        onChange={handleReplyChange}
        onFocus={handleFocus}
        onBlur={() => !editReply && setFocused(false)}
      />
      <div className={`update-reply-buttons ${focused ? "visible" : ""}`}>
        <button data-testid="reply-edit-cancel-button" onClick={handleCancel}>
          Cancel
        </button>
        <button onClick={handleReplySubmit} data-testid="save-reply">
          Save
        </button>
      </div>
    </div>
  );
};

export default UpdateReply;
