import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import { useState } from "react";
import FieldValidation from "../Validation/FieldValidation";
import { registerUser } from "./RegisterApi";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const validateAllFields = () => {
    const errors = {};

    if (!email) {
      errors.email = "Enter an email";
    } else if (!validateEmail(email)) {
      errors.email = "Enter a valid email";
    }

    if (!channel) {
      errors.channel = "Enter channel name";
    } else if (channel.length < 3) {
      errors.channel = "Channel name must be at least 3 characters long";
    }

    if (!password) {
      errors.password = "Enter password";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Enter confirm password";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateAllFields()) {
      try {
        const response = await registerUser({email, channel, password, confirmPassword});
        localStorage.setItem("token", response.token);
        navigate("/signin");
      } catch (error) {
        navigate("/error");
      }
    }
  };
  return (
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
              email={email}
              setEmail={setEmail}
              channel={channel}
              setChannel={setChannel}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              fieldErrors={fieldErrors}
              setFieldErrors={setFieldErrors}
            />
            <div className="button-container">
              <Link to="/signin">
                <button className="signin" type="button">
                  Sign in
                </button>
              </Link>
              <button type="submit" className="sign-up">
                sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
