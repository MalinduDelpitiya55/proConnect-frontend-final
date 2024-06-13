import React, {useState} from "react";
import "./PopupForm.scss"; // Importing local stylesheet for styling

const PopupForm = ({onSubmit}) => {
  // State variables to hold form data and errors
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [errors, setErrors] = useState({}); // State to manage form validation errors

  // Regular expressions and validation functions
  const validateEmail = (email) => {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*\.\w{2,3}$/;
    return regex.test(email); // Returns true if email matches regex pattern
  };

  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phoneNumber); // Returns true if phoneNumber matches regex pattern
  };

  const validateName = (name) => {
    const regex = /^[A-Z][a-z]*$/;
    return regex.test(name); // Returns true if name matches regex pattern
  };

  // Function to validate each field based on its name and value
  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        if (!value || !validateName(value)) {
          return "First name must start with a capital letter and contain no spaces.";
        }
        break;
      case "lastName":
        if (!value || !validateName(value)) {
          return "Last name must start with a capital letter and contain no spaces.";
        }
        break;
      case "email":
        if (!value || !validateEmail(value)) {
          return "Please enter a valid email address.";
        }
        break;
      case "phoneNumber":
        if (!value || !validatePhoneNumber(value)) {
          return "Please enter a valid 10-digit phone number.";
        }
        break;
      case "additionalInfo":
        if (!value) {
          return "Please provide additional information.";
        }
        break;
      default:
        return "";
    }
    return "";
  };

  // Handle input changes and validate the field
  const handleChange = (e) => {
    const {name, value} = e.target;

    // Update the state based on the input name
    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      case "additionalInfo":
        setAdditionalInfo(value);
        break;
      default:
        break;
    }

    // Validate the field and update errors state
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value), // Set error message for the current field
    }));
  };

  // Validate the entire form and return true if no errors
  const validateForm = () => {
    const newErrors = {};

    // Validate each field and update errors state
    newErrors.firstName = validateField("firstName", firstName);
    newErrors.lastName = validateField("lastName", lastName);
    newErrors.email = validateField("email", email);
    newErrors.phoneNumber = validateField("phoneNumber", phoneNumber);
    newErrors.additionalInfo = validateField("additionalInfo", additionalInfo);

    setErrors(newErrors); // Update errors state with new errors
    return Object.keys(newErrors).every((key) => !newErrors[key]); // Return true if there are no errors
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate the form before submitting
    if (!validateForm()) {
      return; // Stop submission if there are validation errors
    }

    // Call onSubmit prop with form data if form is valid
    onSubmit({firstName, lastName, email, phoneNumber, additionalInfo});
  };

  // Render the form component
  return (
    <div className="popup-form">
      <h2>Enter Your Details</h2>
      <form onSubmit={handleSubmit}>
        {/* First Name input field */}
        <div className="form-field">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={firstName}
            onChange={handleChange}
            required
          />
          {/* Display error message if firstName has an error */}
          {errors.firstName && (
            <p className="error-message">{errors.firstName}</p>
          )}
        </div>
        {/* Last Name input field */}
        <div className="form-field">
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={lastName}
            onChange={handleChange}
            required
          />
          {/* Display error message if lastName has an error */}
          {errors.lastName && (
            <p className="error-message">{errors.lastName}</p>
          )}
        </div>
        {/* Email input field */}
        <div className="form-field">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            required
          />
          {/* Display error message if email has an error */}
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        {/* Phone Number input field */}
        <div className="form-field">
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={handleChange}
            required
          />
          {/* Display error message if phoneNumber has an error */}
          {errors.phoneNumber && (
            <p className="error-message">{errors.phoneNumber}</p>
          )}
        </div>
        {/* Additional Information textarea field */}
        <div className="form-field">
          <textarea
            name="additionalInfo"
            placeholder="Additional Information"
            value={additionalInfo}
            onChange={handleChange}
            required
          />
          {/* Display error message if additionalInfo has an error */}
          {errors.additionalInfo && (
            <p className="error-message">{errors.additionalInfo}</p>
          )}
        </div>
        {/* Submit button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PopupForm;
