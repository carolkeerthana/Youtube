import React, { useState } from 'react'
import '../Register/RegisterPage.css'
import { FaExclamationCircle } from 'react-icons/fa';

const FieldValidation = ({formData, setFormData, fieldErrors, setFieldErrors}) => {
    const [emailFocused, setEmailFocused] = useState(false);
    const [channelFocused, setChannelFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

    const handleChange = (e) =>{
        const {name,value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const validateField = (name, value) => {
        let errors = { ...fieldErrors };
    
        switch (name) {
            case 'email':
                errors.email = !value && emailFocused ? 'Email is required' : !validateEmail(value) ? 'Enter a valid email' : '';
                break;
            case 'channel':
                errors.channel = !value && channelFocused ? 'Channel name is required' : value.length < 3 ? 'Channel name must be at least 3 characters long' : '';
                break;
            case 'password':
                errors.password = !value && passwordFocused ? 'Password is required' : value.length < 8 ? 'Password must be at least 8 characters long' : '';
                break;
            case 'confirmPassword':
                errors.confirmPassword = !value && confirmPasswordFocused ? 'Confirm password is required' : value !== formData.password ? 'Passwords do not match' : '';
                break;
            default:
                break;
        }
    
        setFieldErrors(errors);
    };
    

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length>=8;
    }
    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    }

  return (
      <div className='right-side'>
        <div className={`input-container ${emailFocused || fieldErrors.email ? 'focused' : ''} ${fieldErrors.email ? 'error-border' : ''}`}>
        <label htmlFor="email" className={`floating-label ${fieldErrors.email ? 'error-border' : ''}`}>Email</label>
            <input 
                data-testid="email"
                type="email" 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setEmailFocused(true)}
                onBlur={handleBlur} 
            />
            {fieldErrors.email && <p className="error"><FaExclamationCircle /> {fieldErrors.email}</p>}
        </div>
        <div className={`input-container ${channelFocused || fieldErrors.channel ? 'focused' : ''} ${fieldErrors.channel ? 'error-border' : ''}`}>
        <label htmlFor="channel" className={`floating-label ${fieldErrors.channel ? 'error-border' : ''}`}>Channel Name</label>
            <input 
                data-testid="channel"
                id="channel"
                type="text" 
                name="channel"
                value={formData.channel}
                onChange={handleChange}
                onFocus={() => setChannelFocused(true)}
                onBlur={handleBlur}  
            />
            {fieldErrors.channel && <p className="error"><FaExclamationCircle /> {fieldErrors.channel}</p>}
        </div>
        <div className='password-container'>
        <div className={`input-container ${passwordFocused || fieldErrors.password ? 'focused' : ''} ${fieldErrors.password ? 'error-border' : ''}`}>
        <label htmlFor="password" className={`floating-label ${fieldErrors.password ? 'error-border' : ''}`} id='password-label'>Password</label>
            <input
                data-testid="password"
                id="password"
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={handleBlur}  
            />
            {fieldErrors.password && <p className="error password-error"><FaExclamationCircle /> {fieldErrors.password}</p>}
        </div>
        <div className={`input-container ${confirmPasswordFocused || fieldErrors.confirmPassword ? 'focused' : ''} ${fieldErrors.confirmPassword ? 'error-border' : ''}`}>
        <label htmlFor="confirmPassword" className={`floating-label ${fieldErrors.confirmPassword ? 'error-border' : ''}`} id='confirm-label'>Confirm Password</label>
            <input 
                data-testid="confirmPassword"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={handleBlur}
            />
            {fieldErrors.confirmPassword && <p className="error confirmPwd-error"><FaExclamationCircle /> {fieldErrors.confirmPassword}</p>}
        </div>
        </div>
      </div>
  )
}

export default FieldValidation