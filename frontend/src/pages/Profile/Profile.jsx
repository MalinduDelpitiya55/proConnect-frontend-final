import React, {useState, useEffect} from "react";
import Profilepic from "../../../public/img/noavatar.jpg";
import "./Profile.scss";
import getCurrentUser from "./../../utils/getCurrentUser.js";
import newRequest from "./../../utils/newRequest.js";
import {Link} from "react-router-dom";
const CVSection = () => {
const [seller, setBuyers] = useState(null);
const [user, setUser] = useState(null);

useEffect(() => {
  fetchsellers();
}, []);

const fetchsellers = async () => {
  try {
    const currentUser = getCurrentUser();
    const response1 = await newRequest.post(`/seller/get/${currentUser._id}`);
    const response2 = await newRequest.get(`/users/${currentUser._id}`);
    const sellerData = response1.data;
    const userData = response2.data;

    console.log(userData);
    console.log("seller =>", response1);
    console.log("user =>", response2);
    setBuyers(sellerData);
    setUser(userData);
  } catch (error) {
    console.error("Error fetching buyers:", error);
  }
};
  // const handleClick = () => {
  //   history.push("/profileedit");
  // };


  return (
    <div className="editp">
      <section className="container" id="cv">
        <div className="cv-row">
          <div className="profile-section">
            <img
              className="profile-pic"
              src={(user && user.img) || Profilepic}
              alt="profile-img"
            />
            <h2 className="name-title">{(user && user.username) || ""}</h2>
            <ul className="contact-info">
              <li>
                <h3>{seller && seller.title||"Your Role"}</h3>
              </li>
              <li>{user && user.country||""}</li>
            </ul>
            <h5 className="titlep">Technical Skills</h5>
            <ul className="list-unstyled">
              <li>{(seller && seller.skills[0]) || ""}</li>
              <li>{(seller && seller.skills[1]) || ""}</li>
              <li>{(seller && seller.skills[2]) || ""}</li>
            </ul>
          </div>
          <div className="details-section">
            <Link to="/profileedit">
              <button
                className="btn-edit"
                id="formsubmit"
                // onClick={handleClick}
              >
                Edit
              </button>
            </Link>
            <h3 className="titlep">Profile</h3>
            <hr className="hrtagp" />
            <p>{(user && user.desc) || ""}</p>
            <br />
            <h3 className="titlep">Highlights of Qualifications</h3>
            <hr className="hrtagp" />
            <ul className="list-unstyled">
              <li>{(seller && seller.qualifications[0]) || ""}</li>
              <li>{(seller && seller.qualifications[1]) || ""}</li>
            </ul>
            <h3 className="titlep">Education</h3>
            <hr className="hrtagp" />
            <dl>
              <dd>{(seller && seller.education[0].degree) || ""}</dd>
              <dd>{(seller && seller.education[0].institution) || ""}</dd>
              <br />
              <dd>{(seller && seller.education[1].degree) || ""}</dd>
              <dd>{(seller && seller.education[1].institution) || ""}</dd>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CVSection;
