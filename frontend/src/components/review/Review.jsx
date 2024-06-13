import React, {useState, useEffect} from "react";
import newRequest from "../../utils/newRequest";
import "./Review.scss";

const Review = ({review}) => {
  // State variables
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});

  // Function to fetch user data based on userId
  const fetchUserData = async (userId) => {
    try {
      const response = await newRequest.get(`/users/${userId}`);
      setUserData(response.data); // Set user data upon successful fetch
      setIsLoading(false); // Update loading state
    } catch (error) {
      setError("Error fetching user data"); // Set error state if fetch fails
      setIsLoading(false); // Update loading state
    }
  };

  useEffect(() => {
    fetchUserData(review.userId); // Fetch user data when component mounts
  }, [review.userId]);

  // Function to render star images based on review.star
  const renderStars = (star) => {
    const starCount = parseInt(star, 10); // Convert star to integer
    if (isNaN(starCount) || starCount <= 0) return null;

    const stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push(<img src="/img/star.png" alt="Star" key={i} />);
    }
    return stars;
  };

  return (
    <div className="review">
      {/* Conditionally render loading, error, or user data */}
      {isLoading ? (
        "Loading..."
      ) : error ? (
        "Error loading data"
      ) : (
        <div className="user">
          {/* Render user profile picture or default avatar */}
          <img
            className="pp"
            src={userData.img || "/img/noavatar.jpg"}
            alt="User"
          />
          <div className="info">
            <span>{userData.username}</span> {/* Render username */}
            <div className="country">
              <span>{userData.country}</span> {/* Render country */}
            </div>
          </div>
        </div>
      )}
      <div className="stars">
        {renderStars(review.star)}{" "}
        {/* Render star images based on review.star */}
        <span>{review.star}</span> {/* Display star rating number */}
      </div>
      <p>{review.desc}</p> {/* Display review description */}
    </div>
  );
};

export default Review;
