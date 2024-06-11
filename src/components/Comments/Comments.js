import './Comments.css'
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import userProfile from '../../assets/user_profile.jpg'
import CreateComments from './CreateComments';
import { useAuth } from '../../util/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons/faEllipsisVertical';
import {deleteCommentApi}  from './DeleteCommentApi'
import { fetchUserDetails } from '../User/UserProfile/UserDetailsApi';

const Comments = ({videoId}) => {
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();
    const [dropdownIndex, setDropdownIndex] = useState(null);
    const [userDetails, setUserDetails] = useState(null);

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


    const fetchUserData = async () => {
      if (isAuthenticated) {
        try {
          const user = await fetchUserDetails();
          setUserDetails(user);
        } catch (error) {
          console.error('Failed to fetch user details:', error);
        }
      }
    };

    fetchComments();
    fetchUserData();
    }, [videoId, navigate, isAuthenticated]);

    const handleCommentAdded = (newComment) => {
      console.log('New comment added:', newComment);
        setComments((prevComments)=> [newComment, ...prevComments]);
    }

    const toggleDropdown = (index) => {
      console.log("index",index)
      setDropdownIndex(dropdownIndex === index ? null : index);
  }

    const handleDelete = async(commentId) => {
      if(!isAuthenticated){
        return;
    }

    try {
      const response = await deleteCommentApi(commentId);
      if (response.success) {
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
      } else {
        console.error('Failed to delete comment:', response.message);
      }
    } catch (error) {
      navigate('/error');
    }
  };

  return (
    <div>
      <h4>{comments.length} Comments</h4>
      <CreateComments videoId={videoId} onCommentAdded={handleCommentAdded} isAuthenticated={isAuthenticated} />
      {comments.map((comment, index) => (  
          <div key={index} className='comment'> 
            <img src={userProfile} alt=''/>
            <div className='comments-detail'>
            <div className='comment-header'>
                <h3>{comment.userId.channelName} <span>{moment(comment.createdAt).fromNow()}</span></h3>
                <div className='comment-actions'>
                  <div className="icon-circle">
                  <FontAwesomeIcon icon={faEllipsisVertical} style={{color: "#6f7276",}} onClick={() => toggleDropdown(index)} />
                  </div>
                {isAuthenticated && dropdownIndex === index && (
                  <div className='dropdown-menu'>
                    <button onClick={() => handleDelete(comment.id)}>Delete</button>
                  </div>
              )}
            </div>
            </div> 
                <p>{comment.text}</p>
                <div className='comment-action'>
                    <img src={comment.like} alt=''/>
                    <span id='reply-text'>REPLY</span>
                    <img src={comment.dislike} alt=''/>
                </div>
            </div>  
        </div>   
      ))}
    </div>
  )
}

export default Comments
