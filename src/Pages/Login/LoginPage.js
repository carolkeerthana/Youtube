import { useState } from 'react';
import './LoginPage.css';
import { Link, useNavigate } from "react-router-dom";
import { FaExclamationCircle } from 'react-icons/fa';
import { loginUser } from './LoginApi';

function LoginPage(){
    const [formData, setFormData] = useState({
        email: '',
        password: ''    
    })
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name,value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateAllFields = () => {
        const errors = {};

        if (!formData.email) {
            errors.email = 'Enter an email';
        } else if (!validateEmail(formData.email)) {
            errors.email = 'Enter a valid email';
        }

        if (!formData.password) {
            errors.password = 'Enter password';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!validateAllFields()) {
            return;
        }
        const loginData = {
            email: formData.email,
            password: formData.password
        };
        console.log(loginData)

        
        try {
            const response = await loginUser(formData);
            localStorage.setItem('token', response.token);
            navigate('/');
            }catch{
                navigate('/error');
            }
        
            // if(!response.ok){
            //     const errorData = await response.json();
            //     setError(errorData.message || 'An error occurred. Please try again.');
            //     return;
            // }
    }

    return(
        <div className='login'>
        <div className='login-container'>
             <div className='login-LeftSide'>
                <h1 data-testid='utube-text'>UTube</h1>
                <div className='signin-text'>
                <br/>
                <h2 data-testid='signin-text'>Sign in</h2>
                <span data-testid='text'>to continue to UTube</span>
                </div>
             </div>
             <div className='login-RightSide'>
                <form onSubmit={handleSubmit} noValidate className='login-RightSide' autocomplete="off">
                <div className={`input-container ${emailFocused ? 'focused' : ''}`}>
                    <label htmlFor="email" className={`floating-label ${fieldErrors.email ? 'error-border' : ''}`}>Email</label>
                    <input 
                    id="email" 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setEmailFocused(true)}
                    // onBlur={(e) => setEmailFocused(e.target.value === '')}
                    />
                    {fieldErrors.email && <p className="error-message"><FaExclamationCircle />{fieldErrors.email}</p>}
                </div>
                <div className={`input-container ${passwordFocused ? 'focused' : ''}`}>
                    <label htmlFor="password" className={`floating-label ${fieldErrors.password ? 'error-border' : ''}`}>Password</label>
                    <input 
                    id="password"
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={(e) => setPasswordFocused(e.target.value !== '')}
                    />
                    {fieldErrors.password && <p className="error-message"><FaExclamationCircle />{fieldErrors.password}</p>}
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <p className='forgot-password'>
                        <Link to={'/forgotpassword'}>forgot password?</Link></p>
                        <div className='button-container'>
                            <Link to="/signup">
                                <button className="create-account" type='button'>create account</button>
                            </Link>
                                <button className='sign-in' type='submit' name='submit' data-testid="signin-page">sign in</button> 
                        </div> 
                    </form>
                    </div>
                    </div>
                    </div>
)}

export default LoginPage;