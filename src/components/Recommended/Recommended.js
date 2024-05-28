import React from 'react'
import './Recommended.css'
import thumbnail1 from '../../assets/thumbnail5.png'
import thumbnail2 from '../../assets/thumbnail6.png'
import thumbnail3 from '../../assets/thumbnail7.png'
import thumbnail4 from '../../assets/thumbnail8.png'

const Recommended = () => {
  return (
    <div className='recommended'>
        <div className='side-video-list'>
            <img src={thumbnail1} alt=''/>
            <div className='vid-info'>
                <h4>Best channel to know about the life on earth</h4>
                <p>Life on Earth</p>
                <p>212k Views</p>
            </div>
        </div>
        <div className='side-video-list'>
            <img src={thumbnail2} alt=''/>
            <div className='vid-info'>
                <h4>Best channel to know about the life on earth</h4>
                <p>Life on Earth</p>
                <p>212k Views</p>
            </div>
        </div> 
        <div className='side-video-list'>
            <img src={thumbnail3} alt=''/>
            <div className='vid-info'>
                <h4>Best channel to know about the life on earth</h4>
                <p>Life on Earth</p>
                <p>212k Views</p>
            </div>
        </div> 
        <div className='side-video-list'>
            <img src={thumbnail4} alt=''/>
            <div className='vid-info'>
                <h4>Best channel to know about the life on earth</h4>
                <p>Life on Earth</p>
                <p>212k Views</p>
            </div>
        </div>  
    </div>
  )
}

export default Recommended
