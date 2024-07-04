import './UpdateComment.css'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import userProfile from '../../../assets/user_profile.jpg'
import { useAuth } from '../../../util/AuthContext';
import { fetchUserDetails } from '../../User/UserProfile/UserDetailsApi';
import { updateComment } from '../Apis/UpdateCommentApi';

const UpdateComment = ({commentId, comment, updateCommentAdded, cancelEdit }) => {
    const [editComment, setEditComment] = useState(comment.text || '');
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
    const handleCommentChange = (e) =>{
        setEditComment(e.target.value);
    }

    // to submit updated comment
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
            console.log({text: editComment})
            console.log(commentId)
            const response = await updateComment({text: editComment}, commentId);
            if ((response.success || response.sucess) && response.data) {
                console.log("update comment:",response.data)
                updateCommentAdded(response.data);
                setFocused(false);
            } else {
                console.error('API response is not in the expected format:', response);
            }
        } catch(error){
            console.error('Error in updating comment:',error);
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
    <div className='new-comment'>
        <img src={userProfile} alt=''/>
        <input className={`input-field ${focused ? 'visible' : ''}`}
            type='text'
            autoFocus
            placeholder={editComment}
            value={editComment}
            onChange={handleCommentChange}
            onFocus={handleFocus}
            onBlur={()=>!editComment && setFocused(false)}
        />
        <div className={`comment-buttons ${focused ? 'visible' : ''}`}>
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleCommentSubmit}>Save</button>
        </div>
    </div>
  )
}

export default UpdateComment
