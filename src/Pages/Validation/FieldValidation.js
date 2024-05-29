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
        // validateField(name, value);
    };

    const validateField = ((name, value) =>{
        let errors = {...fieldErrors};

        switch(name){
            case 'email': 
            if(!value){
                errors.email = "hello email";
            }else if(!validateEmail(value)){
                errors.email = "Enter a valid email";
            }else{
                delete errors.email;
            }
            break;
            case 'channel': 
            if(!value){
                errors.channel = "Enter channel name";
            }else if(value.length <3){
                errors.channel = "Channel name must be at least 3 characters long";
            }else{
                delete errors.channel;
            }
            break;
            case 'password': 
            if(!value){
                errors.password = "Enter password";
            }else if(!validatePassword(value)){
                errors.password = "Password must be at least 8 characters long";
            }else{
                delete errors.password;
            }
            break;
            case 'confirmPassword': 
            if(!value){
                errors.confirmPassword = "Enter confirm password";
            }else if(value !== formData.password){
                errors.confirmPassword = "Passwords do not match";
            }else{
                delete errors.confirmPassword;
            }
            break;
            default: break;
        }
        setFieldErrors(errors);
    }, [fieldErrors, formData.password, setFieldErrors]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length>=8;
    }

  return (
      <div className='right-side'>
        <div className={`input-container ${emailFocused || fieldErrors.email ? 'focused' : ''}`}>
            <label htmlFor="email" className="floating-label">Email</label>
            <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setEmailFocused(true)}
                onBlur={(e) => setEmailFocused(e.target.value !== '')} 
            />
            {fieldErrors.email && <p className="error"><FaExclamationCircle /> {fieldErrors.email}</p>}
        </div>
        <div className={`input-container ${channelFocused || fieldErrors.channel ? 'focused' : ''}`}>
            <label htmlFor="channel" className="floating-label">Channel Name</label>
            <input 
                type="text" 
                name="channel"
                value={formData.channel}
                onChange={handleChange}
                onFocus={() => setChannelFocused(true)}
                onBlur={(e) => setChannelFocused(e.target.value !== '')}  
            />
            {fieldErrors.channel && <p className="error"><FaExclamationCircle /> {fieldErrors.channel}</p>}
        </div>
        <div className='password-container'>
        <div className={`input-container ${passwordFocused || fieldErrors.password ? 'focused' : ''}`}>
            <label htmlFor="password" className="floating-label" id='pwd-label'>Password</label>
            <input
                className="pwd-input"  
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={(e) => setPasswordFocused(e.target.value !== '')}  
            />
            {fieldErrors.password && <p className="error password-error"><FaExclamationCircle /> {fieldErrors.password}</p>}
        </div>
        <div className={`input-container ${confirmPasswordFocused || fieldErrors.confirmPassword ? 'focused' : ''}`}>
            <label htmlFor="confirmPassword" className="floating-label" id='confirm-label'>Confirm Password</label>
            <input 
                className="confirm-input"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={(e) => setConfirmPasswordFocused(e.target.value !== '')}
            />
            {fieldErrors.confirmPassword && <p className="error confirmPwd-error"><FaExclamationCircle /> {fieldErrors.confirmPassword}</p>}
        </div>
        </div>
      </div>
  )
}

export default FieldValidation