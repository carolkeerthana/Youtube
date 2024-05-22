import { useState } from 'react';
import './LoginPage.css';
import { Link, useNavigate } from "react-router-dom";

function LoginPage(){
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name,value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        const loginData = {
            email: formData.email,
            password: formData.password
        };
        console.log(loginData)

        try {
            const response = await fetch('https://apps.rubaktechie.me/api/v1/auth/user/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
            });
            console.log(response)
        
            if(!response.ok){
                const errorData = await response.json();
                setError(errorData.message || 'An error occurred. Please try again.');
                return;
            }
    
        const resData = await response.json();
        const token = resData.token;
    
        localStorage.setItem('token', token);
        navigate('/');
        } catch (error) {
            setError(error.message);
        }
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
                <form onSubmit={handleSubmit} className='login-RightSide'>
                <div className={`input-container ${emailFocused ? 'focused' : ''}`}>
                    <label htmlFor="email" className="floating-label">Email</label>
                    <input  
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={(e) => setEmailFocused(e.target.value !== '')}
                    required
                    />
                </div>
                <div className={`input-container ${passwordFocused ? 'focused' : ''}`}>
                <label htmlFor="password" className="floating-label">Password</label>
                    <input  
                    type="password" 
                    name="password"
                    pattern="^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={(e) => setPasswordFocused(e.target.value !== '')}
                    required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <p className='forgot-password'>forgot password?</p>    
                <div className='button-container'>
                    <Link to="/signup">
                        <button className="create-account" type='button'>create account</button>
                    </Link>
                    <button className='sign-in' type='submit'>sign in</button>   
                </div>               
                </form>
                </div>
        </div>
        </div>
    )
}

export default LoginPage;

// export async function action({request}){
//     // to get data from the form
//     const data = await request.formData();
//     const registerData = {
//         email: data.get('email'),
//         password: data.get('password')
//     };

    
//     }