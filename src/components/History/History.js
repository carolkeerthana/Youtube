import './History.css'
import React, { useState } from 'react'
import WatchHistory from './WatchHistory';
import SearchHistory from './SearchHistory';

const History = () => {
    const [historyType, setHistoryType] = useState('watch');

    const handleHistoryTypeChange = (event) => {
        setHistoryType(event.target.value);
    }

  return (
      <div className='history'>
        <div className='left-side-history'>
            {historyType === 'watch' ? <WatchHistory/> : <SearchHistory/>}
        </div>
        <div className='right-side-history'>
            <h2>History Type</h2>
            <div>
            <input type='radio' id='watch' value='watch' checked={historyType === 'watch'}
            onChange={handleHistoryTypeChange}/>
            <label htmlFor="watch"> Watch History</label><br/>
            </div>
            <div>
            <input type='radio' id='search' value='search' checked={historyType === 'search'}
            onChange={handleHistoryTypeChange}/>
            <label htmlFor="search"> Search History</label><br/>
            </div>
            <span>CLEAR ALL WATCH HISTORY</span>
        </div>
    </div>
  )
}

export default History
