import React, { useState } from 'react';
import axios from 'axios';
import loginImage from '../../../public/img/post.png'; // Check if the path is correct
import "./ForgetPassword.scss"

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8800/api/password/forgetPassword', { email });
      if (response.data.status === 'success') {
        setMessage('Password reset email sent successfully');
      } else {
        setError(response.data.error || 'An error occurred. Please try again later.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('Error sending email:', error);
    }
  };

  return (
    <div className="fog">
      <div className="container">
        <div className="formSection">
          <h3 className="title">Forgot Password</h3>
          <p className="slogan">Reset your account password</p>
          <form onSubmit={handleForgotPassword} className="form">
            <div className="formGroup">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>
            <button type="submit" className="button">
              Send Reset Email
            </button>
          </form>
          {message && <p className="messageSuccess">{message}</p>}
          {error && <p className="messageError">{error}</p>}
        </div>
        <div className="imageSection">
          <img src={loginImage} alt="Forgot Password" className="image" />
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
