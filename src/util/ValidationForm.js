// util/ValidationForm.js

export const validateEmail = (email) => {
  if (!email) return "Enter an email";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? "" : "Enter a valid email";
};

export const validatePassword = (password) => {
  if (!password) return "Enter password";
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (password.length > 20) return "Password must not exceed 20 characters";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one digit";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "Password must contain at least one special character";
  return "";
};

// Validate confirm password function
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Enter confirm password";
  return password !== confirmPassword ? "Passwords do not match" : "";
};

// Validate channel function
export const validateUserName = (channelName) => {
  if (!channelName) return "Enter user name";
  return channelName.length < 3
    ? "User name must be at least 3 characters long"
    : "";
};

// Validate all fields function
const validateAllFields = (fields) => {
  const errors = {};

  if (fields.email !== undefined) {
    const emailError = validateEmail(fields.email);
    if (emailError) errors.email = emailError;
  }

  if (fields.password !== undefined) {
    const passwordError = validatePassword(fields.password);
    if (passwordError) errors.password = passwordError;
  }

  if (fields.confirmPassword !== undefined && fields.password !== undefined) {
    const confirmPasswordError = validateConfirmPassword(
      fields.password,
      fields.confirmPassword
    );
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  }

  if (fields.channelName !== undefined) {
    const channelError = validateUserName(fields.channelName);
    if (channelError) errors.channelName = channelError;
  }

  return errors;
};

export default validateAllFields;
