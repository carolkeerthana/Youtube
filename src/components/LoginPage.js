import { useState } from 'react';
import './LoginPage.css';
import { Form, Link, json, redirect } from "react-router-dom";

function LoginPage(){
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    return(
        <div className='login'>
       <div className='login-container'>
             <div className='login-LeftSide'>
                <h1>UTube</h1>
                <div>
                <h2>Sign in</h2>
                <span>to continue to UTube</span>
                </div>
             </div>
                <Form method="post" className='login-RightSide'>
                <div className={`input-container ${emailFocused ? 'focused' : ''}`}>
                    <label htmlFor="email" className="floating-label">Email</label>
                    <input id="email" type="email" name="email"
                    onFocus={() => setEmailFocused(true)}
                    onBlur={(e) => setEmailFocused(e.target.value !== '')}/>
                </div>
                <div className={`input-container ${passwordFocused ? 'focused' : ''}`}>
                <label htmlFor="password" className="floating-label">Password</label>
                    <input id="password" type="password" name="password"
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={(e) => setPasswordFocused(e.target.value !== '')}/>
                </div>
                    <p>forgot password?</p>    
                <div className='button-container'>
                    <Link to="/signup">
                    <button className="create-account">create account</button></Link>
                    <button className='sign-in'>sign in</button>   
                </div>               
                </Form>
        </div>
        </div>
    )
}

export default LoginPage;

export async function action({request}){
    // to get data from the form
    const data = await request.formData();
    const registerData = {
        email: data.get('email'),
        password: data.get('password')
    };

    console.log(registerData)

    const response = await fetch('https://apps.rubaktechie.me/api/v1/auth/user/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
    });
    console.log(response)

    console.log(await response.json())
    if(response.status === 404 || response.status === 401){
        return response;
    }

    if(!response.ok){
        throw json({message: 'Bad request'}, {status: 500})
    }

    const resData = await response.json();
    const token = resData.token;

    localStorage.setItem('token', token);

    return redirect('/home');
    }