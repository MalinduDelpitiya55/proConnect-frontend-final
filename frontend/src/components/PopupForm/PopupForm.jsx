import React, { useState } from 'react';
import "./PopupForm.scss";

const PopupForm = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*\.\w{2,3}$/;
    return regex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phoneNumber);
  };

  const validateName = (name) => {
    const regex = /^[A-Z][a-z]*$/;
    return regex.test(name);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        if (!value || !validateName(value)) {
          return 'First name must start with a capital letter and contain no spaces.';
        }
        break;
      case 'lastName':
        if (!value || !validateName(value)) {
          return 'Last name must start with a capital letter and contain no spaces.';
        }
        break;
      case 'email':
        if (!value || !validateEmail(value)) {
          return 'Please enter a valid email address.';
        }
        break;
      case 'phoneNumber':
        if (!value || !validatePhoneNumber(value)) {
          return 'Please enter a valid 10-digit phone number.';
        }
        break;
      case 'additionalInfo':
        if (!value) {
          return 'Please provide additional information.';
        }
        break;
      default:
        return '';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phoneNumber':
        setPhoneNumber(value);
        break;
      case 'additionalInfo':
        setAdditionalInfo(value);
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    newErrors.firstName = validateField('firstName', firstName);
    newErrors.lastName = validateField('lastName', lastName);
    newErrors.email = validateField('email', email);
    newErrors.phoneNumber = validateField('phoneNumber', phoneNumber);
    newErrors.additionalInfo = validateField('additionalInfo', additionalInfo);

    setErrors(newErrors);
    return Object.keys(newErrors).every((key) => !newErrors[key]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({ firstName, lastName, email, phoneNumber, additionalInfo });
  };

  return (
    <div className="popup-form">
      <h2>Enter Your Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={firstName}
            onChange={handleChange}
            required
          />
          {errors.firstName && (
            <p className="error-message">{errors.firstName}</p>
          )}
        </div>
        <div className="form-field">
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={lastName}
            onChange={handleChange}
            required
          />
          {errors.lastName && (
            <p className="error-message">{errors.lastName}</p>
          )}
        </div>
        <div className="form-field">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <p className="error-message">{errors.email}</p>
          )}
        </div>
        <div className="form-field">
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={handleChange}
            required
          />
          {errors.phoneNumber && (
            <p className="error-message">{errors.phoneNumber}</p>
          )}
        </div>
        <div className="form-field">
          <textarea
            name="additionalInfo"
            placeholder="Additional Information"
            value={additionalInfo}
            onChange={handleChange}
            required
          />
          {errors.additionalInfo && (
            <p className="error-message">{errors.additionalInfo}</p>
          )}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PopupForm;
