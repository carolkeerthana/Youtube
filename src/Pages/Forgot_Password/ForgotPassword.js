import React, { useState } from "react";
import "./ForgotPassword.css";
import FormInput from "./FormInput";
import { FaExclamationCircle } from "react-icons/fa";
import { forgotPasswordApi } from "./ForgotPasswordApi";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [fieldError, setFieldError] = useState(null);
  const navigate = useNavigate();

  const inputs = [
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Email",
      label: "Email",
      required: true,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear fieldError when the user starts typing in the email field
    if (name === "email" && fieldError) {
      setFieldError(null);
    }
  };

  const emptyField = () => {
    return Object.values(formData).every((value) => value.trim() === "");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emptyField()) {
      setFieldError("Enter an email");
      return;
    }

    if (!validateEmail(formData.email)) {
      setFieldError("Please enter a valid email address!");
      return;
    }

    const emailData = {
      email: formData.email,
    };
    console.log(emailData);

    try {
      const response = await forgotPasswordApi(formData);
      console.log("res:", response);

      if (response.success === true) {
        setSuccessMessage(
          "An email has been sent to your email address to reset your password"
        );
        setFieldError(null);
      } else {
        setError(response.error);
        setFormData({ email: "" });
        setFieldError(response.error);
      }
    } catch (error) {
      navigate("/error");
    }

    // if(!response.ok){
    //     const errorData = await response.json();
    //     setError(errorData.message || 'An error occurred. Please try again.');
    //     return;
    // }
  };

  return (
    <div className="forgotPassword">
      <div className="forgot-password-container">
        <div className="forgotPwd-leftSide">
          <h1 data-testid="utube-text">UTube</h1>
          <h2 data-testid="static-text">Account recovery</h2>
        </div>
        <div className="forgotPwd-rightSide">
          <form onSubmit={handleSubmit} noValidate autocomplete="off">
            {!successMessage && (
              <p className="para" data-testid="p-text">
                Enter the email address to get the reset password link
              </p>
            )}
            {!successMessage &&
              inputs.map((input) => (
                <FormInput
                  key={input.id}
                  {...input}
                  value={formData[input.name]}
                  onChange={handleChange}
                />
              ))}
            <div className="error-container">
              {fieldError && (
                <p className="error-text">
                  <FaExclamationCircle className="error-icon" />
                  &nbsp;{fieldError}
                </p>
              )}
            </div>
            {successMessage ? (
              <span className="success">{successMessage}</span>
            ) : (
              <div className="button-container">
                <Link to="/signin">
                  <button className="back-btn" type="button">
                    back
                  </button>
                </Link>
                <button type="submit" className="email-submit">
                  submit
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
