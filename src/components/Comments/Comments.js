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
import { getReplies } from '../Replies/Api/GetRepliesApi';
import Reply from '../Replies/CreateReply';
import CreateReply from '../Replies/CreateReply';

const Comments = ({videoId}) => {
    const [comments, setComments] = useState([]);
    const [replies, setReplies] = useState([]);
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();
    const [dropdownIndex, setDropdownIndex] = useState(null);
    const [editCommentIndex, setEditCommentIndex] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const dropdownRefs = useRef();  

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

      const fetchRepliesData = async() => {
        try {
          const response = await getReplies();
          if(response.success){
            setReplies(response.data);
          }else {
            console.error('API response is not in the expected format:', response);
        }
        } catch (error) {
          console.error('Failed to fetch replies:', error);
          return [];
        }
      }

    fetchCommentsData();
    fetchRepliesData();
    }, [videoId, navigate, isAuthenticated]);


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
    
    const handleDeleteReply = (replyId) => {
      setReplies((prevReplies) => prevReplies.filter((reply) => reply.id !== replyId));
  };

  const handleUpdateReply = (updatedReply) => {
      setReplies((prevReplies) =>
          prevReplies.map((reply) => (reply.id === updatedReply.id ? updatedReply : reply))
      );
  };

  const handleReplyAdded = (newReply) => {
      setReplies((prevReplies) => [newReply, ...prevReplies]);
  };
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
              id={comment.id} 
              comment={comment} 
              updateCommentAdded={handleUpdateCommentAdded}/>
            ) : (
                <p>{comment.text}</p>
            )}
                <div className='comment-action'>
                    {replies.filter((reply)=> reply.commentId === comment.id)
                    .map((reply) => (
                      <Reply
                      key={reply.id}
                      reply={reply}
                      onUpdateReply={handleUpdateReply}
                      onDeleteReply={handleDeleteReply}/>
                    ))}
                    <CreateReply
                    commentId={comment.id}
                    onReplyAdded={handleReplyAdded}
                    isAuthenticated={isAuthenticated}
                    />
                    {/* <span id='reply-text'  >REPLY</span> */}
                </div>
            </div>  
        </div>   
      ))}
    </div>
  )
}

export default Comments
