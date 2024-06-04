import { Link, useNavigate } from "react-router-dom";
import './RegisterPage.css';
import { useRef, useState } from "react";
import FieldValidation from "../Validation/FieldValidation";
import { registerUser } from "./RegisterApi";

function RegisterPage(){
    const [formData, setFormData] = useState({
        email: '',
        channel: '',
        password: '',
        confirmPassword: ''
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();
 
    const validateAllFields = () => {
        const errors = {};

        if (!formData.email) {
            console.log("valid")
            errors.email = 'Enter an email';
        } else if (!validateEmail(formData.email)) {
            console.log("not valid")
            errors.email = 'Enter a valid email';
        }

        if (!formData.channel) {
            errors.channel = 'Enter channel name';
        } else if (formData.channel.length < 3) {
            console.log("ch")
            errors.channel = 'Channel name must be at least 3 characters long';
        }

        if (!formData.password) {
            errors.password = 'Enter password';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Enter confirm password';
        } else if (formData.confirmPassword !== formData.password) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async(e) =>{
        e.preventDefault();

        if (validateAllFields()) {
            try {
                const response = await registerUser(formData);
                localStorage.setItem('token', response.token);
                navigate('/signin');
            } catch (error) {
                navigate('/error');
            }
        }

        // const registerData = {
        //     email: formData.email,
        //     channelName: formData.channel,
        //     password: formData.password,
        //     confirmPassword: formData.confirmPassword
        // }
        // try {
        //     console.log(registerData)
        //     const resData = await registerUser(registerData);
        //     const token = resData.token;

        //     localStorage.setItem('token', token);

        //     navigate('/signin');
        // } catch (error) {
        //     navigate('/error');
        // }     
    }
    return(
       <div className="register">
        <div className="register-container">
             <div className="register-leftSide">
                <h1 data-testid="utube-text">UTube</h1>
                <div>
                <h2 data-testid="static-text">Create a UTube Account</h2>
                </div>
             </div>
             <div className="register-rightSide">
             <form onSubmit={handleSubmit} noValidate autocomplete="off">
                <FieldValidation
                validateAllFields={validateAllFields}
                   formData={formData} 
                   setFormData={setFormData}
                   fieldErrors={fieldErrors}
                   setFieldErrors={setFieldErrors}
                />
                <div className='button-container'>
                    <Link to="/signin">
                        <button className="signin" type='button'>Sign in</button>
                    </Link>    
                <button type="submit" className='sign-up'>sign up</button>
                </div>
             </form>
             </div>
        </div>
        </div>
    )
}

export default RegisterPage;