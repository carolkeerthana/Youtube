import React, { useEffect, useState } from "react";
import "./Feelings.css";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import { updateFeelings } from "./FeelingsApi";
import { useAuth } from "../../util/AuthContext";
import SignInPopup from "./SignInPopup ";
import { apiRequest } from "../../util/Api";

const Feelings = ({
  videoId,
  initialLikes,
  initialDislikes,
  initialUserFeeling,
}) => {
  const { isAuthenticated } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userFeeling, setUserFeeling] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [action, setAction] = useState(null);

  useEffect(() => {
    setUserFeeling(initialUserFeeling); // initial user feeling
  }, [initialUserFeeling]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      setAction("like");
      setShowSignIn(true);
      return;
    }

    if (userFeeling !== "like") {
      try {
        const response = await apiRequest({
          endpoint: "/feelings/",
          method: "POST",
          body: {
            videoId,
            type: "like",
          },
          auth: true,
        });
        if (response && response.success) {
          setLikes(likes + 1);
          if (userFeeling === "dislike") setDislikes(dislikes - 1);
          setUserFeeling("like");
        } else {
          console.error("Failed to update feelings:", response);
        }
      } catch (error) {
        console.error("Error updating feelings:", error);
      }
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      setAction("dislike");
      setShowSignIn(true);
      return;
    }

    if (userFeeling !== "dislike") {
      try {
        const response = await apiRequest({
          endpoint: "/feelings/",
          method: "POST",
          body: {
            videoId,
            type: "dislike",
          },
          auth: true,
        });
        if (response.success) {
          setDislikes(dislikes + 1);
          if (userFeeling === "like") setLikes(likes - 1);
          setUserFeeling("dislike");
        } else {
          console.error("Failed to update feelings:", response);
        }
      } catch (error) {
        console.error("Error updating feelings:", error);
      }
    }
  };

  return (
    <div className="feeling-icons">
      {showSignIn && (
        <div
          className="feelings-overlay"
          data-testid="feelings-overlay"
          onClick={() => setShowSignIn(false)}
        >
          <SignInPopup action={action} />
        </div>
      )}
      <span
        onClick={handleLike}
        className={`icons ${userFeeling === "like" ? "active" : ""}`}
      >
        <img src={like} alt="like" /> {likes}
      </span>
      <span
        onClick={handleDislike}
        className={`icons ${userFeeling === "dislike" ? "active" : ""}`}
      >
        <img src={dislike} alt="dislike" />
        {dislikes}
      </span>
    </div>
  );
};

export default Feelings;
