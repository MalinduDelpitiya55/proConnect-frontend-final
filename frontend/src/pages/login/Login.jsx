import React, { useState } from "react";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isUsernameValid, setIsUsernameValid] = useState(true); // State to track username validation
  const [isPasswordValid, setIsPasswordValid] = useState(true); // State to track password validation

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isUsernameValid || !isPasswordValid) {
        return; // Don't proceed with login if username or password is invalid
      }

      const res = await newRequest.post("/auth/login", { username, password });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response.data);
    }
  };

  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setUsername(value);
    setIsUsernameValid(validateUsername(value)); // Update username validation state
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
    setIsPasswordValid(validatePassword(value)); // Update password validation state
  };

  const validateUsername = (username) => {
    // Define your username pattern using regular expression
    const usernamePattern = /^[a-zA-Z0-9_]{3,16}$/; // Example pattern: alphanumeric characters and underscores, 3-16 characters long

    // Test the username against the pattern
    return usernamePattern.test(username);
  };

  const validatePassword = (password) => {
    // Define your password pattern using regular expression
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/; // Example pattern: at least 8 characters long, containing at least one digit, one lowercase letter, and one uppercase letter

    // Test the password against the pattern
    return passwordPattern.test(password);
  };

  return (
    <div className="login">
      <div className="conbox">
        <form className="formlog" onSubmit={handleSubmit}>
          <h1>Sign in</h1>
          <label htmlFor="username">Username</label>
          <input
            className={`input1 ${!isUsernameValid ? "invalid" : ""}`}
            name="username"
            type="text"
            maxLength={16} // Set maximum length to 16 characters
            onChange={handleUsernameChange}
          />
          {!isUsernameValid && (
            <p className="error">Invalid username pattern</p>
          )}

          <label htmlFor="password">Password</label>
          <input
            className={`input1 ${!isPasswordValid ? "invalid" : ""}`}
            name="password"
            type="password"
            onChange={handlePasswordChange}
          />
          {!isPasswordValid && (
            <p className="error">Invalid password pattern</p>
          )}

          <button className="buttonl" type="submit">Login</button>
          {error && <p className="error">{error}</p>} 
        </form>
        <center><Link to="/forgot"><button className="buttonforgot">Forgot password</button></Link></center>
      </div>
    </div>
  );
}

export default Login;
