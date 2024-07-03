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
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import UpdateReply from '../Replies/UpdateReply';

const Comments = ({videoId}) => {
    const [comments, setComments] = useState([]);
    const [replies, setReplies] = useState(comments.replies || []);
    const [showReplyInput, setShowReplyInput] = useState(false); //visibility of reply input
    const [focusedReplyIndex, setFocusedReplyIndex] = useState(null);
    const [visibleReplies, setVisibleReplies] = useState([]);
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [commentDropdownIndex, setCommentDropdownIndex] = useState(null);
    const [dropdownIndex, setDropdownIndex] = useState(null);
    const [editCommentIndex, setEditCommentIndex] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');
    const [replyDropdownIndex, setReplyDropdownIndex] = useState(null);
    const [editReplyIndex, setEditReplyIndex] = useState(null);
    const [editReplyText, setEditReplyText] = useState('');
    const [userDetails, setUserDetails] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRefs = useRef([]);  
    const [focusInput, setFocusInput] = useState(false);

    useEffect(() => {
     
      // fetch comments fom GET Api
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

      // fetch replies fom GET Api
      const fetchRepliesData = async() => {
        try {
          const response = await getReplies();
          console.log(response)
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

    // Fetch comments and replies when component mounts or dependencies change
    fetchCommentsData();
    fetchRepliesData();
    }, [videoId, navigate, isAuthenticated]);


    // to add a new comment
    const handleCommentAdded = (newComment) => {
      console.log('New comment added:', newComment);
        setComments((prevComments)=> [newComment, ...prevComments]);
    }

     // to toggle dropdown menu for actions on a comment
     const toggleCommentDropdown = (index) => {
      if (editCommentIndex === null) {
          setCommentDropdownIndex(commentDropdownIndex === index ? null : index);
      }
  }

  const toggleReplyDropdown = (commentId, replyId) => {
    const updatedReplies = replies.map((reply) =>
        reply.commentId === commentId && reply.id === replyId
            ? { ...reply, dropdownOpen: !reply.dropdownOpen }
            : { ...reply, dropdownOpen: false } // Close all other dropdowns
    );
    setReplies(updatedReplies);
};


  useEffect(() => {
    const handleClickOutside = (event) => {
        // Check if there is a dropdown currently open
        if (commentDropdownIndex !== null && dropdownRefs.current[commentDropdownIndex]) {
            // Check if the click occurred outside the dropdown menu or inside
            if (!dropdownRefs.current[commentDropdownIndex].contains(event.target)) {
                // Close the dropdown if clicked outside or inside
                setCommentDropdownIndex(null);
            }
        }
    };

    // Event listener setup on component mount
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        // Cleanup: remove event listener on component unmount
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, [commentDropdownIndex]); // Dependency ensures effect runs on dropdown changes

useEffect(() => {
  const handleClickOutside = (event) => {
      // Check if there is any reply dropdown currently open
      const isOutsideAnyDropdown = replies.some((reply) =>
          reply.dropdownOpen && dropdownRefs.current[reply.id] && !dropdownRefs.current[reply.id].contains(event.target)
      );
      
      if (isOutsideAnyDropdown) {
          const updatedReplies = replies.map((reply) =>
              reply.dropdownOpen ? { ...reply, dropdownOpen: false } : reply
          );
          setReplies(updatedReplies);
      }
  };

  // Event listener setup on component mount
  document.addEventListener('mousedown', handleClickOutside);

  return () => {
      // Cleanup: remove event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
  };
}, [replies]);


   // to handle delete comment Api
    const handleDeleteComment = async(commentId) => {  
      if(!isAuthenticated){
        return;
    }
    try {
      const response = await deleteCommentApi(commentId);
      if (response.success) {
         // Remove the deleted comment from state
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
      } else {
        console.error('Failed to delete comment:', response.message);
      }
    } catch (error) {
      navigate('/error');
    }
    };
  console.log(comments);

   // to handle updating a comment after edit
    const handleUpdateCommentAdded = (updateComment) => {
       // Update the comment in state
      setComments((prevComments)=>
      prevComments.map((comment) => 
        (comment.id === updateComment.id ? { ...comment, text: updateComment.text } : comment))
    );
    // Exit edit mode after updating comment
    setEditCommentIndex(null);
    setEditCommentText('');
    }

     // to handle initiating edit mode for a comment
    const handleEditComment = (index, text) => {
      // Set edit mode for the specified comment index
      setEditCommentIndex(index);
      // Set initial text for editing
      setEditCommentText(text);
      // Close dropdown if open
      setDropdownIndex(null);
    };  

     // to cancel editing a comment
    const handleCancelEditComment = () => {
      // Exit edit mode and reset edit comment text
      setEditCommentIndex(null);
      setEditCommentText('');
    };
   
    // to handle delete comment Api
    const handleDeleteReply = async(replyId) => {  
      if(!isAuthenticated){
        return;
    }
    try {
      const response = await deleteCommentApi(replyId);
      if (response.success) {
         // Remove the deleted comment from state
        setReplies((prevComments) => prevComments.filter((reply) => reply.id !== replyId));
      } else {
        console.error('Failed to delete reply:', response.message);
      }
    } catch (error) {
      navigate('/error');
    }
    };

  const handleUpdateReplyAdded = (updatedReply) => {
    setReplies((prevReplies) =>
        prevReplies.map((reply) => (reply.id === updatedReply.id ? updatedReply : reply))
    );
    setEditReplyIndex(null);
    setEditReplyText('');
}

    const handleEditReply = (index, text) => {
      setEditReplyIndex(index);
      setEditReplyText(text);
      setReplyDropdownIndex(null);
    }

    const handleCancelEditReply = () => {
      setEditReplyIndex(null);
      setEditReplyText('');
    };

    const handleReplyAdded = (newReply) => {
      setReplies([...replies, newReply]);
    };

    const handleReplyFocus = (index) => {
      setFocusedReplyIndex(index);
  };

  const toggleRepliesVisibility = (commentId) => {
    setVisibleReplies((prevVisibleReplies) =>
        prevVisibleReplies.includes(commentId)
            ? prevVisibleReplies.filter((id) => id !== commentId)
            : [...prevVisibleReplies, commentId]
    );
  };

  const handleReplyInputToggle = (commentId) => {
    setShowReplyInput((prevShowReplyInput) => ({
        ...prevShowReplyInput,
        [commentId]: !prevShowReplyInput[commentId],
    }));
};


console.log("auth:",isAuthenticated)
console.log("user:",user)
console.log("comment.userId", comments.userId)
console.log("user.id", user.id._id)
console.log("replyDropdownIndex:", replyDropdownIndex)
console.log("replyIndex:", replies)
console.log("comments", comments)
return (
        <div>
            <h4>{comments.length} Comments</h4>
            <CreateComments videoId={videoId} onCommentAdded={handleCommentAdded} isAuthenticated={isAuthenticated} />
            {comments.map((comment, index) => {
                const commentReplies = replies.filter((reply) => reply.commentId === comment.id);
                const hasReplies = commentReplies.length > 0;
                const isVisible = visibleReplies.includes(comment.id);
                const isOwner = isAuthenticated && comment.userId._id === user.id;
                return (
                    <div key={comment.id} className='comment'>
                        <img src={userProfile} alt='' />
                        <div className='comments-detail'>
                            <div className='comment-header'>
                                <h3>{comment.userId.channelName} <span>{moment(comment.createdAt).fromNow()}</span></h3>
                                <div className='comment-actions'>
                                    <div className="icon-circle">
                                        <span><FontAwesomeIcon icon={faEllipsisVertical} style={{ color: "#6f7276", }} onClick={() => toggleCommentDropdown(index)} /></span>
                                    </div>
                                    {isOwner && commentDropdownIndex === index && (
                                <div ref={(el) => el ? dropdownRefs.current[index] = el : null} className='dropdown-menu'>
                                    <button onClick={() => handleEditComment(index, comment.text)}>Edit</button>
                                    <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                </div>
                            )}
                                </div>
                            </div>
                            {editCommentIndex === index ? (
                              <UpdateComment
                              commentId={comment.id}
                              comment={comment}
                              updateCommentAdded={handleUpdateCommentAdded}
                              cancelEdit={handleCancelEditComment}
                              initialText={editCommentText}
                              />
                            ) : (
                                <p>{comment.text}</p>
                            )}
                            <div className="reply-section">
                                <button onClick={() => {
                                    handleReplyFocus(index);
                                    setShowReplyInput(true);
                                }}>Reply</button>
                                
                            <div>
                            {hasReplies && (
                              <span className='reply-toggle' onClick={() => toggleRepliesVisibility(comment.id)}>
                                <FontAwesomeIcon icon={isVisible ? faChevronUp : faChevronDown} /> {commentReplies.length} {commentReplies.length === 1 ? 'reply' : 'replies'}
                              </span>
                            )}
                            </div>
                            </div>
                            {showReplyInput && focusedReplyIndex === index && (
                                <CreateReply
                                    commentId={comment.id}
                                    onReplyAdded={handleReplyAdded}
                                    onCancelReply={() => setShowReplyInput(false)}
                                />
                            )}
                            {isVisible && (
                                <div className="replies">
                                    {commentReplies.map((reply, replyIndex) => (
                                        <div key={reply.id} className='reply'>
                                            <img src={userProfile} alt='' />
                                            <div className='reply-detail'>
                                                <div className='reply-header'>
                                                    <h3>{reply.userId.channelName} <span>{moment(reply.createdAt).fromNow()}</span></h3>
                                                    <div className='reply-actions'>
                                                        <div className="icon-circle">
                                                            <span><FontAwesomeIcon icon={faEllipsisVertical} style={{ color: "#6f7276", }} onClick={() => toggleReplyDropdown(comment.id, reply.id)} /></span>
                                                        </div>
                                                        {isAuthenticated && reply.dropdownOpen && (
                                                            <div className='dropdown-menu'>
                                                                <button onClick={() => handleEditReply(replyIndex, reply.text)}>Edit</button>
                                                                <button onClick={() => handleDeleteReply(reply.id)}>Delete</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {editReplyIndex === replyIndex ? (
                                                    <UpdateReply
                                                        replyId={reply.id}
                                                        reply={reply}
                                                        onUpdateReply={handleUpdateReplyAdded}
                                                        cancelEdit={handleCancelEditReply}
                                                        // initialText={editReplyText}
                                                    />
                                                ) : (
                                                    <p>{reply.text}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Comments;