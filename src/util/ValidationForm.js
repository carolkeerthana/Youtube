import React from 'react'

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

    const validatePassword = (password) => {
    const errors = {};
    
    if (!password) {
        errors.password = 'Enter password';
    } else if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
    } else if (password.length > 20) { // Optional: set a maximum length
        errors.password = 'Password must not exceed 20 characters';
    } else if (!/[A-Z]/.test(password)) {
        errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(password)) {
        errors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(password)) {
        errors.password = 'Password must contain at least one digit';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.password = 'Password must contain at least one special character';
    }
    return errors;
};

  // Function to validate all fields
const validateAllFields = (email, password, confirmPassword, channel) => {
    const errors = {};
  
    if (!email) {
      errors.email = 'Enter an email';
    } else if (!validateEmail(email)) {
      errors.email = 'Enter a valid email';
    }
  
    if (!channel) {
      errors.channel = 'Enter channel name';
    } else if (channel.length < 3) {
      errors.channel = 'Channel name must be at least 3 characters long';
    }
  
    // Validate password and confirmPassword
    Object.assign(errors, validatePassword(password));
  
    if (!confirmPassword) {
      errors.confirmPassword = 'Enter confirm password';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
    }
  
    return errors;
  };
  
  const ValidationForm = ({ email, password, confirmPassword, channel, setFieldErrors }) => {
    const errors = validateAllFields(email, password, confirmPassword, channel);
    setFieldErrors(errors);
    return null; // This component does not render anything
  };

export default ValidationForm
