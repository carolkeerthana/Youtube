import { useNavigate } from "react-router-dom";
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
        let errors = {};
        if(!formData.email) errors.email = "Enter an email";
        if(!formData.channel) errors.channel = "Enter channel name";
        if(!formData.password) errors.password = "Enter password";
        if(!formData.confirmPassword) errors.confirmPassword = "Enter confirm password";

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();

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
       <div>
             <div>
                <h1>UTube</h1>
                <div>
                <h2>Create a UTube Account</h2>
                </div>
             </div>
             <form onSubmit={handleSubmit}>
                <FieldValidation
                formData={formData}
                fieldErrors={fieldErrors}
                handleChange={handleChange}
                />     
                <button type="submit">sign up</button>
             </form>
             {error && <p className="error">{error}</p>}
        </div>
    )
}

export default RegisterPage;