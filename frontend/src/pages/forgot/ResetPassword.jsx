import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setMessage('');

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (!token) {
      setMessage('Invalid or expired token');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8800/api/password/ResetPassword', {
        token,
        newPassword,
      });

      if (response.data.status === 'success') {
        setMessage('Password reset successfully');
        navigate('/login');
      } else {
        setMessage(response.data.error);
      }
    } catch (error) {
      console.error('Error:', error.response?.data?.error || error.message);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formSection}>
        <h3 style={styles.title}>Reset Password</h3>
        <p style={styles.slogan}>Enter your new password</p>
        <form onSubmit={handleResetPassword} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>New Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>Reset Password</button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  formSection: {
    width: '100%',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  slogan: {
    color: '#888',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  message: {
    marginTop: '20px',
    color: '#ff0000',
  },
};

export default ResetPassword;
