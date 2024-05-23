import { Link, useNavigate } from "react-router-dom";
import './RegisterPage.css';
import { useState } from "react";
import FieldValidation from "../Validation/FieldValidation";

function RegisterPage(){
    const [formData, setFormData] = useState({
        email: '',
        channel: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();
    
    const handleChange = (e) =>{
        const {name,value} = e.target;
        setFormData({...formData, [name]: value})
    };

    const validateRegister = () => {

        return Object.keys(fieldErrors).length === 0;
    }

    const allFieldsEmpty = () => {
        return Object.values(formData).every(value => value.trim() === '');
    };

    const handleSubmit = async(e) =>{
        e.preventDefault();

        if (allFieldsEmpty()) {
            setFieldErrors({
                email: "Enter an email",
                channel: "Enter channel name",
                password: "Enter password",
                confirmPassword: "Enter confirm password"
            });
            return;
        }

        if (!validateRegister()) return;

        const registerData = {
            email: formData.email,
            channelName: formData.channel,
            password: formData.password,
            confirmPassword: formData.confirmPassword
        }

        console.log(registerData)

        try {
            const response = await fetch('https://apps.rubaktechie.me/api/v1/auth/user/register',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData)
            });
            console.log(response)

            if(!response.ok){
                const errorData = await response.json();
                console.error('Error Data:', errorData);
                setError(errorData.message || 'Registration failed');
                return;
            }

            const resData = await response.json();
            const token = resData.token;

            localStorage.setItem('token', token);

            navigate('/signin');
        } catch (error) {
            console.error('Error:', error);
            setError("An error occurred. Please try again");
        }
    }
    return(
       <div className="register">
        <div className="register-container">
             <div className="register-leftSide">
                <h1>UTube</h1>
                <div>
                <h2>Create a UTube Account</h2>
                </div>
             </div>
             <div className="register-rightSide">
             <form onSubmit={handleSubmit}>
                <FieldValidation
                   formData={formData} 
                   fieldErrors={fieldErrors}
                   handleChange={handleChange}
                   setFieldErrors={setFieldErrors}
                />
                <div className='button-container'>
                    <Link to="/signin">
                        <button className="signin" type='button'>Sign in</button>
                    </Link>    
                <button type="submit" className='sign-up'>sign up</button>
                </div>
             </form>
             {error && <p className="error">{error}</p>}
             </div>
        </div>
        </div>
    )
}

export default RegisterPage;