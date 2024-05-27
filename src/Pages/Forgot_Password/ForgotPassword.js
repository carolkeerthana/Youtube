import React, { useState } from 'react'
import './ForgotPassword.css'
import FormInput from './FormInput';
import { FaExclamationCircle } from 'react-icons/fa';

const ForgotPassword = () => {

      const [formData, setFormData] = useState({
        email: ''
      });
      const [emailFocused, setEmailFocused] = useState(false);
      const [error, setError] = useState(null);
      const [successMessage, setSuccessMessage] = useState(null);
      const [fieldError, setFieldError] =  useState(null);
    
      const inputs = [
        {
          id:1,
          name:"email",
          type:"email",
          placeholder:"Email",
          label:"Email",
          required: true,
        }
      ]
      
      const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name] : value})

        // Clear fieldError when the user starts typing in the email field
        if (name === 'email' && fieldError) {
          setFieldError(null);
        }
      };

      const emptyField = () => {
        return Object.values(formData).every(value => value.trim() === '');
    };

      const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
  
      const handleSubmit = async(e) =>{
        e.preventDefault();

        if (emptyField()) {
        setFieldError('Enter an email.');
        return;
        }

        if (!validateEmail(formData.email)) {
          setFieldError('Please enter a valid email address!');
          return;
        }
        
        const emailData = {
            email : formData.email
        }
        console.log(emailData)

      try {
        const response = await fetch('https://apps.rubaktechie.me/api/v1/auth/forgotpassword',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
        });
        console.log(response)
    
        if(!response.ok){
            const errorData = await response.json();
            setError(errorData.message || 'An error occurred. Please try again.');
            return;
        }

        setSuccessMessage('An email has been sent to your email address to reset your password ');
        setFieldError(null);
        } catch (error) {
            setError(error.message);
        }
};

  return (
    <div className='forgotPassword'>
    <div className='forgot-password-container'>
      <div className='forgotPwd-leftSide'>
        <h1>UTube</h1>
        <h2>Account recovery</h2>
      </div>
      <div className='forgotPwd-rightSide'> 
      <form onSubmit={handleSubmit} noValidate>
        <p className='para'>Enter the email address to get the reset password link</p>
        {!successMessage && inputs.map(input =>(
          <FormInput key={input.id} {...input} value={formData[input.name]} onChange={handleChange}/>
        ))}
        {fieldError && <p className="error"><FaExclamationCircle />{fieldError}</p>}
        {successMessage ? (
        <span className="success">{successMessage}</span>) :(
        <div className='button-container'>
        <button type='submit' className='email-submit'>submit</button>
        </div>
        )}
      </form> 
      </div>
    </div>
    </div>
  )
}

export default ForgotPassword;