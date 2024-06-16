import React, { useState } from 'react';
import axios from 'axios';
import loginImage from '../../../public/img/post.png'; // Check if the path is correct
import "./ForgetPassword.scss"
import newRequest from "../../utils/newRequest";

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  // State for storing the email input

  const [message, setMessage] = useState('');
  // State for storing success messages

  const [error, setError] = useState('');
  // State for storing error messages

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    // Prevent the default form submission behavior

    setMessage('');
    setError('');
    // Clear any existing messages or errors

    if (!email) {
      setError('Please enter your email');
      // Set error if the email field is empty
      return;
    }

    try {
      const response = await newRequest.post(
        "/password/forgetPassword",
        { email }
      );
      // Make a POST request to the server with the email

      if (response.data.status === 'success') {
        setMessage('Password reset email sent successfully');
        // Show success message if the response is successful
      } else {
        setError(response.data.error || 'An error occurred. Please try again later.');
        // Show error message if there is an error in the response
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      // Show error message if the request fails
      console.error('Error sending email:', error);
      // Log the error for debugging purposes
    }
  };

  return (
    <div className="fog">
      <div className="container">
        <div className="formSection">
          <h3 className="title">Forgot Password</h3>
          // Heading for the form

          <p className="slogan">Reset your account password</p>
          // Slogan or description for the form

          <form onSubmit={handleForgotPassword} className="form">
            // Form element with a submit handler

            <div className="formGroup">
              <label htmlFor="email" className="label">
                Email
              </label>
              // Label for the email input

              <input
                type="email"
                id="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
              // Email input field
            </div>
            <button type="submit" className="button">
              Send Reset Email
            </button>
            // Submit button for the form
          </form>
          {message && <p className="messageSuccess">{message}</p>}
          // Display success message if available

          {error && <p className="messageError">{error}</p>}
          // Display error message if available
        </div>
        <div className="imageSection">
          <img src={loginImage} alt="Forgot Password" className="image" />
          // Display an image related to forgot password
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
// Exporting the component as default