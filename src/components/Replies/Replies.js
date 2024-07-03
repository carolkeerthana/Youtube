import React, { useState } from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import userProfile from '../../assets/user_profile.jpg';
import CreateReply from './CreateReply';
import UpdateReply from './UpdateReply';
import { deleteCommentApi } from '../Comments/DeleteCommentApi';

const Replies = ({ commentId, replies, isAuthenticated, onReplyAdded, onUpdateReplyAdded, onDeleteReply }) => {
  const [visibleReplies, setVisibleReplies] = useState([]);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [focusedReplyIndex, setFocusedReplyIndex] = useState(null);
  const [replyDropdownIndex, setReplyDropdownIndex] = useState(null);
  const [editReplyIndex, setEditReplyIndex] = useState(null);
  const [editReplyText, setEditReplyText] = useState('');

  const toggleRepliesVisibility = (commentId) => {
    setVisibleReplies((prevVisibleReplies) =>
      prevVisibleReplies.includes(commentId)
        ? prevVisibleReplies.filter((id) => id !== commentId)
        : [...prevVisibleReplies, commentId]
    );
  };

  const handleReplyFocus = (index) => {
    setFocusedReplyIndex(index);
  };

  const toggleReplyDropdown = (replyIndex) => {
    if (editReplyIndex === null) {
      setReplyDropdownIndex(replyDropdownIndex === replyIndex ? null : replyIndex);
    }
  };

  const handleEditReply = (index, text) => {
    setEditReplyIndex(index);
    setEditReplyText(text);
    setReplyDropdownIndex(null);
  };

  const handleCancelEditReply = () => {
    setEditReplyIndex(null);
    setEditReplyText('');
  };

  return (
    <div>
      {replies.length > 0 && (
        <span className='reply-toggle' onClick={() => toggleRepliesVisibility(commentId)}>
          <FontAwesomeIcon icon={visibleReplies.includes(commentId) ? faChevronUp : faChevronDown} /> {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
        </span>
      )}
      {showReplyInput && (
        <CreateReply
          commentId={commentId}
          onReplyAdded={onReplyAdded}
          onCancelReply={() => setShowReplyInput(false)}
        />
      )}
      {visibleReplies.includes(commentId) && (
        <div className="replies">
          {replies.map((reply, replyIndex) => (
            <div key={reply.id} className='reply'>
              <img src={userProfile} alt='' />
              <div className='reply-detail'>
                <div className='reply-header'>
                  <h3>{reply.userId?.channelName || 'Unknown User'} <span>{moment(reply.createdAt).fromNow()}</span></h3>
                  <div className='reply-actions'>
                    <div className="icon-circle">
                      <span><FontAwesomeIcon icon={faEllipsisVertical} style={{ color: "#6f7276", }} onClick={() => toggleReplyDropdown(replyIndex)} /></span>
                    </div>
                    {isAuthenticated && replyDropdownIndex === replyIndex && (
                      <div className='dropdown-menu'>
                        <button onClick={() => handleEditReply(replyIndex, reply.text)}>Edit</button>
                        <button onClick={() => onDeleteReply(reply.id)}>Delete</button>
                      </div>
                    )}
                  </div>
                </div>
                {editReplyIndex === replyIndex ? (
                  <UpdateReply
                    replyId={reply.id}
                    reply={reply}
                    onUpdateReply={onUpdateReplyAdded}
                    cancelEdit={handleCancelEditReply}
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
  );
};

export default Replies;
