import React from 'react'
import './PlayVideo.css'
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import userProfile from '../../assets/user_profile.jpg'

const PlayVideo = () => {
  return (
    <div className='play-video'>
      <video src={video1} controls autoPlay muted></video>
      <h3>Nature</h3>
      <div className='play-video-info'>
        <p>1525 Views &bull; 2 days ago</p>
      <div>
        <span><img src={like} alt=''/> 125</span>
        <span><img src={dislike} alt=''/> 2</span>
        <span><img src={share} alt=''/> Share</span>
        <span><img src={save} alt=''/> Save</span>
      </div>
    </div>
    <hr />
    <div className='publisher'>
        <img src={jack} alt=''/>
        <div>
            <p>The Earth</p>
            <span>2M Subscribers</span>
        </div>
        <button>Subscribe</button>
    </div>
    <div className='vid-description'>
        <p>Channel which makes you to love the nature</p>
        <p>Subscribe The Earth to watch more videos of life of earth</p>
        <hr/>
        <h4>130  Comments</h4>
        <div className='comment'>
            <img src={userProfile} alt=''/>
            <div>
                <h3>John <span>1 day ago</span></h3>
                <p>These Planets shows are so breathtaking and calming. The narrator does a great job!</p>
                <div className='comment-action'>
                    <img src={like} alt=''/>
                    <span>24</span>
                    <img src={dislike} alt=''/>
                </div>
            </div>
        </div>
        <div className='comment'>
            <img src={userProfile} alt=''/>
            <div>
                <h3>John <span>1 day ago</span></h3>
                <p>These Planets shows are so breathtaking and calming. The narrator does a great job!</p>
                <div className='comment-action'>
                    <img src={like} alt=''/>
                    <span>24</span>
                    <img src={dislike} alt=''/>
                </div>
            </div>
        </div>
        <div className='comment'>
            <img src={userProfile} alt=''/>
            <div>
                <h3>John <span>1 day ago</span></h3>
                <p>These Planets shows are so breathtaking and calming. The narrator does a great job!</p>
                <div className='comment-action'>
                    <img src={like} alt=''/>
                    <span>24</span>
                    <img src={dislike} alt=''/>
                </div>
            </div>
        </div>
    </div>
    </div>
  )
}

export default PlayVideo
