import  { useState, useEffect } from "react";
import "./Profileedit.scss";
import Axios from "axios";
import Noavatar from "./../../../public/img/noavatar.jpg";
import newRequest from "./../../utils/newRequest.js";
import getCurrentUser from "./../../utils/getCurrentUser.js";

const CVSection = () => {
  // Get user data
  const [buyers, setBuyers] = useState(null);
  const [user, setUser] = useState(null);

  // Form data and submission
  const [formData, setFormData] = useState({
    title: "",
    skills: ["", "", ""],
    qualifications: ["", ""],
    education: [
      { institution: "", degree: "" },
      { institution: "", degree: "" },
    ],
  });

  // Validation state
  const [errors, setErrors] = useState({
    skills: ["", "", ""],
    qualifications: ["", ""],
    education: [
      { institution: "", degree: "" },
      { institution: "", degree: "" },
    ],
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      const currentUser = getCurrentUser();
      const response1 = await newRequest.post(`/seller/get/${currentUser._id}`);
      const response2 = await newRequest.get(`/users/${currentUser._id}`);
      const sellerData = response1.data;
      const userData = response2.data;
      console.log(sellerData, userData);
      console.log(userData);
      console.log("seller =>", response1);
      console.log("user =>", response2);

      // Ensure the structure of sellerData matches the formData structure
      setFormData({
        title: sellerData.title || "",
        skills: sellerData.skills || ["", "", ""],
        qualifications: sellerData.qualifications || ["", ""],
        education: sellerData.education || [
          { institution: "", degree: "" },
          { institution: "", degree: "" },
        ],
      });
      setBuyers(sellerData);
      setUser(userData);
    } catch (error) {
      console.error("Error fetching buyers:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = getCurrentUser();
      const response = await Axios.post(
        `http://localhost:8800/api/seller/update/${currentUser._id}`,
        { id: currentUser._id, data: formData }
      );
      setMessage("Edit is successful");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handle input change with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    const [key, index, subkey] = name.split("-");

    let newFormData = { ...formData };
    let newErrors = { ...errors };

    // Validation logic
    if (key === "skills") {
      if (/[^a-zA-Z\s]/.test(value)) {
        newErrors.skills[index] = "Skills cannot contain symbols or numbers.";
      } else {
        newErrors.skills[index] = "";
      }
    } else if (key === "qualifications") {
      if (/[^a-zA-Z\s]/.test(value) || value.length < 3 || value.length > 150) {
        newErrors.qualifications[index] =
          "Qualifications must be between 3 and 150 letters and cannot contain symbols or numbers.";
      } else {
        newErrors.qualifications[index] = "";
      }
    } else if (key === "education" && subkey) {
      if (value.length < 2 || value.length > 175) {
        newErrors.education[index][subkey] =
          "Education fields must be between 2 and 175 characters.";
      } else {
        newErrors.education[index][subkey] = "";
      }
    }

    // Update formData
    if (subkey) {
      newFormData[key][index][subkey] = value;
    } else {
      newFormData[key][index] = value;
    }

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
