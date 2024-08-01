import { fetchHistories } from "./HistoryApi/GetHistoryApi";
import "./History.css";
import "./SearchHistory.css";
import React, { useEffect, useState } from "react";
import moment from "moment";
import closeIcon from "../../assets/close.png";
import { deleteHistory } from "./HistoryApi/DeleteHistoryApi";

const SearchHistory = ({ history, setHistory }) => {
  // const [histories, setHistories] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState("");

  const fetchHistoryVideos = async (page) => {
    try {
      const response = await fetchHistories(page, "search");
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

  const handleDeleteHistory = async (historyId) => {
    try {
      const response = await deleteHistory(historyId);
      if (response.success) {
        setHistory((prevHistories) =>
          prevHistories.filter((history) => history._id !== historyId)
        );
        setNotification("History deleted successfully");
        setTimeout(() => setNotification(""), 3000); // Hide notification after 3 seconds
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
          {/* <Pagination
                  currentPage = {currentPage}
                  totalPages = {totalPages}
                  onPageChange={handlePageChange}/>     */}
        </>
      ) : (
        <p>No search history yet.</p>
      )}
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default SearchHistory;
