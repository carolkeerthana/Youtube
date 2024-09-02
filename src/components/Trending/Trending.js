import React, { useEffect, useState } from "react";
import "./Trending.css";
import moment from "moment";
import { Link } from "react-router-dom";
import { apiRequest } from "../../util/Api";

const Trending = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");

  const fetchTrendingVideos = async () => {
    try {
      const response = await apiRequest({
        endpoint: "/videos/public",
        method: "GET",
      });
      console.log("API response:", response);
      if (response.success && Array.isArray(response.data)) {
        const sortedVideos = response.data.sort((a, b) => b.views - a.views);
        setVideos(sortedVideos);
      } else {
        setError(response.error);
        setVideos([]);
      }
    } catch (error) {
      setError("Error fetching data");
      setVideos([]);
    }
  };
  useEffect(() => {
    fetchTrendingVideos();
  }, []);

  return (
    <div className="trending-page">
      {error ? (
        <p>{error}</p>
      ) : videos && videos.length > 0 ? (
        videos.map(
          (video) =>
            video && (
              <Link
                to={`/watch/${video._id}`}
                className="trending-result-item flex-div"
                key={video.id}
              >
                <div key={video.id} className="trending-result-item flex-div">
                  <img
                    src={`https://apps.rubaktechie.me/uploads/thumbnails/${video.thumbnailUrl}`}
                    alt={video.title}
                  />
                  <div className="result-details">
                    <span className="trending-video-name">{video.title}</span>
                    <p className="channel-name">{video.userId.channelName}</p>
                    <p className="views-time">
                      {video.views} views &bull;{" "}
                      {moment(video.createdAt).fromNow()}
                    </p>
                    <p className="description">{video.description}</p>
                  </div>
                </div>
              </Link>
            )
        )
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default Trending;
