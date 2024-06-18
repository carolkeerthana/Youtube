import React, { useEffect, useState } from 'react'
import './PlayVideo.css'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import Comments from '../Comments/Comments'
import Feelings from '../Feelings/Feelings'
import {checkFeeling} from '../Feelings/CheckFeelingApi'
import CreateSubscriber from '../Subscriptions/CreateSubscriber/CreateSubscriber'
import { checkSubscription } from '../Subscriptions/CheckSubscriptionApi'
import { fetchVideosById } from './GetVideoApi'

const PlayVideo = ({videoId, navbar}) => {
    const[videoData, setVideoData] = useState(null);
    const [userFeeling, setUserFeeling] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false); //initial state of subscription
    const navigate = useNavigate();
   
    useEffect(() => {
    const fetchData = async () =>{

    try {
      const response = await fetchVideosById(videoId);
      console.log('API response:', response);
      if((response.success || response.sucess) && response.data) {
        setVideoData(response.data);

      // check subscription API 
      const channelId = {
        channelId: response.data.userId.id
      };
      const subscriptionResponse = await checkSubscription(channelId);
          console.log(subscriptionResponse);
          if (subscriptionResponse.success) {
            if (subscriptionResponse.data && subscriptionResponse.data._id) {
              setIsSubscribed(true);
            } else {
              setIsSubscribed(false);
            }
          } else {
            console.error('Failed to fetch subscription status:', subscriptionResponse);
          }
        } else {
          console.error('API response is not in the expected format:', response);
        } 
      }catch (error) {
      navigate('/error');
    }
  };

    fetchData();

    // check feeling API 
    checkFeeling({videoId : videoId}).then(response => {
      console.log('User feelings:', response);
      if(response.success){
        setUserFeeling(response.data.feeling)
        console.log(response.data.feeling)
      }
  });

    console.log("rendering:" ,videoId)  
    }, [videoId, navigate]);

  if (!videoData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='play-video'>
      <video type controls autoPlay >
        <source src={`https://apps.rubaktechie.me/uploads/videos/${videoData.url}`} type="video/mp4"/>
    </video>
      <h3>{videoData.title}</h3>
      <div className='play-video-info'>
        <p>{videoData.views} Views &bull; {moment(videoData.createdAt).fromNow()}</p>
      <div className='user-actions'>
        <Feelings 
        videoId={videoId} 
        initialLikes={videoData.likes} 
        initialDislikes={videoData.dislikes}
        initialUserFeeling={userFeeling}
        />
        <span><img src={share} alt=''/> Share</span>
        <span><img src={save} alt=''/> Save</span>
      </div>
    </div>
    <hr />
    {videoData.userId && (
    <div className='publisher'>
        <img src={`https://apps.rubaktechie.me/uploads/avatars/${videoData.userId.photoUrl}`} alt={videoData.userId.channelName} avatar/>
        <div>
            <p>{videoData.userId.channelName}</p>
            <span>{videoData.userId.subscribers} subscribers</span>
        </div>
        {/* <button> */}
          <CreateSubscriber channelId={videoData.userId.id} 
          isSubscribed={isSubscribed}
          setIsSubscribed={setIsSubscribed}/>
        {/* </button> */}
    </div>
    )}
    <div className='vid-description'>
        <p>{videoData.description}</p><br/>
        <p>Subscribe to {videoData.userId.channelName} to watch more videos like this</p>
        <hr/>
        <Comments videoId={videoId}/>
    </div>
    </div>
  )
}

export default PlayVideo