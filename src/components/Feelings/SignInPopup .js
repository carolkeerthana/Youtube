import React from 'react'
import'./SignInPopup.css'
import { useNavigate } from 'react-router-dom'

const SignInPopup  = ({action}) => {
    const navigate = useNavigate();

    const handleSignIn = () => {
        navigate('/signin');
    }

    const getActionText = () => {
      switch (action) {
        case 'like':
          return 'Like this video?';
        case 'subscribe':
          return 'Want to subscribe to this channel?';
        default:
          return "Don't like this video?";
      }
    };
  return (
    <div className='sign-in-popup'>
      <p id='p-one'>{getActionText()}</p>
      <p id='p-two'>{action === 'subscribe' ? 'Sign in to subscribe to this channel.' : 'Sign in to make your opinion count'}</p>
      <button onClick={handleSignIn}>Sign in</button>
    </div>
  )
}

export default SignInPopup 
