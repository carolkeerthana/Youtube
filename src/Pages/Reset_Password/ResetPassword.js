import React, { useState } from "react";
import "./ResetPassword.css";
import { FaExclamationCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "./ResetPasswordApi";
import validateAllFields from "../../util/ValidationForm";
import FormInput from "../../util/FormInput";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useParams();

  const inputs = [
    {
      id: 1,
      name: "password",
      type: "password",
      placeholder: "New Password",
      label: "New Password",
      required: true,
    },
    {
      id: 2,
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      label: "Confirm Password",
      required: true,
    },
  ];

  // const validateAllFields = () => {
  //   const errors = {};

  //   if (!password) {
  //     errors.password = 'Enter password';
  //   } else if (password.length < 8) {
  //     errors.password = 'Password must be at least 8 characters long';
  //   }

  //   if (!confirmPassword) {
  //     errors.confirmPassword = 'Confirm your password';
  //   } else if (password !== confirmPassword) {
  //     errors.confirmPassword = 'Passwords do not match';
  //   }

  //   setFieldErrors(errors);
  //   return Object.keys(errors).length === 0;
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }

    // Clear fieldError when the user starts typing in the field
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors = validateAllFields({ password, confirmPassword });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await resetPassword(token, password);

        if (response.success) {
          setSuccessMessage("Your password has been reset successfully.");
          setFieldErrors({});
          setPassword("");
          setConfirmPassword("");
          navigate("/signin?resetSuccess=true"); // Pass success message as query parameter
        } else {
          setError("Password reset failed. Please try again.");
        }
      } catch (error) {
        navigate("/error");
      }
    } else {
      console.log("Validation errors:", fieldErrors);
    }
  };

  return (
    <div className="resetPassword">
      <div className="reset-password-container">
        <div className="resetPwd-leftSide">
          <h1 data-testid="utube-text">UTube</h1>
          <h2 data-testid="static-text">Reset your password</h2>
        </div>
        <div className="resetPwd-rightSide">
          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            {!successMessage && (
              <>
                {inputs.map((input) => (
                  <FormInput
                    key={input.id}
                    {...input}
                    value={
                      input.name === "password" ? password : confirmPassword
                    }
                    onChange={handleChange}
                    errorMessage={fieldErrors[input.name] || ""}
                  />
                ))}
                {error && <p className="error-message">{error}</p>}
                <div className="button-container">
                  <button type="submit" className="reset-submit">
                    Reset Password
                  </button>
                </div>
              </>
            )}
            {successMessage && (
              <span className="success">{successMessage}</span>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
