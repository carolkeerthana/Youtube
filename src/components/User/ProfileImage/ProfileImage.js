import React from 'react'

const ProfileImage = ({name}) => {
    const nameParts = name.split(" ");
    const firstLetter = nameParts[0] ? nameParts[0][0] : "";

  return (
    <div>
      <span className='profile-image'>
        {firstLetter}
      </span>
    </div>
  )
}

export default ProfileImage
