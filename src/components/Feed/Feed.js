import React, { useEffect, useState } from "react";
import "./Feed.css";
import { Link, useNavigate } from "react-router-dom";
import { fetchVideos } from "./GetVideosApi";

const Feed = () => {
  const [data, setData] = useState([]);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchVideos();
        console.log("API response:", response);
        if (response.success && Array.isArray(response.data)) {
          setData(response.data);
        } else {
          console.error(
            "API response is not in the expected format:",
            response
          );
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      }
    };
    fetchData();
  }, []);

  const getDaysAgo = (dateString) => {
    const createdAt = new Date(dateString); //creates date obj from createdAt
    const now = new Date(); //creates date obj for the current date and tym
    const differenceInTime = now - createdAt; //calculated in milliseconds
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); //divided by milliseconds in a day
    return differenceInDays;
  };

  return (
    <div className="feed">
      {data.map((item) => {
        return (
          <Link to={`/watch/${item._id}`} className="card" key={item._id}>
            <img
              className="feed-thumbnail"
              src={`https://apps.rubaktechie.me/uploads/thumbnails/${item.thumbnailUrl}`}
              alt={item.title}
            />
            <div className="feed-details">
              <img
                className="feed-icon"
                src={`https://apps.rubaktechie.me/uploads/avatars/${item.userId.photoUrl}`}
                alt={item.userId.channelName}
              />
              <div>
                <h2>{item.title}</h2>
                <h3>{item.userId.channelName}</h3>
                <p>
                  {item.views} views &bull; {getDaysAgo(item.createdAt)} day ago
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Feed;
