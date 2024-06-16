import React, {useState, useEffect} from "react";
import PopupForm from "../../components/PopupForm/PopupForm";
import "./Gig.scss";
import {useParams, useNavigate} from "react-router-dom";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";
import Greencheck from "../../../public/img/greencheck.png";
import Recycle from "../../../public/img/recycle.png";
import Clock from "../../../public/img/clock.png";
import Noavatar from "../../../public/img/noavatar.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Gig() {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const {id} = useParams(); // Get the 'id' parameter from the URL
  const [showPopupForm, setShowPopupForm] = useState(false); // State to manage the visibility of the popup form
  const [formData, setFormData] = useState(null); // State to store form data
  const [gigData, setGigData] = useState(null); // State to store fetched gig data
  const [userData, setUserData] = useState(null); // State to store fetched user data
  const [loadingGig, setLoadingGig] = useState(true); // State to manage loading status for gig data
  const [loadingUser, setLoadingUser] = useState(true); // State to manage loading status for user data
  const [errorGig, setErrorGig] = useState(null); // State to store error message for gig data
  const [errorUser, setErrorUser] = useState(null); // State to store error message for user data

  const handlePopupFormSubmit = (data) => {
    setFormData(data); // Store the form data
    navigate(`/pay/${id}`, {state: {formData: data, gigId: id}}); // Navigate to the payment page with the form data and gig ID
  };

  // Fetch gig data when component mounts or 'id' changes
  useEffect(() => {
    const fetchGig = async () => {
      try {
        const response = await newRequest.get(`/gigs/single/${id}`); // Fetch gig data from the API
        setGigData(response.data); // Store the fetched data in state
      } catch (error) {
        setErrorGig("Something went wrong!"); // Set error message if there's an error
      } finally {
        setLoadingGig(false); // Set loading to false when the fetch completes
      }
    };

    fetchGig(); // Call the fetch function
  }, [id]); // Dependency array ensures this runs when 'id' changes

  // Fetch user data when gigData.userId is available
  useEffect(() => {
    if (!gigData?.userId) return; // If no userId, exit early

    const fetchUser = async () => {
      try {
        const response = await newRequest.get(`/users/${gigData.userId}`); // Fetch user data from the API
        setUserData(response.data); // Store the fetched data in state
      } catch (error) {
        setErrorUser("Something went wrong!"); // Set error message if there's an error
      } finally {
        setLoadingUser(false); // Set loading to false when the fetch completes
      }
    };

    fetchUser(); // Call the fetch function
  }, [gigData]); // Dependency array ensures this runs when 'gigData' changes

  return (
    <div className="gig">
      {loadingGig ? ( // If gig data is loading, show loading text
        "loading"
      ) : errorGig ? ( // If there's an error, show error message
        errorGig
      ) : (
        <div className="container">
          <div className="left">
            <div
              id="carouselExampleInterval"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {gigData.images.map((img, index) => (
                  <div
                    key={index}
                    className={`carousel-item ${index === 0 ? "active" : ""}`} // Set the first image as active
                    data-bs-interval="10000"
                  >
                    <img
                      src={img}
                      className="d-block w-100 bordered-img" // Add a CSS class for styling
                      alt="..."
                    />
                  </div>
                ))}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleInterval"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleInterval"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
            <h2>About This Gig</h2>
            <p className="pt">{gigData.desc}</p>
            {loadingUser ? ( // If user data is loading, show loading text
              "loading"
            ) : errorUser ? ( // If there's an error, show error message
              errorUser
            ) : (
              <div className="seller">
                <h2>About The Seller</h2>
                <div className="user">
                  <img src={userData.img || Noavatar} alt="" />
                  <div className="info">
                    <span>{userData.username}</span>
                    <button>View</button>
                  </div>
                </div>
                <div className="box">
                  <div className="items">
                    <div className="item">
                      <span className="title">From</span>
                      <span className="desc">{userData.country}</span>
                    </div>
                    <div className="item">
                      <span className="title">Member since</span>
                      <span className="desc">May 2024</span>
                    </div>
                    <div className="item">
                      <span className="title">Avg. response time</span>
                      <span className="desc">4 hours</span>
                    </div>
                    <div className="item">
                      <span className="title">Languages</span>
                      <span className="desc">English</span>
                    </div>
                  </div>
                  <hr />
                  <p className="pt">{userData.desc}</p>
                </div>
              </div>
            )}
            <Reviews gigId={id} /> {/* Render reviews component */}
          </div>
          <div className="right">
            <div className="price">
              <h3>{gigData.shortTitle}</h3>
              <h2>$ {gigData.price}</h2>
            </div>
            <p className="pt">{gigData.shortDesc}</p>
            <div className="details">
              <div className="item">
                <img src={Clock} alt="" />
                <span>{gigData.deliveryTime} Days Delivery</span>
              </div>
              <div className="item">
                <img src={Recycle} alt="" />
                <span>{gigData.revisionNumber} Revisions</span>
              </div>
            </div>
            <div className="features">
              {gigData.features.map((feature) => (
                <div className="item" key={feature}>
                  <img src={Greencheck} alt="" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowPopupForm(true)}>Continue</button>
            {showPopupForm && (
              <PopupForm onSubmit={handlePopupFormSubmit} />
            )}{" "}
            {/* Show popup form if showPopupForm is true */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Gig;
