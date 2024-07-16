import React, { useEffect, useState } from 'react'
// import './UpdateReply.css'
import { useNavigate } from 'react-router-dom';
import userProfile from '../../assets/user_profile.jpg'
import { useAuth } from '../../util/AuthContext';
import { fetchUserDetails } from '../User/UserProfile/UserDetailsApi';
import { updateReply } from './Api/UpdateReplyApi';

const UpdateReply = ({replyId, reply, channelName, onUpdateReply, cancelEdit }) => {
    const [editReply, setEditReply] = useState(reply.text || '');
    const [focused, setFocused] = useState(false); // Focus input on edit
    const [userDetails, setUserDetails] = useState(null);
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();

     // fetch user details when authenticated
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await fetchUserDetails();
                setUserDetails(user);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
            }
        };

        if (isAuthenticated) {
            fetchUserData();
        }
    }, [isAuthenticated]);

    // to handle comment text change
    const handleReplyChange = (e) =>{
        setEditReply(e.target.value);
    }

    // to submit updated comment
    const handleReplySubmit = async(e) => {
        e.preventDefault();

        if(!isAuthenticated){
            navigate('/signin');
            return;
        }

        if (!userDetails) {
            console.error('User details not available');
            return;
        }

        try {
            console.log({text: editReply})
            console.log(replyId)
            const response = await updateReply({text: editReply}, replyId);
            console.log(response)
            if ((response.success || response.sucess) && response.data) {
                const updatedReply = { ...response.data, channelName: reply.channelName };
                onUpdateReply(updatedReply);
                setFocused(false);
            } else {
                console.error('API response is not in the expected format:', response);
            }
        } catch(error){
            console.error('Failed to update reply:', error);
            navigate('/error');
        }
    }

    const handleFocus = (e) => {
        if(!isAuthenticated){
            navigate('/signin');
        }else{
            setFocused(true);
        }
    }

     // to handle canceling edit
        const handleCancel = () => {
            cancelEdit(); // Call cancelEdit function passed from Comments component
        };

  return (
    <div className='update-reply-container'>
         {!focused && <img src={userProfile} alt=''/>}
        <input className={`update-reply-input ${focused ? 'visible' : ''}`}
            type='text'
            placeholder={editReply}
            value={editReply}
            onChange={handleReplyChange}
            onFocus={handleFocus}
            onBlur={()=>!editReply && setFocused(false)}
        />
        <div className={`update-reply-buttons ${focused ? 'visible' : ''}`}>
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleReplySubmit} data-testid='save-reply'>Save</button>
        </div>
    </div>
  )
}

export default UpdateReply
