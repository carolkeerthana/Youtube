import React, { useState } from "react";

const FormInput = ({ label, errorMessage, onChange, onBlur, id, ...inputProps }) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
}

const handleBlur = (e) => {
    setFocused(e.target.value !== '');
    if (onBlur) onBlur(e); // Call parent onBlur if provided
}

  return (
    <div className={`formInput ${errorMessage ? 'error' : ''} ${focused ? 'focused' : ''}`}>
      <label htmlFor={id} className="floating-label">
        {label}
      </label>
      <input
        id={id}
        className="input-container"
        {...inputProps}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
};

export default FormInput;
