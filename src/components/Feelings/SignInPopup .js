import React from 'react'
import { useNavigate } from 'react-router-dom'

const SignInPopup  = ({action}) => {
    const navigate = useNavigate();

    const handleSignIn = () => {
        navigate('/signin');
    }
  return (
    <div className='sign-in-popup'>
      <p id='p-one'>{action === "like" ? "Like this video?" : "Don't like this video?"}</p>
      <p id='p-two'>Sign in to make your opinion count.</p>
      <button onClick={handleSignIn}>Sign in</button>
    </div>
  )
}

export default SignInPopup 
