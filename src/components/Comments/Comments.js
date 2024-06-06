import './Comments.css'
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import userProfile from '../../assets/user_profile.jpg'
import CreateComments from './CreateComments';
import { useAuth } from '../../util/AuthContext';

const Comments = ({videoId}) => {
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();

    useEffect(() => {
    const fetchComments = async () =>{
        const commentsUrl= `https://apps.rubaktechie.me/api/v1/comments/${videoId}/videos`;
    
        try {
          const response = await fetch(commentsUrl);
          const json = await response.json();
          console.log('API response:', json);
          if((json.success || json.sucess) && json.data) {
            setComments(json.data);
          }else{
            console.error('API response is not in the expected format:', json);
          }   
        } catch (error) {
          navigate('/error');
        }
      };
    
    fetchComments();
}, [videoId, navigate]);

    const handleCommentAdded = (newComment) => {
        setComments((prevComments)=> [newComment, ...prevComments]);
    }

  return (
    <div>
      <h4>{comments.length} Comments</h4>
      <CreateComments videoId={videoId} onCommentAdded={handleCommentAdded} isAuthenticated={isAuthenticated} />
      {comments.map((comment, index) => (  
          <div key={index} className='comment'> 
            <img src={userProfile} alt=''/>
            <div className='comments-detail'>
                <h3>{comment.userId.channelName} <span>{moment(comment.createdAt).fromNow()}</span></h3>
                <p>{comment.text}</p>
                <div className='comment-action'>
                    <img src={comment.like} alt=''/>
                    <span>REPLY</span>
                    <img src={comment.dislike} alt=''/>
                </div>
            </div>
        </div>      
      ))}
    </div>
  )
}

export default Comments
