import React from 'react';
import { useLocation } from 'react-router-dom';
import './SearchResults.css';
import moment from 'moment';

const SearchResults = () => {
    const location = useLocation();
    const { results } = location.state || {};
    console.log(results)

    return (
        <div className="search-results">
            {results && results.length > 0 ? (
                results.map((result) => (
                  result &&
                    <div key={result.id} className="search-result-item flex-div">
                        <img src={`https://apps.rubaktechie.me/uploads/thumbnails/${result.thumbnailUrl}`} alt={result.title}/>
                        <div className="result-details">
                            <h3>{result.title}</h3>
                            <p className="channel-name">{result.userId.channelName}</p>
                            <p className="views-time">{result.views} views &bull; {moment(result.createdAt).fromNow()}</p>
                            <p className="description">{result.description}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>No results found.</p>
            )}
        </div>
    );
};

export default SearchResults;
