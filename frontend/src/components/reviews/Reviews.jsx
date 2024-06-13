import React, {useState, useEffect} from "react";
import axios from "axios";
import Rating from "@mui/material/Rating";
import Review from "../review/Review";
import "./Reviews.scss";
import newRequest from "../../utils/newRequest"; 
const Reviews = ({gigId}) => {
  // State variables
  const [reviews, setReviews] = useState([]); // Array to store fetched reviews
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [value, setValue] = useState(2); // Rating value state
  const [newReviewDesc, setNewReviewDesc] = useState(""); // New review description input state

  // Effect to fetch reviews when gigId changes or component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true); // Set loading to true before fetch
      try {
        // Fetch reviews for a specific gigId using Axios
        const response = await newRequest.get(`/reviews/${gigId}`);
        setReviews(response.data); // Set fetched reviews to state
      } catch (error) {
        setError(error); // Set error state if request fails
      } finally {
        setIsLoading(false); // Set loading to false after fetch (whether successful or not)
      }
    };

    fetchReviews(); // Call fetchReviews when component mounts or when gigId changes
  }, [gigId]);

  // Function to handle form submission for adding a new review
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Extract description and rating value from form
    const desc = newReviewDesc;
    const star = value;

    try {
      // Send POST request to add a new review using Axios
      const response = await newRequest.post("/reviews", {gigId, desc, star});
      // Update reviews state with newly added review
      setReviews([...reviews, response.data]); // Assuming response.data is the newly added review
      setNewReviewDesc(""); // Clear new review description input field
      setValue(2); // Reset rating value after submission
    } catch (error) {
      console.error("Error adding review:", error);
      // Handle error (show error message, etc.)
    }
  };

  // JSX rendering
  return (
    <div className="reviews">
      <h2>Reviews</h2>
      {/* Conditional rendering based on loading and error states */}
      {isLoading ? (
        "Loading..."
      ) : error ? (
        "Something went wrong!"
      ) : reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => <Review key={review._id} review={review} />)
      )}

      {/* Form to add a new review */}
      <div className="add">
        <h3>Add a review</h3>
        <form className="addForm" onSubmit={handleSubmit}>
          {/* Input for new review description */}
          <input
            type="text"
            placeholder="Write your opinion"
            value={newReviewDesc}
            onChange={(e) => setNewReviewDesc(e.target.value)} // Update newReviewDesc state on input change
          />

          {/* Rating component */}
          <Rating
            name="simple-controlled"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue); // Update rating value state on change
            }}
          />

          {/* Submit button */}
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;
