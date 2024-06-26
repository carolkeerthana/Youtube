import React, { useState } from 'react';
import './Reply.css'
import userProfile from '../../assets/user_profile.jpg';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons/faEllipsisVertical';


const Reply = ({ reply}) => {
  const [nestedReplies, setNestedReplies] = useState(reply.replies || []);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [focusInput, setFocusInput] = useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(reply.text);


  const handleNestedReplyAdded = (newReply) => {
    setNestedReplies([...nestedReplies, newReply]);
  };


  const toggleReplyInput = () => {
    setShowReplyInput(!showReplyInput);
    setFocusInput(true);
  };
 
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };


  const handleEdit = () => {
    setIsEditing(true);
    setDropdownOpen(false);
  };


  // const handleSaveEdit = () => {
  //   onUpdateReply({ ...reply, text: editText });
  //   setIsEditing(false);
  // };


  // const handleDelete = () => {
  //   onDeleteReply(reply.id);
  // };


  console.log(reply)
  return (
    <div className='reply-container'>
      <img src={userProfile} alt='' className='reply-avatar' />
      <div className='reply-content'>
        <div className='reply-header'>
          {/* <h3>{reply.userId.channelName} <span>{moment(comment.createdAt).fromNow()}</span></h3> */}
          <div className="reply-text">{reply.text}</div>
          <div className='reply-actions'>
            <div className='icon-circle'>
              <span><FontAwesomeIcon icon={faEllipsisVertical} style={{ color: '#6f7276' }} onClick={toggleDropdown} /></span>
            </div>
            {dropdownOpen && (
              <div className='dropdown-menu'>
                <button onClick={handleEdit}>Edit</button>
                {/* <button onClick={handleDelete}>Delete</button> */}
              </div>
            )}
          </div>
        </div>
        <div className='reply-text'>
          {isEditing ? (
            <div className='edit-reply'>
              <textarea value={editText} onChange={(e) => setEditText(e.target.value)} />
              {/* <button onClick={handleSaveEdit}>Save</button> */}
            </div>
          ) : (
            <p>{reply.text}</p>
          )}
        </div>
      </div>
    </div>
  );
};


export default Reply;

