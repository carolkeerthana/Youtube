import React, { useState } from 'react'
import userProfile from '../../assets/user_profile.jpg';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons/faEllipsisVertical';
import { useAuth } from '../../util/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createReply } from './Api/CreateReplyApi';

const CreateReply = ({commentId, onReplyAdded, isAuthenticated}) => {
    const [newReply, setNewReply] = useState('');
    const [focused, setFocused] = useState(false);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    // const [isEditing, setIsEditing] = React.useState(false);
    // const [editText, setEditText] = React.useState(reply.text);
    const navigate = useNavigate();
    // const {isAuthenticated} = useAuth();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleReplyChange = (e) => {
        setNewReply(e.target.value);
    };

    const handleReplySubmit = async(e) => {
            e.preventDefault();
    
            if(!isAuthenticated){
                navigate('/signin');
                return;
            }
    
            const commentsData = {
                commentId: commentId,
                text: newReply,
            };
            console.log(commentsData)
    
            try {
                const response = await createReply(commentsData);
                if ((response.success || response.sucess) && response.data) {
                    onReplyAdded(response.data);
                    setNewReply('');
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

    // const handleEdit = () => {
    //     setIsEditing(true);
    //     setDropdownOpen(false);
    // };

    // const handleSaveEdit = () => {
    //     onUpdateReply({ ...reply, text: editText });
    //     setIsEditing(false);
    // };

    // const handleDelete = () => {
    //     onDeleteReply(reply.id);
    // };

  return (
    <div className='reply'>
            <img src={userProfile} alt='' />
            <div className='reply-detail'>
                <div className='reply-header'>
                    <input className={`input-field ${focused ? 'visible' : ''}`}
                    type='text'
                    placeholder='Add a public comment...'
                    value={newReply}
                    onChange={handleReplyChange}    
                    onFocus={handleFocus}
                    onBlur={()=>!newReply && setFocused(false)}
                />
                <div className={`comment-buttons ${focused ? 'visible' : ''}`}>
                    <button onClick={()=> {setNewReply(''); setFocused(false); }}>CANCEL</button>
                    <button onClick={handleReplySubmit}>REPLY</button>
                 </div>
                </div>
            </div>
        </div>
  )
}

export default CreateReply
