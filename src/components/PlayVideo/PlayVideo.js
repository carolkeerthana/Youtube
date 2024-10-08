import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Comments from "../Comments/Comments";
import Feelings from "../Feelings/Feelings";
import { checkFeeling } from "../Feelings/CheckFeelingApi";
import CreateSubscriber from "../Subscriptions/CreateSubscriber/CreateSubscriber";
import { checkSubscription } from "../Subscriptions/CheckSubscriptionApi";
import { fetchVideosById } from "./GetVideoApi";
import { CreateHistory } from "../History/HistoryApi/CreateHistoryApi";
import { apiRequest } from "../../util/Api";

const PlayVideo = ({ videoId }) => {
  const [videoData, setVideoData] = useState(null);
  const [userFeeling, setUserFeeling] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest({
          endpoint: `/videos/${videoId}`,
          method: "GET",
        });
        console.log("API response:", response);

        if ((response.success || response.sucess) && response.data) {
          localStorage.setItem("token", response.data.token);
          console.log("response.data", response.data);
          setVideoData(response.data);

          // Check subscription status
          const channelId = { channelId: response.data.userId.id };
          const subscriptionResponse = await apiRequest({
            endpoint: `/subscriptions/check`,
            method: "POST",
            body: channelId,
            auth: true,
          });
          console.log("Subscription response:", subscriptionResponse);

          if (subscriptionResponse.success) {
            localStorage.setItem("token", response.data.token);
            if (
              subscriptionResponse.data &&
              Object.keys(subscriptionResponse.data).length > 0
            ) {
              setIsSubscribed(true);
            } else {
              setIsSubscribed(false);
            }
          } else {
            console.error(
              "Failed to check subscription:",
              subscriptionResponse
            );
          }

          // Create history
          const historiesData = {
            type: "watch",
            videoId: videoId,
          };
          const historyResponse = await apiRequest({
            endpoint: "/histories",
            method: "POST",
            body: {
              type: "watch",
              videoId: videoId,
            },
            auth: true,
          });
          localStorage.setItem("token", response.data.token);
          console.log("History response:", historyResponse);
          if (!(historyResponse.success || historyResponse.sucess)) {
            console.error("Failed to create history:", historyResponse);
          }
        } else {
          console.error(
            "API response is not in the expected format:",
            response
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/error");
      }
    };

    fetchData();

    // Check user feelings
    apiRequest({
      endpoint: `/feelings/check`,
      method: "POST",
      body: { videoId: videoId },
      auth: true,
    }).then((response) => {
      console.log("User feelings:", response);
      if (response.success || response.sucess) {
        localStorage.setItem("token", response.data.token);
        setUserFeeling(response.data.feeling);
      } else {
        console.error("Failed to check feelings:", response);
      }
    });

    console.log("rendering:", videoId);
  }, [videoId, navigate]);

  if (!videoData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="play-video">
      <video controls autoPlay>
        <source
          src={`https://apps.rubaktechie.me/uploads/videos/${videoData.url}`}
          type="video/mp4"
        />
      </video>
      <span className="video-title">{videoData.title}</span>
      <div className="play-video-info">
        <p>
          {videoData.views} Views &bull; {moment(videoData.createdAt).fromNow()}
        </p>
        <div className="user-actions">
          <Feelings
            videoId={videoId}
            initialLikes={videoData.likes}
            initialDislikes={videoData.dislikes}
            initialUserFeeling={userFeeling}
          />
          <span>
            <img src={share} alt="" /> Share
          </span>
          <span>
            <img src={save} alt="" /> Save
          </span>
        </div>
      </div>
      <hr />
      {videoData.userId && (
        <div className="publisher">
          <img
            src={`https://apps.rubaktechie.me/uploads/avatars/${videoData.userId.photoUrl}`}
            alt={videoData.userId.channelName}
          />
          <div>
            <p>{videoData.userId.channelName}</p>
            <span>{videoData.userId.subscribers} subscribers</span>
          </div>
          <CreateSubscriber
            channelId={videoData.userId.id}
            isSubscribed={isSubscribed}
            setIsSubscribed={setIsSubscribed}
          />
        </div>
      )}
      <div className="vid-description">
        <p>{videoData.description}</p>
        <br />
        <p>
          Subscribe to {videoData.userId.channelName} to watch more videos like
          this
        </p>
        <hr />
        <Comments videoId={videoId} />
      </div>
    </div>
  );
};

export default PlayVideo;
