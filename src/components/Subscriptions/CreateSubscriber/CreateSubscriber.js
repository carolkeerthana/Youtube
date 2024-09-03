import React, { useState } from "react";
import "./CreateSubscriber.css";
import SignInPopup from "../../Feelings/SignInPopup ";
import { useAuth } from "../../../util/AuthContext";
import { apiRequest } from "../../../util/Api";

const CreateSubscriber = ({ channelId, isSubscribed, setIsSubscribed }) => {
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState("");
  const [showSignIn, setShowSignIn] = useState(false);
  const [action, setAction] = useState(null);

  const handleSubscribeToggle = async () => {
    if (!isAuthenticated) {
      setShowSignIn(true);
      setAction("subscribe");
      return;
    }
    try {
      const response = await apiRequest({
        endpoint: "/subscriptions",
        method: "POST",
        body: channelId,
        auth: true,
      });
      console.log("API response:", response);
      if (response.success) {
        setIsSubscribed(!isSubscribed);
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error("Error processing subscription", error);
      setError("Error processing subscription");
    }
  };

  console.log(isSubscribed);
  return (
    <div className="subscribe-button">
      {showSignIn && (
        <div className="feelings-overlay" onClick={() => setShowSignIn(false)}>
          <SignInPopup action={action} />
        </div>
      )}
      <button
        onClick={handleSubscribeToggle}
        className={`button ${isSubscribed ? "active" : ""}`}
      >
        {isSubscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default CreateSubscriber;
