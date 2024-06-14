import './UpdateComment.css'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import userProfile from '../../../assets/user_profile.jpg'
import { useAuth } from '../../../util/AuthContext';
import { fetchUserDetails } from '../../User/UserProfile/UserDetailsApi';
import { updateComment } from './UpdateCommentApi';

const UpdateComment = ({videoId, comment, updateCommentAdded}) => {
    const [editComment, setEditComment] = useState(comment.text || '');
    const [focused, setFocused] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();

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

    const handleCommentChange = (e) =>{
        setEditComment(e.target.value);
    }

    const handleCommentSubmit = async(e) => {
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
            const response = await updateComment({text: editComment}, videoId);
            if ((response.success || response.sucess) && response.data) {
                updateCommentAdded(response.data);
                setFocused(false);
            } else {
                console.error('API response is not in the expected format:', response);
            }
        } catch{
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

  return (
    <div className='new-comment'>
        <img src={userProfile} alt=''/>
        <input className={`input-field ${focused ? 'visible' : ''}`}
            type='text'
            placeholder={editComment}
            value={editComment}
            onChange={handleCommentChange}
            onFocus={handleFocus}
            onBlur={()=>!editComment && setFocused(false)}
        />
        <div className={`comment-buttons ${focused ? 'visible' : ''}`}>
            <button onClick={()=> {setEditComment(comment.text); setFocused(false); }}>Cancel</button>
            <button onClick={handleCommentSubmit}>Save</button>
        </div>
    </div>
  )
}

export default UpdateComment
