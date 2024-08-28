// import "./WatchHistory.css";
import { fetchHistories } from "./HistoryApi/GetHistoryApi";
import "./History.css";
import React, { useEffect, useState } from "react";
import closeIcon from "../../assets/close.png";
import { deleteHistory } from "./HistoryApi/DeleteHistoryApi";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showNotification } from "../Notification/notificationSlice";
import CustomNotification from "../Notification/CustomNotification";

const WatchHistory = ({ history, setHistory }) => {
  // const [histories, setHistories] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const [notification, setNotification] = useState("");
  const dispatch = useDispatch();

  const fetchHistoryVideos = async (page) => {
    try {
      const response = await fetchHistories(page, "watch");
      console.log("API response:", response);
      if (response.success && Array.isArray(response.data)) {
        setHistory(response.data);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      setError("Error fetching data");
      setHistory([]);
    }
  };
  useEffect(() => {
    fetchHistoryVideos(currentPage);
  }, [currentPage]);

  // const handlePageChange = (page) => {
  //     setCurrentPage(page)
  // }

  const handleDeleteHistory = async (historyId, event) => {
    event.stopPropagation();
    try {
      const response = await deleteHistory(historyId);
      if (response.success) {
        setHistory((prevHistories) =>
          prevHistories.filter((history) => history._id !== historyId)
        );
        dispatch(showNotification("History Deleted Successfully"));
      }
    } catch (error) {
      console.error("Error deleting history:", error);
    }
  };

  return (
    <div className="left-side-history">
      <h2>Watch History</h2>
      {error ? (
        <p>{error}</p>
      ) : history && history.length > 0 ? (
        <>
          {history.map((history) => (
            <div className="history-card" key={history._id}>
              <div className="history-image">
                <Link
                  to={`/watch/${history.videoId._id}`}
                  className="history-link"
                >
                  <img
                    src={`https://apps.rubaktechie.me/uploads/thumbnails/${history.videoId.thumbnailUrl}`}
                    alt={history.videoId.title}
                  />
                </Link>
              </div>
              <div className="history-details">
                <div className="title-header">
                  <p className="history-title">{history.videoId.title}</p>
                  <button
                    className="delete-button"
                    data-testid={`history-delete-${history._id}`}
                    onClick={(event) => handleDeleteHistory(history._id, event)}
                  >
                    <img src={closeIcon} alt="close-icon" />
                  </button>
                </div>
                <p className="title-p">
                  {history.userId.channelName} &nbsp; &bull; &nbsp;{" "}
                  {history.videoId.views} views
                </p>
                <p className="title-p">{history.videoId.description}</p>
              </div>
            </div>
          ))}
          {/* <Pagination
                  currentPage = {currentPage}
                  totalPages = {totalPages}
                  onPageChange={handlePageChange}/>     */}
        </>
      ) : (
        <p>No watch history yet.</p>
      )}
      {/* {notification && <div className="notification">{notification}</div>} */}
      <CustomNotification />
    </div>
  );
};

export default WatchHistory;
