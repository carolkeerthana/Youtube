import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import { useState } from "react";
import { registerUser } from "./RegisterApi";
import validateAllFields, {
  validateChannel,
  validateConfirmPassword,
  validateEmail,
  validatePassword,
} from "../../util/ValidationForm";
import FormInput from "../../util/FormInput";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [channelName, setChannelName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const inputs = [
    {
      id: "email",
      name: "email",
      type: "email",
      placeholder: "Email",
      label: "Email",
      value: email,
      dataTestId: "email",
    },
    {
      id: "channelName",
      name: "channelName",
      type: "text",
      placeholder: "User Name",
      label: "User Name",
      value: channelName,
      dataTestId: "channelName",
    },
  ];

  const validateForm = () => {
    const fields = {
      email,
      password,
      confirmPassword,
      channelName,
    };

    const errors = validateAllFields(fields);

    console.log("Validation errors:", errors);
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "channelName") {
      setChannelName(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }

    // Clear fieldError when the user starts typing in the email o  r password field
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await registerUser({
          email,
          channelName,
          password,
          confirmPassword,
        });
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
          <span data-testid="utube-text" className="heading-1">UTube</span>
          <div>
            <span data-testid="static-text" className="heading-2">Create a UTube Account</span>
          </div>
        </div>
        <div className="register-rightSide">
          <form onSubmit={handleSubmit} noValidate autocomplete="off">
            {inputs.map((input) => (
              <FormInput
                key={input.id}
                {...input}
                name={input.name}
                onChange={handleChange}
                errorMessage={fieldErrors[input.name] || ""}
              />
            ))}
            <div className="password-container">
              <FormInput
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                label="Password"
                value={password}
                onChange={handleChange}
                errorMessage={fieldErrors.password || ""}
                dataTestId="password"
              />
              <FormInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={handleChange}
                errorMessage={fieldErrors.confirmPassword || ""}
                dataTestId="confirmPassword"
              />
            </div>
            <div className="register-button-container">
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
