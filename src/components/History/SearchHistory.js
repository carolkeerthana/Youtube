import "./History.css";
import "./SearchHistory.css";
import React, { useEffect, useState } from "react";
import moment from "moment";
import closeIcon from "../../assets/close.png";
import { useDispatch } from "react-redux";
import { showNotification } from "../Notification/notificationSlice";
import { apiRequest } from "../../util/Api";

const SearchHistory = ({ history, setHistory }) => {
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();

  const fetchHistoryVideos = async (page) => {
    try {
      const response = await apiRequest({
        endpoint: `/histories?page=${page}&type=search`,
        method: "GET",
        auth: true,
      });
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

  const handleDeleteHistory = async (historyId) => {
    try {
      const response = await apiRequest({
        endpoint: `/histories/${historyId}`,
        method: "DELETE",
        auth: true,
      });
      if (response.success) {
        setHistory((prevHistories) =>
          prevHistories.filter((history) => history._id !== historyId)
        );
        dispatch(showNotification("History deleted successfully"));
      }
    } catch (error) {
      console.error("Error deleting history:", error);
    }
  };

  return (
    <div className="search-left-side-history">
      <h2 className="search-h2">Search History</h2>
      {error ? (
        <p>{error}</p>
      ) : history && history.length > 0 ? (
        <>
          {history.map((history) => (
            <div className="search-history" key={history._id}>
              <div className="search-text">
                <p>{history.searchText}</p>
                <button
                  className="delete-button"
                  data-testid={`search-history-delete-${history._id}`}
                  onClick={() => handleDeleteHistory(history._id)}
                >
                  <img src={closeIcon} alt="" />
                </button>
              </div>
              <div className="search-subtext">
                <p className="search">{moment(history.createdAt).fromNow()}</p>
              </div>
            </div>
          ))}
        </>
      ) : (
        <p>No search history yet.</p>
      )}
    </div>
  );
};

export default SearchHistory;
