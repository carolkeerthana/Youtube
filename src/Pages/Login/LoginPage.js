import { useEffect, useState } from "react";
import "./LoginPage.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaExclamationCircle } from "react-icons/fa";
import { loginUser } from "./LoginApi";
import { useAuth } from "../../util/AuthContext";
import FormInput from "../../util/FormInput";
import validateAllFields from "../../util/ValidationForm";
import { useDispatch, useSelector } from "react-redux";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login } = useAuth();
  const location = useLocation();
  const notification = useSelector((state) => state.notifications);

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

  // useEffect(() => {
  //   if (notification.visible) {
  //     const timer = setTimeout(() => {
  //       dispatch(hideNotification());
  //     }, 3000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [notification.visible, dispatch]);

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
        {/* {notification.visible && <CustomNotification />} */}
        <div className="login-LeftSide">
          <span data-testid="utube-text" className="login-heading-1">
            UTube
          </span>
          <div className="signin-text">
            <br />
            <span data-testid="signin-text" className="login-heading-2">
              Sign in
            </span>
            <br />
            <span data-testid="text" className="login-heading-3">
              to continue to UTube
            </span>
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
