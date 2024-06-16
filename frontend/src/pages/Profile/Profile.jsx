import React, {useState, useEffect} from "react";
import Profilepic from "../../../public/img/noavatar.jpg"; // Importing default profile picture
import "./Profile.scss"; // Importing styles for the component
import getCurrentUser from "./../../utils/getCurrentUser.js"; // Importing utility function to get current user
import newRequest from "./../../utils/newRequest.js"; // Importing utility function for making API requests
import {Link} from "react-router-dom"; // Importing Link component from react-router-dom for navigation

const CVSection = () => {
  const [seller, setBuyers] = useState(null); // State for seller data
  const [user, setUser] = useState(null); // State for user data

  useEffect(() => {
    fetchsellers(); // Fetch data when component mounts
  }, []);

  const fetchsellers = async () => {
    try {
      const currentUser = getCurrentUser(); // Get current logged-in user
      const response1 = await newRequest.post(`/seller/get/${currentUser._id}`); // Fetch seller data
      const response2 = await newRequest.get(`/users/${currentUser._id}`); // Fetch user data
      const sellerData = response1.data; // Extract seller data from response
      const userData = response2.data; // Extract user data from response

      console.log(userData); // Log user data to console
      console.log("seller =>", response1); // Log seller response to console
      console.log("user =>", response2); // Log user response to console

      setBuyers(sellerData); // Set seller state with fetched data
      setUser(userData); // Set user state with fetched data
    } catch (error) {
      console.error("Error fetching buyers:", error); // Log error if fetching data fails
    }
  };

  return (
    <div className="editp">
      {" "}
      {/* Main container div */}
      <section className="container" id="cv">
        {" "}
        {/* Container for CV section */}
        <div className="cv-row">
          {" "}
          {/* Row for profile and details */}
          <div className="profile-section">
            {" "}
            {/* Profile section */}
            <img
              className="profile-pic"
              src={(user && user.img) || Profilepic} // Display user's profile picture, fallback to default if not available
              alt="profile-img"
            />
            <h2 className="name-title">{(user && user.username) || ""}</h2>{" "}
            {/* Display username */}
            <ul className="contact-info">
              {" "}
              {/* Contact information */}
              <li>
                <h3>{(seller && seller.title) || "Your Role"}</h3>{" "}
                {/* Display seller's title or default text */}
              </li>
              <li>{(user && user.country) || ""}</li>{" "}
              {/* Display user's country */}
            </ul>
            <h5 className="titlep">Technical Skills</h5>{" "}
            {/* Title for technical skills */}
            <ul className="list-unstyled">
              {" "}
              {/* List for technical skills */}
              <li>{(seller && seller.skills[0]) || ""}</li>{" "}
              {/* Display first skill */}
              <li>{(seller && seller.skills[1]) || ""}</li>{" "}
              {/* Display second skill */}
              <li>{(seller && seller.skills[2]) || ""}</li>{" "}
              {/* Display third skill */}
            </ul>
          </div>
          <div className="details-section">
            {" "}
            {/* Details section */}
            <Link to="/profileedit">
              {" "}
              {/* Link to profile edit page */}
              <button
                className="btn-edit"
                id="formsubmit"
                // onClick={handleClick} // Uncomment to add onClick handler
              >
                Edit
              </button>
            </Link>
            <h3 className="titlep">Profile</h3>{" "}
            {/* Title for profile section */}
            <hr className="hrtagp" /> {/* Horizontal rule */}
            <p>{(user && user.desc) || ""}</p>{" "}
            {/* Display user's description */}
            <br />
            <h3 className="titlep">Highlights of Qualifications</h3>{" "}
            {/* Title for qualifications */}
            <hr className="hrtagp" /> {/* Horizontal rule */}
            <ul className="list-unstyled">
              {" "}
              {/* List for qualifications */}
              <li>{(seller && seller.qualifications[0]) || ""}</li>{" "}
              {/* Display first qualification */}
              <li>{(seller && seller.qualifications[1]) || ""}</li>{" "}
              {/* Display second qualification */}
            </ul>
            <h3 className="titlep">Education</h3> {/* Title for education */}
            <hr className="hrtagp" /> {/* Horizontal rule */}
            <dl>
              <dd>{(seller && seller.education[0].degree) || ""}</dd>{" "}
              {/* Display first education degree */}
              <dd>{(seller && seller.education[0].institution) || ""}</dd>{" "}
              {/* Display first education institution */}
              <br />
              <dd>{(seller && seller.education[1].degree) || ""}</dd>{" "}
              {/* Display second education degree */}
              <dd>{(seller && seller.education[1].institution) || ""}</dd>{" "}
              {/* Display second education institution */}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CVSection;
