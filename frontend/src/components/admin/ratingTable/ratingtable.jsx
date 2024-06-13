// Import necessary libraries and components
import React, { useEffect, useState } from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import axios from "axios"; // Axios for HTTP requests
import newRequest from "./../../../utils/newRequest.js"; // Custom request utility
import jsPDF from "jspdf"; // Library to generate PDF
import html2canvas from "html2canvas"; // Library to convert HTML to canvas
import "./../button.scss"; // Custom button styles
import "../Table.scss"; // Custom table styles

// Define the main component
export default function App() {
  const [reviews, setReviews] = useState([]); // State to store review data
  const [editReviewId, setEditReviewId] = useState(null); // State to track the ID of the review being edited
  const [editReviewData, setEditReviewData] = useState({}); // State to store data of the review being edited
  const [searchUsername, setSearchUsername] = useState(""); // State to store search input

  // Fetch reviews when the component mounts
  useEffect(() => {
    fetchReviews();
  }, []);

  // Function to fetch reviews from the server
  const fetchReviews = async () => {
    try {
      const response = await newRequest.post("/admin/ratingDetails"); // Make a request to fetch reviews
      setReviews(response.data); // Update the reviews state with fetched data
    } catch (error) {
      console.error("Error fetching reviews:", error); // Log any errors
    }
  };

  // Function to handle deleting a review
  const handleDelete = async (reviewId) => {
    try {
      await newRequest.post(`/admin/ratingDelete/${reviewId}`); // Make a request to delete the review
      await fetchReviews(); // Fetch updated review data
    } catch (error) {
      console.error("Error deleting review:", error); // Log any errors
    }
  };

  // Function to handle initiating the edit of a review
  const handleEdit = (review) => {
    setEditReviewId(review.id); // Set the ID of the review being edited
    setEditReviewData({
      gigTitle: review.gigTitle,
      review: review.review,
    }); // Set the data of the review being edited
  };

  // Function to handle saving an edited review
  const handleSave = async (reviewId) => {
    try {
      await newRequest.post(`/admin/ratingUpdate/${reviewId}`, editReviewData); // Make a request to save the edited review
      setEditReviewId(null); // Clear the edit review ID
      setEditReviewData({}); // Clear the edit review data
      await fetchReviews(); // Fetch updated review data
    } catch (error) {
      console.error("Error saving review:", error); // Log any errors
    }
  };

  // Function to handle changes to the edit review form
  const handleChange = (e) => {
    const { name, value } = e.target; // Destructure the name and value from the event target
    setEditReviewData((prevData) => ({
      ...prevData,
      [name]: value,
    })); // Update the edit review data state
  };

  // Function to generate a PDF of the reviews table
  const generatePDF = async () => {
    const reviewTable = document.getElementById('reviewTable'); // Get the reviews table element
    reviewTable.classList.add('hide-actions'); // Add a class to hide actions column

    const canvas = await html2canvas(reviewTable, { allowTaint: true, useCORS: true }); // Capture the table as a canvas
    const imgData = canvas.toDataURL('image/png'); // Convert the canvas to an image
    const pdf = new jsPDF(); // Create a new jsPDF instance
    const imgProps = pdf.getImageProperties(imgData); // Get image properties
    const pdfWidth = pdf.internal.pageSize.getWidth(); // Get PDF width
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; // Calculate PDF height
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight); // Add image to PDF
    pdf.save("reviews.pdf"); // Save the PDF

    reviewTable.classList.remove('hide-actions'); // Remove the class to restore actions column
  };

  // Function to handle search input change
  const handleSearchUsernameChange = (event) => {
    setSearchUsername(event.target.value); // Update search input value
  };

  // Filter and sort reviews based on the search input
  const filteredReviews = reviews
    .filter((review) => review.userID.username.toLowerCase().includes(searchUsername.toLowerCase())) // Filter reviews by username
    .sort((a, b) => {
      const aStartsWith = a.userID.username.toLowerCase().startsWith(searchUsername.toLowerCase()); // Check if username starts with search input
      const bStartsWith = b.userID.username.toLowerCase().startsWith(searchUsername.toLowerCase()); // Check if username starts with search input

      if (aStartsWith && !bStartsWith) {
        return -1; // Sort a before b if a starts with search input
      }
      if (!aStartsWith && bStartsWith) {
        return 1; // Sort b before a if b starts with search input
      }
      return 0; // Maintain original order if both or neither starts with search input
    });

  // Render the component
  return (
    <div className="te">
      <center>
        <h1 className="fw-bold">RATING AND REVIEW</h1> {/* Header */}
      </center>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by username"
          value={searchUsername} // Bind input value to state
          onChange={handleSearchUsernameChange} // Handle input change
        /> 
        <button onClick={generatePDF} className="buttongenerate" role="button">
          Generate PDF {/* Button to generate PDF */}
        </button>
      </div>
      <MDBTable align="middle" striped hover id="reviewTable">
        <MDBTableHead>
          <tr className="table-dark">
            <th scope="col">Rating ID</th> {/* Column header for Rating ID */}
            <th scope="col">Gig Title</th> {/* Column header for Gig Title */}
            <th scope="col">Review</th> {/* Column header for Review */}
            <th scope="col">Buyer Name</th> {/* Column header for Buyer Name */}
            <th scope="col" className="actions-column">Actions</th> {/* Column header for Actions */}
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {filteredReviews.map((review) => (
            <tr key={review.id}>
              <td>
                <p className="fw-normal mb-1">{review.id}</p> {/* Review ID */}
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={review.cover} // Gig cover image
                    alt=""
                    style={{ width: "45px", height: "45px" }}
                    className="rounded-1"
                  />
                  <div className="ms-3">
                    <p className="tit fw-normal mb-1">{review.gigTitle}</p> {/* Gig title */}
                  </div>
                </div>
              </td>
              <td>
                {editReviewId === review.id ? (
                  <input
                    type="text"
                    name="review"
                    value={editReviewData.review} // Bind input value to state
                    onChange={handleChange} // Handle input change
                  />
                ) : (
                  <p className="rev fw-normal mb-1">{review.review}</p>
                )}
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={review.userID.img} // Buyer avatar
                    alt=""
                    style={{ width: "45px", height: "45px" }}
                    className="rounded-circle"
                  />
                  <div className="ms-3">
                    <p className="fw-bold mb-1">{review.userID.username}</p> {/* Buyer username */}
                    <p className="text-muted mb-0">{review.userID.email}</p> {/* Buyer email */}
                  </div>
                </div>
              </td>
              <td className="actions-column">
                <center>
                  {editReviewId === review.id ? (
                    <button
                      className="buttonsave"
                      role="button"
                      onClick={() => handleSave(review.id)} // Handle save button click
                    >
                      Save {/* Save button */}
                    </button>
                  ) : (
                    <button
                      className="buttonedit"
                      role="button"
                      onClick={() => handleEdit(review)} // Handle edit button click
                    >
                      Edit {/* Edit button */}
                    </button>
                  )}
                  <button
                    className="buttondelete"
                    role="button"
                    onClick={() => handleDelete(review.id)} // Handle delete button click
                  >
                    Delete {/* Delete button */}
                  </button>
                </center>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
    </div>
  );
}
