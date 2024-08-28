import React from "react";
import { useLocation } from "react-router-dom";
import "./SearchResults.css";
import moment from "moment";

const SearchResults = () => {
  const location = useLocation();
  const { results } = location.state || {}; //from navbar
  console.log("loc", location.state);
  console.log("search:", results);

  return (
    <div className="search-results">
      {results && results.length > 0 ? (
        results.map((result) => (
          <div key={result.id} className="search-result-item flex-div">
            <img
              src={`https://apps.rubaktechie.me/uploads/thumbnails/${result.thumbnailUrl}`}
              alt={result.title || "No title"}
            />
            <div className="result-details">
              <h3>{result.title || "No title"}</h3>
              <p className="channel-name">
                {result.userId?.channelName || "No channel name"}
              </p>
              <p className="views-time">
                {result.views} views &bull; {moment(result.createdAt).fromNow()}
              </p>
              <p className="description">
                {result.description || "No description"}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="not-found">No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
