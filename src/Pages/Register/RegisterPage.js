import { Link, useNavigate } from "react-router-dom";
import './RegisterPage.css';
import { useState } from "react";
import FieldValidation from "../Validation/FieldValidation";
import { registerUser } from "./RegisterApi";

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

    // const validateRegister = () => {
    //     return Object.keys(fieldErrors).length === 0;
    // }

    const allFieldsEmpty = () => {
        return Object.values(formData).every(value => value.trim() === '');
    };

    const handleSubmit = async(e) =>{
        e.preventDefault();

        console.log("submit")
        if (allFieldsEmpty()) {
            setFieldErrors({
                email: "Enter an email",
                channel: "Enter channel name",
                password: "Enter password",
                confirmPassword: "Enter confirm password"
            });
            return;
        }

        // console.log('Before validateRegister');
        // if (!validateRegister()) {
        //     console.log('Validation failed');
        //     return;
        // }
        // console.log('After validateRegister');

        const registerData = {
            email: formData.email,
            channelName: formData.channel,
            password: formData.password,
            confirmPassword: formData.confirmPassword
        }
        try {
            console.log(registerData)
            const resData = await registerUser(registerData);
            const token = resData.token;

            localStorage.setItem('token', token);

            navigate('/signin');
        } catch (error) {
            setError(error.message || "An error occurred. please try again");
            navigate('/error', { state: { error } });
        }     
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
             <form onSubmit={handleSubmit}>
                <FieldValidation
                   formData={formData} 
                   setFormData={setFormData}
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