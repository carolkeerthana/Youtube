import React, { useState } from 'react'

const FormInput = (props) => {
    const [focused, setFocused] = useState(false);
    const {label, onChange, id, ...inputProps} = props;

    const handleFocus = () => {
        setFocused(true);
    }
    
  return (
    <div className='formInput'>
        <label className="floating-label">{label}</label>
        <input className='input-container'
        {...inputProps}
        onChange={onChange}
        onBlur={handleFocus}
        focused={focused.toString()}
        onFocus={() => inputProps.name && setFocused(true)}
        />   
    </div>
  )
}

export default FormInput
