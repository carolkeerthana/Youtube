import React, { useEffect, useState } from "react";
import "./Feed.css";
import { Link } from "react-router-dom";
import { apiRequest } from "../../util/Api";
import moment from "moment";

const Feed = () => {
  const [data, setData] = useState([]);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest({
          endpoint: "/videos/public",
          method: "GET",
        });
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
              <div className="feed-description">
                <span className="feed-title">{item.title}</span>
                <span className="feed-channel-name">
                  {item.userId.channelName}
                </span>
                <p>
                  {item.views} views &bull; {moment(item.createdAt).fromNow()}
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
