import React, {useState, useEffect} from "react"; // Import React and useState hook
import "./Login.scss"; // Import the stylesheet for the Login component
import newRequest from "../../utils/newRequest"; // Import the utility for making HTTP requests
import {useNavigate} from "react-router-dom"; // Import the hook for navigation
import {Link} from "react-router-dom"; // Import the Link component for navigation

function Login() {
  // State variables for managing input values and validation states
  const [username, setUsername] = useState(""); // Username input value
  const [password, setPassword] = useState(""); // Password input value
  const [error, setError] = useState(null); // Error message
  const [isUsernameValid, setIsUsernameValid] = useState(true); // Username validation state
  const [isPasswordValid, setIsPasswordValid] = useState(true); // Password validation state

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const user = getItemWithExpiry("currentUser"); // Function to get token from localStorage
    console.log(user); // Log the user data

    // If user exists, navigate away from login page
    if (user) {
      navigate("/"); // Redirect to home page or dashboard
    }

    // Set up a periodic check every minute
    const interval = setInterval(clearExpiredItems, 60 * 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [navigate]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Check if username and password are valid
      if (!isUsernameValid || !isPasswordValid) {
        return; // Exit if either username or password is invalid
      }

      // Make POST request to login endpoint
      const res = await newRequest.post("/auth/login", {username, password});

      // Store user data in local storage with an expiry of 1 hour
      setItemWithExpiry("currentUser", res.data, 1);

      // Navigate to the appropriate page after successful login
      if (res.data.user === "admin") {
        navigate("/admindashboard");
      } else {
        navigate("/"); // Navigate to home page
      }
      console.log(res.data.user);
    } catch (err) {
      setError(err.response.data); // Set error message on failure
    }
  };

  // Function to set item with expiry time
  function setItemWithExpiry(key, value, expiryInHours) {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + expiryInHours * 60 * 60 * 1000,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  // Function to get item with expiry check
  function getItemWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();

    // Check if the item has an expiry property
    if (!item || !item.expiry || now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }

  // Function to clear expired items
  function clearExpiredItems() {
    const now = new Date();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const itemStr = localStorage.getItem(key);
      if (itemStr) {
        const item = JSON.parse(itemStr);
        // Check if the item has an expiry property
        if (item && item.expiry && now.getTime() > item.expiry) {
          localStorage.removeItem(key);
        }
      }
    }
  }

  // Function to handle username input change
  const handleUsernameChange = (e) => {
    const {value} = e.target;
    setUsername(value); // Update username state
    setIsUsernameValid(validateUsername(value)); // Validate username
  };

  // Function to handle password input change
  const handlePasswordChange = (e) => {
    const {value} = e.target;
    setPassword(value); // Update password state
    setIsPasswordValid(validatePassword(value)); // Validate password
  };

  // Function to validate username
  const validateUsername = (username) => {
    // Username pattern: alphanumeric characters and underscores, 3-16 characters long
    const usernamePattern = /^[a-zA-Z0-9_]{3,16}$/;
    return usernamePattern.test(username); // Test username against pattern
  };

  // Function to validate password
  const validatePassword = (password) => {
    // Password pattern: at least 8 characters long, containing at least one digit, one lowercase letter, and one uppercase letter
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return passwordPattern.test(password); // Test password against pattern
  };

  return (
    <div className="login">
      <div className="conbox">
        {/* Form to handle login */}
        <form className="formlog" onSubmit={handleSubmit}>
          <h1>Sign in</h1>
          <label htmlFor="username">Username</label>
          {/* Input for username */}
          <input
            className={`input1 ${!isUsernameValid ? "invalid" : ""}`} // Apply invalid class if username is invalid
            name="username"
            type="text"
            maxLength={16} // Maximum length of 16 characters
            onChange={handleUsernameChange} // Handle change event
          />
          {!isUsernameValid && (
            <p className="error">Invalid username pattern</p> // Display error message for invalid username
          )}
          <label htmlFor="password">Password</label>
          {/* Input for password */}
          <input
            className={`input1 ${!isPasswordValid ? "invalid" : ""}`} // Apply invalid class if password is invalid
            name="password"
            type="password"
            onChange={handlePasswordChange} // Handle change event
          />
          {!isPasswordValid && (
            <p className="error">Invalid password pattern</p> // Display error message for invalid password
          )}
          <button className="buttonl" type="submit">
            Login
          </button>{" "}
          {/* Submit button */}
          {error && <p className="error">{error}</p>}{" "}
          {/* Display error message */}
        </form>
        {/* Link to forgot password page */}
        <center>
          <Link to="/forgot">
            <button className="buttonforgot">Forgot password</button>
          </Link>
        </center>
      </div>
    </div>
  );
}

export default Login; // Export the Login component
