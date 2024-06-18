import React, { useEffect, useState } from 'react'
import './Subscriptions.css'
import { fetchSubscriptions } from './SubscriptionApi';
import moment from 'moment';
import { Link } from 'react-router-dom';

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [error, setError] = useState('');

    const fetchSubscriptionVideos = async() => {
        try {
            const response = await fetchSubscriptions();
            console.log('API response:', response);
            if(response.success && Array.isArray(response.data)){
                setSubscriptions(response.data);
            }else{
              setError(response.error);
              setSubscriptions([]);
            }   
          } catch (error) {
            setError('Error fetching data');
            setSubscriptions([]);
          }
    } 
    useEffect(() => {
        fetchSubscriptionVideos();         
}, [])
  return (
      <div className='subscriptions'>
        {error ? (
                <p>{error}</p>
            ) : ( 
                subscriptions && subscriptions.length > 0 ? (
                subscriptions.map((subscription) => {
                    return(
                    <Link to={`/watch/${subscription._id}`} className='subscriptions-card' key={subscription._id}>           
                        <img src={`https://apps.rubaktechie.me/uploads/thumbnails/${subscription.thumbnailUrl}`} alt={subscription.title}/>
                        <div className='subscriptions-details'>
                        <img src={`https://apps.rubaktechie.me/uploads/avatars/${subscription.userId.photoUrl}`} alt={subscription.userId.channelName}/>
                        <div>
                        <h2>{subscription.title}</h2>
                        <h3>{subscription.userId.channelName}</h3>
                        <p>{subscription.views} views &bull; {moment(subscription.createdAt).fromNow()}</p>
                        </div>
                        </div>
                    </Link>
                    )
                  })                 
            ) : (
                <p>No results found.</p>
            )
        )}
    </div>
  )
}

export default Subscriptions
