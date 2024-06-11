import React, { useEffect, useState } from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import axios from "axios";
import newRequest from "./../../../utils/newRequest.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./../button.scss";
import "../Table.scss";

export default function App() {
  const [reviews, setReviews] = useState([]);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewData, setEditReviewData] = useState({});
  const [searchUsername, setSearchUsername] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await newRequest.post("/admin/ratingDetails");
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.post(
        `https://fiverr-clone-backend-git-main-malindudelpitiya55s-projects.vercel.app/api/admin/ratingDelete/${reviewId}`
      );
      await fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleEdit = (review) => {
    setEditReviewId(review.id);
    setEditReviewData({
      gigTitle: review.gigTitle,
      review: review.review,
    });
  };

  const handleSave = async (reviewId) => {
    try {
      await axios.post(
        `https://fiverr-clone-backend-git-main-malindudelpitiya55s-projects.vercel.app/api/admin/ratingUpdate/${reviewId}`,
        editReviewData
      );
      setEditReviewId(null);
      setEditReviewData({});
      await fetchReviews();
    } catch (error) {
      console.error("Error saving review:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditReviewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const generatePDF = async () => {
    const reviewTable = document.getElementById('reviewTable');
    reviewTable.classList.add('hide-actions'); // Add class to hide actions column

    const canvas = await html2canvas(reviewTable, { allowTaint: true, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("reviews.pdf");

    reviewTable.classList.remove('hide-actions'); // Remove class to restore actions column
  };

  const handleSearchUsernameChange = (event) => {
    setSearchUsername(event.target.value);
  };

  const filteredReviews = reviews
    .filter((review) => review.userID.username.toLowerCase().includes(searchUsername.toLowerCase()))
    .sort((a, b) => {
      const aStartsWith = a.userID.username.toLowerCase().startsWith(searchUsername.toLowerCase());
      const bStartsWith = b.userID.username.toLowerCase().startsWith(searchUsername.toLowerCase());

      if (aStartsWith && !bStartsWith) {
        return -1;
      }
      if (!aStartsWith && bStartsWith) {
        return 1;
      }
      return 0;
    });

  return (
    <div className="te">
      <center>
        <h1 className="fw-bold">RATING AND REVIEW</h1>
      </center>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by username"
          value={searchUsername}
          onChange={handleSearchUsernameChange}
        /> 
          <button onClick={generatePDF} className="buttongenerate" role="button">
          Generate PDF
        </button>
       
      </div>
      <MDBTable align="middle" striped hover id="reviewTable">
        <MDBTableHead>
          <tr className="table-dark">
            <th scope="col">Rating ID</th>
            <th scope="col">Gig Title</th>
            <th scope="col">Review</th>
            <th scope="col">Buyer Name</th>
            <th scope="col" className="actions-column">Actions</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {filteredReviews.map((review) => (
            <tr key={review.id}>
              <td>
                <p className="fw-normal mb-1">{review.id}</p>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={review.cover}
                    alt=""
                    style={{ width: "45px", height: "45px" }}
                    className="rounded-1"
                  />
                  <div className="ms-3">
                    <p className="tit fw-normal mb-1">{review.gigTitle}</p>
                  </div>
                </div>
              </td>
              <td>
                {editReviewId === review.id ? (
                  <input
                    type="text"
                    name="review"
                    value={editReviewData.review}
                    onChange={handleChange}
                  />
                ) : (
                  <p className="rev fw-normal mb-1">{review.review}</p>
                )}
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={review.userID.img}
                    alt=""
                    style={{ width: "45px", height: "45px" }}
                    className="rounded-circle"
                  />
                  <div className="ms-3">
                    <p className="fw-bold mb-1">{review.userID.username}</p>
                    <p className="text-muted mb-0">{review.userID.email}</p>
                  </div>
                </div>
              </td>
              <td className="actions-column">
                <center>
                  {editReviewId === review.id ? (
                    <button
                      className="buttonsave"
                      role="button"
                      onClick={() => handleSave(review.id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="buttonedit"
                      role="button"
                      onClick={() => handleEdit(review)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="buttondelete"
                    role="button"
                    onClick={() => handleDelete(review.id)}
                  >
                    Delete
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
