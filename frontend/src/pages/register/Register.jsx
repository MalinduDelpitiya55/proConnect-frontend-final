import React, { useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Register() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "username") {
      newValue = value.slice(0, 16);
    }

    if (name === "password") {
      newValue = value.slice(0, 32);
    }

    setUser((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    validate(name, newValue);
  };

  const handleSeller = (e) => {
    setUser((prev) => ({
      ...prev,
      isSeller: e.target.checked,
    }));
  };

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
          errorMsg = "Password must be at least 8 characters long and include at least one number, one uppercase letter, one lowercase letter, and one special character.";
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

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    let url = "";

    if (file) {
      setIsUploading(true);
      try {
        url = await upload(file);
      } catch (err) {
        setError("Failed to upload image.");
        setIsUploading(false);
        setIsSubmitting(false);
        alert("Failed to upload image.");
        return;
      }
      setIsUploading(false);
    }

    try {
      await newRequest.post("/auth/register", {
        ...user,
        img: url,
      });
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register">
      <div className="conbox">
        <form onSubmit={handleSubmit}>
          <div className="left">
            <h1>Create a new account</h1>
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

            <label htmlFor="img">Profile Picture</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />

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

            <button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).some((key) => errors[key])}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
            {error && <p className="error">{error}</p>}
          </div>
          <div className="right">
            <h1>I want to become a seller</h1>
            <div className="toggle">
              <label htmlFor="isSeller">Activate the seller account</label>
              <label className="switch">
                <input type="checkbox" onChange={handleSeller} />
                <span className="slider round"></span>
              </label>
            </div>

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
