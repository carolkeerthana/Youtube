import React, { useState } from "react";
import "./ResetPassword.css";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "./ResetPasswordApi";
import validateAllFields from "../../util/ValidationForm";
import FormInput from "../../util/FormInput";
import { useDispatch } from "react-redux";
import { showNotification } from "../../components/Notification/notificationSlice";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useParams();
  const dispatch = useDispatch();

  const inputs = [
    {
      id: 1,
      name: "password",
      type: "password",
      placeholder: "New Password",
      label: "New Password",
      required: true,
      dataTestId: "password",
    },
    {
      id: 2,
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      label: "Confirm Password",
      required: true,
      dataTestId: "confirmPassword",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }

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
    console.log("entered submit");
    if (validateForm()) {
      try {
        const response = await resetPassword(token, password);

        if (response.success) {
          console.log("entered success");
          dispatch(
            showNotification(
              "Your password has been reset successfully. Please sign in with your new password."
            )
          );
          setFieldErrors({});
          setPassword("");
          setConfirmPassword("");
          navigate("/signin");
        } else {
          console.log("Reset failed");
          setError("Password reset failed. Please try again.");
        }
      } catch (error) {
        console.log("Error occurred:", error);
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
          <span data-testid="utube-text" className="reset-heading-1">
            UTube
          </span>
          <span data-testid="static-text" className="reset-heading-2">
            Reset your password
          </span>
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
