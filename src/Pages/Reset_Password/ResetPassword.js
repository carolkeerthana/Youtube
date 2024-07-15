import React, { useState } from 'react';
import './ResetPassword.css';
import { FaExclamationCircle } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from './ResetPasswordApi';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useParams();

  const validateAllFields = () => {
    const errors = {};

    if (!password) {
      errors.password = 'Enter password';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAllFields()) {
      return;
    }

    try {
      const response = await resetPassword(token, password);

      if (response.success) {
        setSuccessMessage('Your password has been reset successfully.');
        setFieldErrors({});
        setPassword('');
        setConfirmPassword('');
        navigate('/signin?resetSuccess=true'); // Pass success message as query parameter
      } else {
        setError('Password reset failed. Please try again.');
      }
    } catch (error) {
      navigate('/error');
    }
  };

  return (
    <div className="resetPassword">
      <div className="reset-password-container">
        <div className="resetPwd-leftSide">
          <h1 data-testid="utube-text">UTube</h1>
          <h2 data-testid="static-text">Reset your password</h2>
        </div>
        <div className="resetPwd-rightSide">
          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            {!successMessage && (
              <>
                <div className={`input-container ${passwordFocused ? 'focused' : ''}`} data-testid="password-container">
                  <label htmlFor="password" className={`floating-label ${fieldErrors.password ? 'error-border' : ''}`}>New Password</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={(e) => setPasswordFocused(e.target.value !== '')}
                  />
                  {fieldErrors.password && <p className="error-message"><FaExclamationCircle />&nbsp;{fieldErrors.password}</p>}
                </div>
                <div className={`input-container ${confirmPasswordFocused ? 'focused' : ''}`} data-testid="confirm-password-container">
                  <label htmlFor="confirmPassword" className={`floating-label ${fieldErrors.confirmPassword ? 'error-border' : ''}`}>Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={(e) => setConfirmPasswordFocused(e.target.value !== '')}
                  />
                  {fieldErrors.confirmPassword && <p className="error-message"><FaExclamationCircle />&nbsp;{fieldErrors.confirmPassword}</p>}
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="button-container">
                  <button type="submit" className="reset-submit">Reset Password</button>
                </div>
              </>
            )}
            {successMessage && (
              <span className="success">{successMessage}</span>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
