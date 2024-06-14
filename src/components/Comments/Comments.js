import './Comments.css'
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import userProfile from '../../assets/user_profile.jpg'
import CreateComments from './CreateComments';
import { useAuth } from '../../util/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons/faEllipsisVertical';
import {deleteCommentApi}  from './DeleteCommentApi'
import { fetchUserDetails } from '../User/UserProfile/UserDetailsApi';
import { fetchComments } from './GetCommentsApi';
import UpdateComment from './Update/UpdateComment';

const Comments = ({videoId}) => {
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();
    const [dropdownIndex, setDropdownIndex] = useState(null);
    const [editCommentIndex, setEditCommentIndex] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const dropdownRefs = useRef([]);

    useEffect(() => {
      
      // GET Api
      const fetchCommentsData = async () =>{
        try {
          const response = await fetchComments(videoId);
          console.log('API response:', response);
          if((response.success || response.sucess) && response.data) {
            setComments(response.data);
          }else{
            console.error('API response is not in the expected format:', response);
          }   
        } catch (error) {
          navigate('/error');
        }
      };


    // const fetchUserData = async () => {
    //   if (isAuthenticated) {
    //     try {
    //       const user = await fetchUserDetails();
    //       setUserDetails(user);
    //     } catch (error) {
    //       console.error('Failed to fetch user details:', error);
    //     }
    //   }
    // };

    fetchCommentsData();
    // fetchUserData();
    }, [videoId, navigate, isAuthenticated]);

    useEffect(() => {
      const handleClickOutside = (event) => {
          if (dropdownIndex !== null &&
            dropdownRefs.current[dropdownIndex] && !dropdownRefs.current[dropdownIndex].contains(event.target)) {
              setDropdownIndex(null);
          }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, [dropdownIndex]);

    const handleCommentAdded = (newComment) => {
      console.log('New comment added:', newComment);
        setComments((prevComments)=> [newComment, ...prevComments]);
    }

    const toggleDropdown = (index) => {
      console.log("index",index)
      if (editCommentIndex === null) {
      setDropdownIndex(dropdownIndex === index ? null : index);
      }
  }

    const handleDelete = async(commentId) => {
      if(!isAuthenticated){
        return;
    }

    //Delete Api
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
  console.log(comments);

    const handleUpdateCommentAdded = (updateComment) => {
      setComments((prevComments)=> 
      prevComments.map((comment) => (comment.id === updateComment.id ? updateComment : comment))
    );
    setEditCommentIndex(null);
    }

    const handleEdit = (index) => {
      setEditCommentIndex(index);
      setDropdownIndex(null);
    }

  return (
    <div>
      <h4>{comments.length} Comments</h4>
      <CreateComments videoId={videoId} onCommentAdded={handleCommentAdded} isAuthenticated={isAuthenticated} />
      {comments.map((comment, index) => (  
          <div key={comment.id} className='comment'> 
            <img src={userProfile} alt=''/>
            <div className='comments-detail'>
            <div className='comment-header'>
                <h3>{comment.userId.channelName} <span>{moment(comment.createdAt).fromNow()}</span></h3>
                <div className='comment-actions'>
                  <div className="icon-circle">
                  <span><FontAwesomeIcon icon={faEllipsisVertical} style={{color: "#6f7276",}} onClick={() => toggleDropdown(index)} /></span>
                  </div>
                {isAuthenticated && dropdownIndex === index && (
                  <div className='dropdown-menu'>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDelete(comment.id)}>Delete</button>
                  </div>
              )}
            </div>
            </div> 
            {editCommentIndex === index ? (
              <UpdateComment 
              videoId={videoId} 
              comment={comment} 
              updateCommentAdded={handleUpdateCommentAdded}/>
            ) : (
                <p>{comment.text}</p>
            )}
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
