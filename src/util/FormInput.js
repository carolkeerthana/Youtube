import React, { useEffect, useState } from "react";
import "../Pages/Register/RegisterPage.css";
import "./FormInput.css";
import { FaExclamationCircle } from "react-icons/fa";

const FormInput = ({
  label,
  errorMessage,
  onChange,
  onBlur,
  id,
  value,
  dataTestId,
  ...inputProps
}) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = (e) => {
    setFocused(e.target.value !== "");
    // if (onBlur) onBlur(e); // Call parent onBlur if provided
  };

  useEffect(() => {
    if (value) {
      setFocused(true);
    } else if (errorMessage) {
      setFocused(false);
    }
  }, [value, errorMessage]);

  return (
    <div
      className={`input-container ${focused || errorMessage ? "focused" : ""} ${
        errorMessage ? "error-border" : ""
      }`}
      data-testid={`${dataTestId}-container`}
    >
      <label
        htmlFor={id}
        className={`floating-label ${errorMessage ? "error-border" : ""}`}
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        {...inputProps}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder=" "
        required
        data-testid={dataTestId}
      />
      {errorMessage && (
        <p className="error">
          <FaExclamationCircle /> {errorMessage}
        </p>
      )}
    </div>
  );
};

export default FormInput;
