import React, { useEffect, useState } from "react";
import "./Recommended.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { apiRequest } from "../../util/Api";

const Recommended = ({ videoId }) => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await apiRequest({
        endpoint: "/videos/public",
        method: "GET",
      });
      console.log("recommended API response:", response);
      if (response.success && Array.isArray(response.data)) {
        setData(response.data);
      } else {
        console.error("API response is not in the expected format:", response);
      }
    } catch (error) {
      // console.error('Error fetching data:', error);
      navigate("/error");
    }
  };

  useEffect(() => {
    fetchData();
  }, [videoId, navigate]);

  const handleVideoClick = (id) => {
    console.log("Navigating to videoId:", id);
    navigate(`/watch/${id}`);
  };

  return (
    <div className="recommended">
      <hr />
      <p className="next">Up next</p>
      {data.map((item) => {
        return (
          <div
            key={item._id}
            className="side-video-list"
            onClick={() => handleVideoClick(item._id)}
          >
            <img
              src={`https://apps.rubaktechie.me/uploads/thumbnails/${item.thumbnailUrl}`}
              alt={`Thumbnail for ${item.title}`}
            />
            <div className="vid-info">
              <span>{item.title}</span>
              <p>{item.userId.channelName}</p>
              <p>
                {item.views} Views &bull; {moment(item.createdAt).fromNow()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Recommended;
