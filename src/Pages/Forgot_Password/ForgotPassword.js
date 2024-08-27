import React, { useState } from "react";
import "./ForgotPassword.css";
import { FaExclamationCircle } from "react-icons/fa";
import { forgotPasswordApi } from "./ForgotPasswordApi";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../../util/FormInput";
import validateAllFields from "../../util/ValidationForm";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [fieldError, setFieldError] = useState({});
  const navigate = useNavigate();

  const inputs = [
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Email",
      label: "Email",
      required: true,
      dataTestId: "email",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (fieldError[name]) {
      setFieldError({ ...fieldError, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateAllFields({ email: formData.email });
    setFieldError(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const response = await forgotPasswordApi(formData);
      console.log("res:", response);

      if (response.success === true) {
        setSuccessMessage(
          "An email has been sent to your email address to reset your password"
        );
        setFieldError({});
      } else {
        setError(response.error);
        setFormData({ email: "" });
        setFieldError({ email: response.error });
      }
    } catch (error) {
      console.error("Submission error:", error);
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
          <span data-testid="utube-text" className="forgot-password-heading-1">
            UTube
          </span>
          <span data-testid="static-text" className="forgot-password-heading-2">
            Account recovery
          </span>
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
                  errorMessage={fieldError[input.name] || ""}
                />
              ))}
            {/* <div className="error-container">
              {error && (
                <p className="error-text">
                  <FaExclamationCircle className="error-icon" />
                  &nbsp;{error}
                </p>
              )}
            </div> */}
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
