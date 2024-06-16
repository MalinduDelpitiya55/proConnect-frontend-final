import React, {useState, useEffect} from "react";
import "./Profileedit.scss";
import Axios from "axios"; // Import Axios for making HTTP requests
import Noavatar from "./../../../public/img/noavatar.jpg"; // Placeholder image
import newRequest from "./../../utils/newRequest.js"; // Custom utility function for HTTP requests
import getCurrentUser from "./../../utils/getCurrentUser.js"; // Utility function to get current user data

const CVSection = () => {
  // State to store buyer and user data
  const [buyers, setBuyers] = useState(null); // State for buyer data
  const [user, setUser] = useState(null); // State for user data

  // State for form data and validation
  const [formData, setFormData] = useState({
    title: "", // Title field
    skills: ["", "", ""], // Array of technical skills
    qualifications: ["", ""], // Array of qualifications
    education: [
      {institution: "", degree: ""}, // Education object 1
      {institution: "", degree: ""}, // Education object 2
    ],
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    skills: ["", "", ""], // Errors for skills
    qualifications: ["", ""], // Errors for qualifications
    education: [
      {institution: "", degree: ""}, // Errors for education object 1
      {institution: "", degree: ""}, // Errors for education object 2
    ],
  });

  // State for success or error message after form submission
  const [message, setMessage] = useState("");

  // useEffect hook to fetch buyer data when component mounts
  useEffect(() => {
    fetchBuyers(); // Fetch buyers data
  }, []); // Empty dependency array ensures this effect runs once on mount

  // Function to fetch buyers data
  const fetchBuyers = async () => {
    try {
      const currentUser = getCurrentUser(); // Get current user
      // Fetch seller data based on current user's ID
      const response1 = await newRequest.post(`/seller/get/${currentUser._id}`);
      // Fetch user data based on current user's ID
      const response2 = await newRequest.get(`/users/${currentUser._id}`);

      const sellerData = response1.data; // Extract seller data from response
      const userData = response2.data; // Extract user data from response

      // Log data to console for debugging
      console.log(sellerData, userData);

      // Update formData state with fetched sellerData
      setFormData({
        title: sellerData.title || "", // Title
        skills: sellerData.skills || ["", "", ""], // Skills array
        qualifications: sellerData.qualifications || ["", ""], // Qualifications array
        education: sellerData.education || [
          {institution: "", degree: ""}, // Education object 1
          {institution: "", degree: ""}, // Education object 2
        ],
      });

      // Set buyers and user states with fetched data
      setBuyers(sellerData);
      setUser(userData);
    } catch (error) {
      console.error("Error fetching buyers:", error); // Log error to console if fetching fails
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const currentUser = getCurrentUser(); // Get current user
      // Send POST request to update seller data with current user's ID and formData
      const response = await newRequest.post(
        `/seller/update/${currentUser._id}`,
        {id: currentUser._id, data: formData}
      );
      setMessage("Edit is successful"); // Set success message after successful update
    } catch (error) {
      console.error("Error:", error); // Log error to console if update fails
    }
  };

  // Function to handle input change with validation
const handleChange = (e) => {
  const {name, value} = e.target; // Destructure name and value from event target
  const [key, index, subkey] = name.split("-"); // Split name attribute to get keys

  let newFormData = {...formData}; // Copy formData state
  let newErrors = {...errors}; // Copy errors state

  // Validation logic based on key and subkey
  if (key === "skills") {
    if (/[^a-zA-Z\s]/.test(value)) {
      newErrors.skills[index] = "Skills cannot contain symbols or numbers."; // Validate skills field
    } else {
      newErrors.skills[index] = ""; // Clear error if validation passes
    }
    newFormData.skills[index] = value; // Update skills array in formData
  } else if (key === "qualifications") {
    if (/[^a-zA-Z\s]/.test(value) || value.length < 3 || value.length > 150) {
      newErrors.qualifications[index] =
        "Qualifications must be between 3 and 150 letters and cannot contain symbols or numbers."; // Validate qualifications field
    } else {
      newErrors.qualifications[index] = ""; // Clear error if validation passes
    }
    newFormData.qualifications[index] = value; // Update qualifications array in formData
  } else if (key === "education" && subkey) {
    if (value.length < 2 || value.length > 175) {
      newErrors.education[index][subkey] =
        "Education fields must be between 2 and 175 characters."; // Validate education fields
    } else {
      newErrors.education[index][subkey] = ""; // Clear error if validation passes
    }
    newFormData.education[index] = {
      ...newFormData.education[index],
      [subkey]: value,
    }; // Update education array in formData
  } else if (key === "title") {
    newFormData.title = value; // Update title in formData
  } else if (key === "description") {
    newFormData.description = value; // Update description in formData
  }

  // Set formData and errors states with updated values
  setFormData(newFormData);
  setErrors(newErrors);
};
  return (
    <div className="editp">
      <section className="container" id="cv">
        <form onSubmit={handleSubmit}>
          <div className="cv-row">
            <div className="profile-section">
              <img
                className="profile-pic"
                src={(user && user.img) || Noavatar}
                alt="profile-img"
              />
              <h2 className="name-title">{user && user.username}</h2>
              <ul className="contact-info">
                <select
                  name="title"
                  id="cat"
                  onChange={handleChange}
                  value={formData.title}
                >
                  <option value="" disabled>
                    Select your Title
                  </option>
                  <option value="Graphics Design">Graphics Design</option>
                  <option value="Video Design">Video Design</option>
                  <option value="Web Design">Web Design</option>
                  <option value="Mobile Application Design">
                    Mobile Application Design
                  </option>
                  <option value="Animation Design">Animation Design</option>
                  <option value="AI Services">AI Services</option>
                  <option value="Writing & Translation">
                    Writing & Translation
                  </option>
                  <option value="Music & Audio">Music & Audio</option>
                  <option value="Programming & Tech">Programming & Tech</option>
                </select>
              </ul>
              <h3>{formData.title}</h3>{" "}
              {/* Conditionally render selected title */}
              <h5>Technical Skills</h5>
              <ul className="skills-list">
                {formData.skills.map((value, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      id={`skills-${index}`}
                      name={`skills-${index}`}
                      className="input-field"
                      placeholder={`Technical Skills ${index + 1}`}
                      onChange={handleChange}
                      value={value}
                    />
                    {errors.skills[index] && (
                      <span className="error">{errors.skills[index]}</span>
                    )}
                  </div>
                ))}
              </ul>
            </div>
            <div className="details-section">
              <h3>Profile</h3>
              <hr />
              <textarea
                className="descriptionp"
                id="description"
                name="description"
                rows="5"
                onChange={handleChange}
                value={formData.description || (user && user.desc) || ""}
                placeholder="Write a brief description of yourself, your background, and your goals. Highlight your key strengths and experiences."
              />
              <br />
              <h3>Highlights of Qualifications</h3>
              <hr />
              <ul>
                {formData.qualifications.map((value, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      id={`qualifications-${index}`}
                      name={`qualifications-${index}`}
                      className="input-field"
                      onChange={handleChange}
                      value={value}
                      placeholder={`Qualification ${index + 1}`}
                    />
                    {errors.qualifications[index] && (
                      <span className="error">
                        {errors.qualifications[index]}
                      </span>
                    )}
                  </div>
                ))}
              </ul>
              <h3>Education</h3>
              <hr />
              <dl>
                {formData.education.map((value, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      id={`education-${index}-institution`}
                      name={`education-${index}-institution`}
                      className="input-field"
                      onChange={handleChange}
                      value={value.institution || ""}
                      placeholder="University/Institution"
                    />
                    {errors.education[index].institution && (
                      <span className="error">
                        {errors.education[index].institution}
                      </span>
                    )}
                    <input
                      type="text"
                      id={`education-${index}-degree`}
                      name={`education-${index}-degree`}
                      className="input-field"
                      onChange={handleChange}
                      value={value.degree || ""}
                      placeholder="Degree/Program"
                    />
                    {errors.education[index].degree && (
                      <span className="error">
                        {errors.education[index].degree}
                      </span>
                    )}
                  </div>
                ))}
              </dl>

              <button className="btn-submit" id="formsubmit" type="submit">
                Save Changes
              </button>
              {message && <p className="success-message">{message}</p>}
            </div>
          </div>

          <div className="submit-section"></div>
        </form>
      </section>
    </div>
  );
};

export default CVSection;
