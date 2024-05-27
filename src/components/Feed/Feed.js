import React from 'react'
import './Feed.css'
import thumbnail1 from '../../assets/thumbnail1.png'
import thumbnail2 from '../../assets/thumbnail2.png'
import thumbnail3 from '../../assets/thumbnail3.png'

const Feed = () => {
  return (
    <div className='feed'>
        <div className='card'>
            <img src={thumbnail1} alt=''/>
            <h2>Nature</h2>
            <h3>Channel</h3>
            <p>15l views &bull; 2 days ago</p>
        </div>
        <div className='card'>
            <img src={thumbnail2} alt=''/>
            <h2>Nature</h2>
            <h3>Channel</h3>
            <p>15l views &bull; 2 days ago</p>
        </div>
        <div className='card'>
            <img src={thumbnail3} alt=''/>
            <h2>Nature</h2>
            <h3>Channel</h3>
            <p>15l views &bull; 2 days ago</p>
        </div>
    </div>
  )
}

export default Feed
