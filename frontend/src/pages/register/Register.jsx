import React, {useState, useEffect} from "react";
import upload from "../../utils/upload"; // Assuming upload utility for file uploads
import "./Register.scss";
import newRequest from "../../utils/newRequest"; // Assuming Axios instance for API requests
import {useNavigate} from "react-router-dom";
import getCurrentUser from "./../../utils/getCurrentUser.js";
function Register() {
  const navigate = useNavigate(); // Hook from react-router-dom for navigation
  useEffect(() => {
    const user = getCurrentUser(); // Function to get token from cookies
   console.log(user);
    // If token exists, navigate away from login page
    if (user!=null) {
     return navigate("/"); // Redirect to home page or dashboard
    }
  }, [navigate]);
  // State variables for form inputs, validation, and submission status
  const [file, setFile] = useState(null); // State for profile picture file
  const [isUploading, setIsUploading] = useState(false); // State to track file upload status
  const [user, setUser] = useState({
    // State for user data
    username: "",
    email: "",
    password: "",
    img: "", // Placeholder for profile picture URL
    country: "",
    isSeller: false,
    desc: "",
    phone: "",
  });
  const [error, setError] = useState(""); // State for general error messages
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission status
  const [errors, setErrors] = useState({}); // State to hold validation errors for form fields

  // Function to handle input changes and perform validation
  const handleChange = (e) => {
    const {name, value} = e.target;
    let newValue = value;

    // Additional logic for specific fields (e.g., username and password length limits)
    if (name === "username") {
      newValue = value.slice(0, 16);
    }
    if (name === "password") {
      newValue = value.slice(0, 32);
    }

    // Update user state with new values
    setUser((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validate the updated field
    validate(name, newValue);
  };

  // Function to handle seller checkbox change
  const handleSeller = (e) => {
    setUser((prev) => ({
      ...prev,
      isSeller: e.target.checked,
    }));
  };

  // Function to perform field validation based on name and value
  const validate = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "username":
        if (value.length < 3) {
          errorMsg = "Username must be at least 3 characters long.";
        } else if (/[^a-zA-Z0-9]/.test(value)) {
          errorMsg = "Username cannot contain special characters.";
        }
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) {
          errorMsg = "Email address is invalid.";
        }
        break;
      case "password":
        if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(value)) {
          errorMsg =
            "Password must be at least 8 characters long and include at least one number, one uppercase letter, one lowercase letter, and one special character.";
        }
        break;
      case "phone":
        if (!/^\d{10}$/.test(value)) {
          errorMsg = "Phone number must be 10 digits.";
        }
        break;
      default:
        break;
    }

    // Update errors state with validation error message
    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear any previous errors
    setIsSubmitting(true); // Set submitting state to true

    let url = ""; // Placeholder for profile picture URL

    // Upload profile picture if file is selected
    if (file) {
      setIsUploading(true); // Set uploading state to true
      try {
        // Use upload utility function to upload file
        url = await upload(file);
      } catch (err) {
        setError("Failed to upload image."); // Handle upload error
        setIsUploading(false); // Reset uploading state
        setIsSubmitting(false); // Reset submitting state
        alert("Failed to upload image."); // Show alert for upload failure
        return;
      }
      setIsUploading(false); // Reset uploading state after successful upload
    }

    try {
      // Send registration data to server using newRequest instance
      await newRequest.post("/auth/register", {
        ...user,
        img: url, // Include uploaded image URL in user data
      });
      alert("Registration successful"); // Show success message
      navigate("/login"); // Navigate to login page
    } catch (err) {
      setError("Registration failed. Please try again."); // Handle registration failure
      alert("Registration failed. Please try again."); // Show alert for registration failure
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  // JSX rendering of registration form
  return (
    <div className="register">
      <div className="conbox">
        <form onSubmit={handleSubmit}>
          {/* Left section of the form */}
          <div className="left">
            <h1>Create a new account</h1>
            {/* Username input */}
            <label htmlFor="username">Username</label>
            <input
              className="input1"
              name="username"
              type="text"
              placeholder="johndoe"
              value={user.username}
              onChange={handleChange}
              maxLength={16}
              required
            />
            {errors.username && <p className="error">{errors.username}</p>}
            {/* Email input */}
            <label htmlFor="email">Email</label>
            <input
              className="input1"
              name="email"
              type="email"
              placeholder="email"
              value={user.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
            {/* Password input */}
            <label htmlFor="password">Password</label>
            <input
              className="input1"
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
              minLength={8}
              maxLength={32}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}"
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
            {/* File upload for profile picture */}
            <label htmlFor="img">Profile Picture</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            {/* Country input */}
            <label htmlFor="country">Country</label>
            <input
              className="input1"
              name="country"
              type="text"
              placeholder="USA"
              value={user.country}
              onChange={handleChange}
              required
            />
            {/* Submit button */}
            <button
              type="submit"
              disabled={
                isSubmitting || Object.keys(errors).some((key) => errors[key]) // Disable button if submitting or there are validation errors
              }
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
            {error && <p className="error">{error}</p>}{" "}
            {/* Error message display */}
          </div>

          {/* Right section of the form */}
          <div className="right">
            <h1>I want to become a seller</h1>

            {/* Seller activation toggle */}
            <div className="toggle">
              <label htmlFor="isSeller">Activate the seller account</label>
              <label className="switch">
                <input type="checkbox" onChange={handleSeller} />
                <span className="slider round"></span>
              </label>
            </div>

            {/* Phone number input */}
            <label htmlFor="phone">Phone Number</label>
            <input
              className="input1"
              name="phone"
              type="tel"
              pattern="[0-9]{10}"
              placeholder="0717645252"
              value={user.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <p className="error">{errors.phone}</p>}

            {/* Description textarea */}
            <label htmlFor="desc">Description</label>
            <textarea
              className="input2"
              placeholder="A short description of yourself"
              name="desc"
              cols="30"
              rows="10"
              value={user.desc}
              onChange={handleChange}
            ></textarea>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
