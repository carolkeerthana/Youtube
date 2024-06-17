import React, { useEffect, useState } from 'react'
import './CreateSubscriber.css'
import SignInPopup from '../../Feelings/SignInPopup ';
import { useAuth } from '../../../util/AuthContext';

const CreateSubscriber = ({channelId}) => {
  const {isAuthenticated} = useAuth();
  const [subscribers, setSubscribers] =  useState(null);
  const [error, setError] = useState('')
  const [userAction, setUserAction] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [action, setAction] = useState(null);

    const handleSubscribe = async() => {
      try {
          const response = await CreateSubscriber({channelId: channelId});
          console.log('API response:', response);
          if(response.success && Array.isArray(response.data)){
            setSubscribers(response.data);
          }else{
            setError(response.error);
            setSubscribers([]);
          }   
        } catch (error) {
          setError('Error fetching data');
          setSubscribers([]);
        }
  } 
  useEffect(() => {
    handleSubscribe();         
}, []);
    

  const handleSubscribed = () => {
    
  }

  return (
    <div>
      {showSignIn && (
                <div className='feelings-overlay' onClick={() => setShowSignIn(false)}>
                    <SignInPopup action={action}/>
                </div>
            )}
        <button onClick={handleSubscribe} className={`icons ${userAction === 'Subscribe' ? 'active' : ''}`}>
        Subscribe
        </button>
        <button onClick={handleSubscribed} className={`icons ${userAction === 'Subscribed' ? 'active' : ''}`}>
        Subscribed
        </button>
    </div>
  )
}

export default CreateSubscriber
