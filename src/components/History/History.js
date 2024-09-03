import "./History.css";
import React, { useState } from "react";
import WatchHistory from "./WatchHistory";
import SearchHistory from "./SearchHistory";
import { useDispatch } from "react-redux";
import { showNotification } from "../Notification/notificationSlice";
import { apiRequest } from "../../util/Api";

const History = () => {
  const [historyType, setHistoryType] = useState("watch");
  const [watchHistory, setWatchHistory] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const dispatch = useDispatch();

  const handleHistoryTypeChange = (event) => {
    setHistoryType(event.target.value);
  };

  const handleClearHistories = async () => {
    try {
      const response = await apiRequest({
        endpoint: `/histories/${historyType}/all`,
        method: "DELETE",
        auth: true,
      });
      if (response.success) {
        const historyTypeInUppercase =
          historyType.charAt(0).toUpperCase() + historyType.substring(1);
        dispatch(
          showNotification(
            `${historyTypeInUppercase} Histories Deleted Successfully`
          )
        );
        if (historyType === "watch") {
          setWatchHistory([]);
        } else {
          setSearchHistory([]);
        }
      } else {
        console.error("Failed to delete histories:", response);
      }
    } catch (error) {
      console.error("Error deleting histories:", error);
    }
  };

  return (
    <div className="history">
      <div className="left-side-history">
        {historyType === "watch" ? (
          <WatchHistory history={watchHistory} setHistory={setWatchHistory} />
        ) : (
          <SearchHistory
            history={searchHistory}
            setHistory={setSearchHistory}
          />
        )}
      </div>
      <div className="right-side-history">
        <h2>History Type</h2>
        <hr />
        <div
          className={`watch-div ${historyType === "watch" ? "active" : ""}`}
          onClick={() => document.getElementById("watch").click()}
        >
          <label htmlFor="watch"> Watch History</label>
          <br />
          <input
            type="radio"
            id="watch"
            value="watch"
            checked={historyType === "watch"}
            onChange={handleHistoryTypeChange}
          />
        </div>
        <hr />
        <div
          className={`search-div ${historyType === "search" ? "active" : ""}`}
          onClick={() => document.getElementById("search").click()}
        >
          <label htmlFor="search"> Search History</label>
          <br />
          <input
            type="radio"
            id="search"
            value="search"
            checked={historyType === "search"}
            onChange={handleHistoryTypeChange}
          />
        </div>
        <span onClick={handleClearHistories}>
          CLEAR ALL {historyType.toUpperCase()} HISTORY
        </span>
      </div>
    </div>
  );
};

export default History;
