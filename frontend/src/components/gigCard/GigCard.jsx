import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import newRequest from "../../utils/newRequest"; // Importing Axios instance for API requests
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS for styling
import Profilepic from "./../../../public/img/noavatar.jpg"; // Placeholder image for user profile picture
import './GigCard.scss'

const GigCard = ({ item }) => {

  // State to store user data, loading state, and error state
  const [userData, setUserData] = useState(null); // State for user data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // useEffect hook to fetch user data when component mounts or item.userId changes
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data based on item.userId
        const response = await newRequest.get(`/users/${item.userId}`);
        

        setUserData(response.data); // Set user data from API response
        setIsLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.log(error);
         // Set error state if there's an error during fetching
        setIsLoading(false); // Set loading state to false in case of error
      }
      console.log(setUserData);
    };
    fetchUserData(); // Invoke the fetchUserData function
  }, [item.userId]); // useEffect dependency on item.userId
console.log(item.totalStars);
  // Calculate the star rating based on item.totalStars and item.starNumber
  const rating = !isNaN(item.totalStars / item.starNumber)
    ? Math.round(item.totalStars / item.starNumber)
    : "N/A";

  // Handle loading state while fetching data
  if (isLoading) return <div>Loading...</div>;

  // Handle error state if there's an error during data fetching
  if (error) return <div>Error loading data: {error}</div>;

  // Render gig card details with fetched user data and item details
  return (
    <Link to={`/gig/${item._id}`} className="link">
      <div className="card gigCard">
        {/* Gig cover image */}
        <img src={item.cover} className="card-img-top cover" alt="Cover" />
        <div className="card-body">
          <div className="d-flex flex-row info">
            <div className="user">
              {/* User profile picture */}
              <img src={userData?.img || Profilepic} alt="User" />
              <span>{userData?.username || "User Not Found"}</span>
            </div>
          </div>
          <div className="title">
            <p className="card-text">{item.title}</p>
          </div>
        </div>
        <ul className="list-group list-group-flush">
          <div className="info">
            <div className="star">
              {/* Star rating */}
              <img src="./img/star.png" alt="Star" />
              <span>{rating}</span>
            </div>
          </div>
        </ul>
        <div className="card-body">
          <div className="price d-flex justify-content-between">
            <span>STARTING AT</span>
            <h2>$ {item.price}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
