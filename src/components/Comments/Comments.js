import "./Comments.css";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import userProfile from "../../assets/user_profile.jpg";
import CreateComments from "./CreateComments";
import { useAuth } from "../../util/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons/faEllipsisVertical";
import { deleteCommentApi } from "./Apis/DeleteCommentApi";
import { fetchComments } from "./Apis/GetCommentsApi";
import UpdateComment from "./Update/UpdateComment";
import { getReplies } from "../Replies/Api/GetRepliesApi";
import CreateReply from "../Replies/CreateReply";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import UpdateReply from "../Replies/UpdateReply";
import { deleteReply } from "../Replies/Api/DeleteReplyApi";

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState(comments.replies || []);
  const [showReplyInput, setShowReplyInput] = useState(false); //visibility of reply input
  const [focusedReplyIndex, setFocusedReplyIndex] = useState(null);
  const replyInputRefs = useRef([]);
  const [visibleReplies, setVisibleReplies] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [commentDropdownIndex, setCommentDropdownIndex] = useState(null);
  const [editCommentIndex, setEditCommentIndex] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editReplyId, setEditReplyId] = useState(null);
  const [replyDropdownIndex, setReplyDropdownIndex] = useState(null);
  const [editReplyIndex, setEditReplyIndex] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const dropdownRefs = useRef([]);
  const replyDropdownRefs = useRef([]);

  useEffect(() => {
    // fetch comments fom GET Api
    const fetchCommentsData = async () => {
      try {
        const response = await fetchComments(videoId);
        console.log("API response:", response);
        if ((response.success || response.sucess) && response.data) {
          const commentsWithChannel = response.data.map((comment) => ({
            ...comment,
            channelName: comment.userId.channelName, // Adjust as per your API response structure
          }));
          setComments(commentsWithChannel);
        } else {
          console.error(
            "API response is not in the expected format:",
            response
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/error");
      }
    };

    // fetch replies fom GET Api
    const fetchRepliesData = async () => {
      try {
        const response = await getReplies();
        console.log("reply :", response);
        if (response.success) {
          const repliesWithChannel = response.data.map((reply) => ({
            ...reply,
            channelName: reply.userId.channelName, // Adjust as per your API response structure
          }));
          setReplies(repliesWithChannel);
        } else {
          console.error(
            "API response is not in the expected format:",
            response
          );
        }
      } catch (error) {
        console.error("Failed to fetch replies:", error);
        navigate("/error");
        return [];
      }
    };

    // Fetch comments and replies when component mounts or dependencies change
    fetchCommentsData();
    fetchRepliesData();
  }, [videoId, navigate]);

  useEffect(() => {
    console.log("Updated comments:", comments);
  }, [comments]);

  // to add a new comment
  const handleCommentAdded = (newComment) => {
    console.log("New comment added:", newComment);
    const newCommentWithUser = {
      ...newComment,
      userId: user, // Add the authenticated user information
    };
    setComments((prevComments) => [newCommentWithUser, ...prevComments]);
  };

  // to toggle dropdown menu for actions on a comment
  const toggleCommentDropdown = (index) => {
    if (editCommentIndex === null) {
      setCommentDropdownIndex(commentDropdownIndex === index ? null : index);
    }
  };

  const toggleReplyDropdown = (commentId, replyId) => {
    setReplies((prevReplies) =>
      prevReplies.map(
        (reply) =>
          reply.commentId === commentId && reply.id === replyId
            ? { ...reply, dropdownOpen: !reply.dropdownOpen }
            : { ...reply, dropdownOpen: false } // Close all other dropdowns
      )
    );
  };

  useEffect(() => {
    console.log("useEffect hook running");
    const handleClickOutside = (event) => {
      console.log("Click event detected");

      console.log("Event target:", event.target);
      // Close comment dropdown if clicked outside
      if (
        commentDropdownIndex !== null &&
        dropdownRefs.current[commentDropdownIndex]
      ) {
        if (
          !dropdownRefs.current[commentDropdownIndex].contains(event.target)
        ) {
          console.log("Clicked outside comment dropdown");
          setCommentDropdownIndex(null);
        }
      }

      console.log("Reply Dropdown Refs:", replyDropdownRefs.current);
      // Close reply dropdown if clicked outside
      const isOutsideAnyReplyDropdown = replies.some(
        (reply) =>
          reply.dropdownOpen &&
          replyDropdownRefs.current[reply.id] &&
          !replyDropdownRefs.current[reply.id].contains(event.target)
      );

      if (isOutsideAnyReplyDropdown) {
        console.log("Clicked outside reply dropdown");
        setReplies((prevReplies) =>
          prevReplies.map((reply) =>
            reply.dropdownOpen ? { ...reply, dropdownOpen: false } : reply
          )
        );
      }
    };

    // Event listener setup on component mount
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup: remove event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [commentDropdownIndex, replies]);

  // to handle delete comment Api
  const handleDeleteComment = async (commentId) => {
    //   if(!isAuthenticated){
    //     console.error('User is not authenticated');
    //     return;
    // }
    try {
      const response = await deleteCommentApi(commentId);
      if (response.success) {
        // Remove the deleted comment from state
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
        setCommentDropdownIndex(null);
      } else {
        console.error(
          "API response is not in the expected format:",
          response.message
        );
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      navigate("/error");
    }
  };
  console.log(comments);

  // to handle edit for a comment
  const handleEditComment = (index, text) => {
    setEditCommentIndex(index);
    setEditCommentText(text);
    setCommentDropdownIndex(null);
  };

  // to cancel editing a comment
  const handleCancelEditComment = () => {
    setEditCommentIndex(null);
    setEditCommentText("");
  };

  // to handle updating a comment after edit
  const handleUpdateCommentAdded = (updateComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === updateComment.id
          ? { ...comment, text: updateComment.text }
          : comment
      )
    );
    // Exit edit mode after updating comment
    setEditCommentIndex(null);
    setEditCommentText("");
  };

  // to handle delete reply Api
  const handleDeleteReply = async (replyId) => {
    // if (!isAuthenticated) {
    //   return;
    // }
    try {
      const response = await deleteReply(replyId);
      if (response.success) {
        // Remove the deleted comment from state
        setReplies((prevComments) =>
          prevComments.filter((reply) => reply.id !== replyId)
        );
        setReplies((prevReplies) =>
          prevReplies.map((reply) =>
            reply.id === replyId ? { ...reply, dropdownOpen: false } : reply
          )
        ); 
      } else {
        console.error(
          "API response is not in the expected format:",
          response.message
        );
      }
    } catch (error) {
      console.error("Failed to delete reply:", error);
      navigate("/error");
    }
  };

  const handleUpdateReplyAdded = (updatedReply) => {
    setReplies((prevReplies) =>
      prevReplies.map((reply) =>
        reply.id === updatedReply.id
          ? {
              ...reply,
              text: updatedReply.text,
              channelName: updatedReply.channelName,
            }
          : reply
      )
    );
    // setEditReplyIndex(null);
    setEditReplyId(null);
    setEditReplyText("");
  };

  const handleEditReply = (replyId, text) => {
    setEditReplyId(replyId); // Set the reply ID being edited
    setEditReplyText(text); // Set initial text of the reply being edited
    setReplies((prevReplies) =>
      prevReplies.map((reply) => ({
        ...reply,
        dropdownOpen: reply.id === replyId,
      }))
    );
  };

  const handleCancelEditReply = () => {
    setEditReplyId(null);
    setEditReplyText("");
  };

  const handleReplyAdded = (newReply) => {
    const newReplyWithUser = {
      ...newReply,
      userId: user, // Add the authenticated user information
    };

    setReplies([...replies, newReplyWithUser]);
    setShowReplyInput(false); // Hide reply input after adding reply
    setFocusedReplyIndex(null);
  };

  const handleReplyFocus = (index) => {
    if (!isAuthenticated) {
      navigate("/signin");
    } else {
      setShowReplyInput(true);
      setFocusedReplyIndex(index);
    }
  };

  useEffect(() => {
    if (
      focusedReplyIndex !== null &&
      replyInputRefs.current[focusedReplyIndex]
    ) {
      replyInputRefs.current[focusedReplyIndex].focus();
    }
  }, [focusedReplyIndex]);

  // Handle cancel reply
  // const handleCancelReply = () => {
  //   setShowReplyInput(false); // Hide reply input on cancel
  //   setFocusedReplyIndex(null); // Reset focused reply index
  // };

  const toggleRepliesVisibility = (commentId) => {
    setVisibleReplies((prevVisibleReplies) =>
      prevVisibleReplies.includes(commentId)
        ? prevVisibleReplies.filter((id) => id !== commentId)
        : [...prevVisibleReplies, commentId]
    );
  };

  //   const handleReplyInputToggle = (commentId) => {
  //     setShowReplyInput((prevShowReplyInput) => ({
  //         ...prevShowReplyInput,
  //         [commentId]: !prevShowReplyInput[commentId],
  //     }));
  // };

  console.log("auth:", isAuthenticated);
  console.log("user:", user);
  console.log("comment.userId", comments.userId);
  console.log("replyDropdownIndex:", replyDropdownIndex);
  console.log("replyIndex:", replies);
  console.log("comments", comments);
  return (
    <div>
      <h4>{comments.length} Comments</h4>
      <CreateComments
        videoId={videoId}
        onCommentAdded={handleCommentAdded}
        isAuthenticated={isAuthenticated}
      />
      {comments.map((comment, index) => {
        const commentReplies = replies.filter(
          (reply) => reply.commentId === comment.id
        );
        const hasReplies = commentReplies.length > 0;
        const isVisible = visibleReplies.includes(comment.id);
        const isOwner = isAuthenticated && comment.userId?._id === user?.id;
        return (
          <div
            key={comment.id}
            data-testid={`comment-item-${index}`}
            className="comment"
          >
            <img src={userProfile} alt="" />
            <div className="comments-detail">
              <div className="comment-header">
                {editCommentIndex !== index ? (
                  <div>
                    <span className="comment-channel-name">
                      {" "}
                      {comment.channelName}{" "}
                    </span>
                    <span className="comment-moments">
                      {moment(comment.createdAt).fromNow()}
                    </span>
                  </div>
                ) : null}
                <div className="comment-actions">
                  {/* {console.log('editCommentIndex:', editCommentIndex)} */}
                  {editCommentIndex !== index && (
                    <div className="icon-circle">
                      <span>
                        <FontAwesomeIcon
                          icon={faEllipsisVertical}
                          style={{ color: "#6f7276" }}
                          onClick={() => toggleCommentDropdown(index)}
                          data-testid={`dropdown-icon-${comment.id}`}
                        />
                      </span>
                    </div>
                  )}
                  {/* {console.log('isOwner:', isOwner)}
                                    {console.log('commentDropdownIndex:', commentDropdownIndex)}
                                    {console.log('index:', index)} */}

                  {isOwner && commentDropdownIndex === index && (
                    <div
                      ref={(el) =>
                        el ? (dropdownRefs.current[index] = el) : null
                      }
                      className="dropdown-menu"
                    >
                      <button
                        onClick={() => handleEditComment(index, comment.text)}
                        data-testid="dropdown-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        data-testid="dropdown-delete"
                      >
                        Delete
                      </button>
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
                <button
                  data-testid="reply-button"
                  onClick={() => handleReplyFocus(index)}
                >
                  Reply
                </button>

                {showReplyInput && focusedReplyIndex === index && (
                  <CreateReply
                    ref={(el) => (replyInputRefs.current[index] = el)}
                    commentId={comment.id}
                    onReplyAdded={handleReplyAdded}
                    onCancel={() => {
                      setShowReplyInput(false);
                      setFocusedReplyIndex(null);
                    }}
                  />
                )}
                <div>
                  <br />
                  {hasReplies && (
                    <span
                      className="reply-toggle"
                      onClick={() => toggleRepliesVisibility(comment.id)}
                      data-testid="toggle-replies"
                    >
                      <FontAwesomeIcon
                        data-testid={`reply-toggle-comment-${comment.id}`}
                        icon={isVisible ? faChevronUp : faChevronDown}
                      />
                      &nbsp;
                      {commentReplies.length}{" "}
                      {commentReplies.length === 1 ? "reply" : "replies"}
                    </span>
                  )}
                </div>
              </div>

              {isVisible && (
                <div className="replies">
                  {commentReplies.map((reply) => {
                    const isReplyOwner =
                      isAuthenticated && reply.userId?._id === user?.id;
                    return (
                      <div key={reply.id} className="reply">
                        <img src={userProfile} className="reply-image" alt="" />
                        <div className="reply-detail">
                          <div className="reply-header">
                            {editReplyIndex !== index ? (
                              <div>
                                <span className="reply-channel-name">
                                  {reply.channelName}{" "}
                                </span>
                                <span className="reply-moments">
                                  {moment(reply.createdAt).fromNow()}
                                </span>
                              </div>
                            ) : null}
                            <div className="reply-actions">
                              {editReplyIndex !== index && (
                                <div className="icon-circle">
                                  <span>
                                    <FontAwesomeIcon
                                      icon={faEllipsisVertical}
                                      style={{ color: "#6f7276" }}
                                      onClick={() =>
                                        toggleReplyDropdown(
                                          comment.id,
                                          reply.id
                                        )
                                      }
                                      data-testid={`dropdown-icon-reply-${reply.id}`}
                                    />
                                  </span>
                                </div>
                              )}
                              {isReplyOwner && reply.dropdownOpen && (
                                <div
                                  className="dropdown-menu"
                                  ref={(el) =>
                                    el
                                      ? (replyDropdownRefs.current[reply.id] =
                                          el)
                                      : null
                                  }
                                  data-testid={`reply-dropdown-${reply.id}`}
                                >
                                  <button
                                    onClick={() => {
                                      handleEditReply(reply.id, reply.text);
                                      toggleReplyDropdown(comment.id, reply.id);
                                    }}
                                    data-testid="dropdown-reply-edit"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteReply(reply.id)}
                                    data-testid="dropdown-reply-delete"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          {editReplyId === reply.id ? (
                            <UpdateReply
                              replyId={reply.id}
                              reply={reply}
                              onUpdateReply={handleUpdateReplyAdded}
                              cancelEdit={handleCancelEditReply}
                              channelName={reply.channelName}
                              // initialText={editReplyText}
                            />
                          ) : (
                            <p>{reply.text}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
