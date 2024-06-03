import React, { useState } from 'react'

const FormInput = (props) => {
    const [emailFocused, setEmailFocused] = useState(false);
    const {label, onChange, id, ...inputProps} = props;
    
  return (
    <div className={`formInput ${emailFocused ? 'focused' : ''}`}>
        <label htmlFor="inputField" className="floating-label">{label}</label>
        <input 
        id="inputField"
        className='input-container'
        {...inputProps}
        onChange={onChange}
        onFocus={() => setEmailFocused(true)}
        onBlur={(e) => setEmailFocused(e.target.value !== '')}
        />   
    </div>
  )
}

export default FormInput