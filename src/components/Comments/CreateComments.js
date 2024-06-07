import './CreateComments.css'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import userProfile from '../../assets/user_profile.jpg'
import { useAuth } from '../../util/AuthContext';
import { commentsApi } from './CreateCommentsApi';

const CreateComments = ({videoId, onCommentAdded}) => {
    const [newComment, setNewComment] = useState('');
    const [focused, setFocused] = useState(false);
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();

    const handleCommentChange = (e) =>{
        setNewComment(e.target.value);
    }

    const handleCommentSubmit = async(e) => {
        e.preventDefault();

        if(!isAuthenticated){
            navigate('/signin');
            return;
        }

        const commentsData = {
            videoId: videoId,
            text: newComment.text
        };
        console.log(commentsData)

        try {
            const response = await commentsApi(commentsData);
            if ((response.success || response.sucess) && response.data) {
                onCommentAdded(response.data);
                setNewComment('');
                setFocused(false);
            } else {
                console.error('API response is not in the expected format:', response);
            }
        } catch{
            navigate('/error');
        }
    }

    const handleFocus = () => {
        if(!isAuthenticated){
            navigate('/signin');
        }else{
            setFocused(true);
        }
    }

  return (
    <div className='new-comment'>
        <img src={userProfile} alt=''/>
        <input 
            type='text'
            placeholder='Add a public comment...'
            value={newComment}
            onChange={handleCommentChange}
            onFocus={handleFocus}
            onBlur={()=>!newComment && setFocused(false)}
        />
        <div className={`comment-buttons ${focused ? 'visible' : ''}`}>
            <button onClick={()=> {setNewComment(''); setFocused(false); }}>CANCEL</button>
            <button onClick={handleCommentSubmit}>COMMENT</button>
        </div>
    </div>
  )
}

export default CreateComments
