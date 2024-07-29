import { useEffect, useState } from "react";
import "./LoginPage.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import { loginUser } from "./LoginApi";
import { useAuth } from "../../util/AuthContext";
import CustomNotification from "../Register/CustomNotification";
import FormInput from "../../util/FormInput";
import validateAllFields from "../../util/ValidationForm";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

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
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Password",
      label: "Password",
      required: true,
      dataTestId: "password",
    },
  ];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const resetSuccess = queryParams.get("resetSuccess");

    if (resetSuccess === "true") {
      setNotificationMessage(
        "Your password has been reset successfully. Please sign in with your new password."
      );
      setShowNotification(true);

      // Clear notification after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000); // Adjust the timer duration (in milliseconds) as needed

      return () => clearTimeout(timer);
    }
  }, [location.search]);

  // const handleChange = (e) => {
  //     const {name,value} = e.target;
  //     setFormData({...formData, [name]: value});
  // }

  // const validateEmail = (email) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

  // const validateAllFields = () => {
  //   const errors = {};

  //   if (!email) {
  //     errors.email = "Enter an email";
  //   } else if (!validateEmail(email)) {
  //     errors.email = "Enter a valid email";
  //   }

  //   if (!password) {
  //     errors.password = "Enter password";
  //   } else if (password.length < 8) {
  //     errors.password = "Password must be at least 8 characters long";
  //   }

  //   setFieldErrors(errors);
  //   return Object.keys(errors).length === 0;
  // };

  const validateForm = () => {
    const errors = validateAllFields({ email, password });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }

    // Clear fieldError when the user starts typing in the email o  r password field
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
    };
    console.log(loginData);

    if (validateForm()) {
      try {
        const response = await loginUser({ email, password });
        console.log(response);
        if (response.token) {
          localStorage.setItem("token", response.token);
          login();
          navigate("/");
        } else {
          setError("Login failed. Please try again.");
        }
      } catch {
        console.error("Login failed:", error);
        setError(
          error?.message || "An unexpected error occurred. Please try again."
        );
        navigate("/error");
      }
    } else {
      console.log("Validation errors:", fieldErrors);
    }

    // if(!response.ok){
    //     const errorData = await response.json();
    //     setError(errorData.message || 'An error occurred. Please try again.');
    //     return;
    // }
  };

  return (
    <div className="login">
      <div className="login-container">
        {showNotification && (
          <CustomNotification
            message={notificationMessage}
            onClose={() => setShowNotification(false)}
          />
        )}
        <div className="login-LeftSide">
          <h1 data-testid="utube-text">UTube</h1>
          <div className="signin-text">
            <br />
            <h2 data-testid="signin-text">Sign in</h2>
            <span data-testid="text">to continue to UTube</span>
          </div>
        </div>
        <div className="login-RightSide">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="login-RightSide"
            autocomplete="off"
          >
            {inputs.map((input) => (
              <FormInput
                key={input.id}
                {...input}
                value={input.name === "email" ? email : password}
                onChange={handleChange}
                errorMessage={fieldErrors[input.name] || ""}
              />
            ))}
            {error && <p className="error-message">{error}</p>}
            <p className="forgot-password">
              <Link to={"/forgotpassword"}>forgot password?</Link>
            </p>
            <div className="button-container">
              <Link to="/signup">
                <button className="create-account" type="button">
                  create account
                </button>
              </Link>
              <button
                className="sign-in"
                type="submit"
                name="submit"
                data-testid="signin-page"
              >
                sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
