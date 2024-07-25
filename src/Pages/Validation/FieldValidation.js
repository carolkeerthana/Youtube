import React, { forwardRef, useImperativeHandle, useState } from "react";
import "../Register/RegisterPage.css";
import { FaExclamationCircle } from "react-icons/fa";

const FieldValidation = ({
  email,
  setEmail,
  channel,
  setChannel,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  fieldErrors,
  setFieldErrors,
  validateAllFields,
}) => {
  const [emailFocused, setEmailFocused] = useState(false);
  const [channelFocused, setChannelFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData({ ...formData, [name]: value });
  //     // validateAllFields(name, value);
  //   };

  // const validateAllFields = (name, value) => {
  //     let errors = { ...fieldErrors };

  //     // Check if all fields are empty
  //     if (
  //         formData.email.trim() === '' &&
  //         formData.channel.trim() === '' &&
  //         formData.password.trim() === '' &&
  //         formData.confirmPassword.trim() === ''
  //     ) {
  //         errors.allFields = 'All fields are required';
  //     } else {
  //         errors.allFields = ''; // Reset error message if fields are not empty
  //     }

  //     switch (name) {
  //         case 'email':
  //             errors.email = !value && emailFocused ? 'Email is required' : !validateEmail(value) ? 'Enter a valid email' : '';
  //             break;
  //         case 'channel':
  //             errors.channel = !value && channelFocused ? 'Channel name is required' : value.length < 3 ? 'Channel name must be at least 3 characters long' : '';
  //             break;
  //         case 'password':
  //             errors.password = !value && passwordFocused ? 'Password is required' : value.length < 8 ? 'Password must be at least 8 characters long' : '';
  //             break;
  //         case 'confirmPassword':
  //             errors.confirmPassword = !value && confirmPasswordFocused ? 'Confirm password is required' : value !== formData.password ? 'Passwords do not match' : '';
  //             break;
  //         default:
  //             break;
  //     }

  //     setFieldErrors(errors);
  //     return Object.keys(errors).length === 0;
  // };

  // useImperativeHandle(ref, () => ({
  //     validateAllFields
  // validateAllFields: () => {
  //     const isValidEmail = validateField('email', formData.email);
  //     const isValidChannel = validateField('channel', formData.channel);
  //     const isValidPassword = validateField('password', formData.password);
  //     const isValidConfirmPassword = validateField('confirmPassword', formData.confirmPassword);
  //     return isValidEmail && isValidChannel && isValidPassword && isValidConfirmPassword;
  // }
  // }));

  // const validateEmail = (email) => {
  //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //     return emailRegex.test(email);
  // };

  // const validatePassword = (password) => {
  //     return password.length>=8;
  // }
  const handleBlur = (e) => {
    const { name, value } = e.target;
    // validateAllFields(name, value);
  };

  return (
    <div className="right-side">
      <div
        className={`input-container ${
          emailFocused || fieldErrors.email ? "focused" : ""
        } ${fieldErrors.email ? "error-border" : ""}`}
      >
        <label
          htmlFor="email"
          className={`floating-label ${
            fieldErrors.email ? "error-border" : ""
          }`}
        >
          Email
        </label>
        <input
          data-testid="email"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setEmailFocused(true)}
          onBlur={(e) => setEmailFocused(e.target.value !== "")}
          required=""
        />
        {fieldErrors.email && (
          <p className="error">
            <FaExclamationCircle /> {fieldErrors.email}
          </p>
        )}
      </div>
      <div
        className={`input-container ${
          channelFocused || fieldErrors.channel ? "focused" : ""
        } ${fieldErrors.channel ? "error-border" : ""}`}
      >
        <label
          htmlFor="channel"
          className={`floating-label ${
            fieldErrors.channel ? "error-border" : ""
          }`}
        >
          Channel Name
        </label>
        <input
          data-testid="channel"
          id="channel"
          type="text"
          name="channel"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          onFocus={() => setChannelFocused(true)}
          onBlur={(e) => setChannelFocused(e.target.value !== "")}
        />
        {fieldErrors.channel && (
          <p className="error">
            <FaExclamationCircle /> {fieldErrors.channel}
          </p>
        )}
      </div>
      <div className="password-container">
        <div
          className={`input-container ${
            passwordFocused || fieldErrors.password ? "focused" : ""
          } ${fieldErrors.password ? "error-border" : ""}`}
        >
          <label
            htmlFor="password"
            className={`floating-label ${
              fieldErrors.password ? "error-border" : ""
            }`}
            id="password-label"
          >
            Password
          </label>
          <input
            data-testid="password"
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={(e) => setPasswordFocused(e.target.value !== "")}
          />
          {fieldErrors.password && (
            <p className="error password-error">
              <FaExclamationCircle /> {fieldErrors.password}
            </p>
          )}
        </div>
        <div
          className={`input-container ${
            confirmPasswordFocused || fieldErrors.confirmPassword
              ? "focused"
              : ""
          } ${fieldErrors.confirmPassword ? "error-border" : ""}`}
        >
          <label
            htmlFor="confirmPassword"
            className={`floating-label ${
              fieldErrors.confirmPassword ? "error-border" : ""
            }`}
            id="confirm-label"
          >
            Confirm Password
          </label>
          <input
            data-testid="confirmPassword"
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => setConfirmPasswordFocused(true)}
            onBlur={(e) => setConfirmPasswordFocused(e.target.value !== "")}
          />
          {fieldErrors.confirmPassword && (
            <p className="error confirmPwd-error">
              <FaExclamationCircle /> {fieldErrors.confirmPassword}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldValidation;
