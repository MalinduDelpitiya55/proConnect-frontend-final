// Import necessary libraries and components
import React, {useEffect, useState} from "react";
import {MDBTable, MDBTableHead, MDBTableBody} from "mdb-react-ui-kit";
import newRequest from "./../../../utils/newRequest.js"; // Custom request utility
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./../button.scss"; // Custom button styles
import "../Table.scss"; // Custom table styles

// Define the main component
export default function App() {
  const [gigs, setGigs] = useState([]); // State to store gig data
  const [searchUsername, setSearchUsername] = useState(""); // State to store search input

  // Fetch payment data when the component mounts
  useEffect(() => {
    fetchpayment();
  }, []);

  // Function to fetch payment data from the server
  const fetchpayment = async () => {
    try {
      const response = await newRequest.post("/admin/getpayment"); // Make a request to fetch payments
      setGigs(response.data); // Update the gigs state with fetched data
    } catch (error) {
      console.error("Error fetching gigs:", error); // Log any errors
    }
  };

  // Function to handle deleting a gig
  const handleDelete = async (gigId) => {
    try {
      console.log(`${gigId}`); // Log the gig ID to be deleted
      await newRequest.post(`/admin/deletepayment/${gigId}`); // Make a request to delete the gig
      await fetchpayment(); // Fetch updated payment data
    } catch (error) {
      console.error("Error deleting gig:", error); // Log any errors
    }
  };

  // Function to generate a PDF of the gigs table
  const generatePDF = async () => {
    const gigTable = document.getElementById("gigTable"); // Get the gigs table element
    gigTable.classList.add("hide-actions"); // Add a class to hide actions column

    const canvas = await html2canvas(gigTable, {
      allowTaint: true,
      useCORS: true,
    }); // Capture the table as a canvas
    const imgData = canvas.toDataURL("image/png"); // Convert the canvas to an image
    const pdf = new jsPDF(); // Create a new jsPDF instance
    const imgProps = pdf.getImageProperties(imgData); // Get image properties
    const pdfWidth = pdf.internal.pageSize.getWidth(); // Get PDF width
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; // Calculate PDF height
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); // Add image to PDF
    pdf.save("payments.pdf"); // Save the PDF

    gigTable.classList.remove("hide-actions"); // Remove the class to restore actions column
  };

  // Function to handle search input change
  const handleSearchUsernameChange = (event) => {
    setSearchUsername(event.target.value); // Update search input value
  };

  // Filter and sort gigs based on the search input
  const filteredGigs = gigs
    .filter((gig) =>
      gig.buyer.username.toLowerCase().includes(searchUsername.toLowerCase())
    ) // Filter gigs by buyer username
    .sort((a, b) => {
      const aStartsWith = a.buyer.username
        .toLowerCase()
        .startsWith(searchUsername.toLowerCase()); // Check if buyer username starts with search input
      const bStartsWith = b.buyer.username
        .toLowerCase()
        .startsWith(searchUsername.toLowerCase()); // Check if buyer username starts with search input

      if (aStartsWith && !bStartsWith) return -1; // Sort a before b if a starts with search input
      if (!aStartsWith && bStartsWith) return 1; // Sort b before a if b starts with search input
      return 0; // Maintain original order if both or neither starts with search input
    });

  // Render the component
  return (
    <div className="te">
      <center>
        <h1 className="fw-bold">Payment</h1> {/* Header */}
      </center>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by buyer username"
          value={searchUsername} // Bind input value to state
          onChange={handleSearchUsernameChange} // Handle input change
        />
        <button onClick={generatePDF} className="buttongenerate" role="button">
          Generate PDF {/* Button to generate PDF */}
        </button>
      </div>
      <MDBTable align="middle" striped hover id="gigTable">
        <MDBTableHead>
          <tr className="table-dark">
            <th scope="col">Order ID</th> {/* Column header for Order ID */}
            <th scope="col">Gig Title</th> {/* Column header for Gig Title */}
            <th scope="col">Seller Name</th>{" "}
            {/* Column header for Seller Name */}
            <th scope="col">Buyer Name</th> {/* Column header for Buyer Name */}
            <th scope="col">Price</th> {/* Column header for Price */}
            <th scope="col" className="actions-column">
              Actions
            </th>{" "}
            {/* Column header for Actions */}
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {filteredGigs.map((gig, index) => (
            <tr key={index}>
              <td>
                <p className="fw-normal mb-1">{gig.id}</p> {/* Gig ID */}
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={gig.gig.cover} // Gig cover image
                    alt=""
                    style={{width: "45px", height: "45px"}}
                    className="rounded-1"
                  />
                  <div className="ms-3">
                    <p className="tit fw-normal mb-1">{gig.gig.title}</p>{" "}
                    {/* Gig title */}
                  </div>
                </div>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={gig.seller.img} // Seller avatar
                    alt=""
                    style={{width: "45px", height: "45px"}}
                    className="rounded-circle"
                  />
                  <div className="ms-3">
                    <p className="fw-bold mb-1">{gig.seller.username}</p>{" "}
                    {/* Seller username */}
                    <p className="text-muted mb-0">{gig.seller.email}</p>{" "}
                    {/* Seller email */}
                  </div>
                </div>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={gig.buyer.img} // Buyer avatar
                    alt=""
                    style={{width: "45px", height: "45px"}}
                    className="rounded-circle"
                  />
                  <div className="ms-3">
                    <p className="fw-bold mb-1">{gig.buyer.username}</p>{" "}
                    {/* Buyer username */}
                    <p className="text-muted mb-0">{gig.buyer.email}</p>{" "}
                    {/* Buyer email */}
                  </div>
                </div>
              </td>
              <td>
                <div className="ms-3">
                  <p className="fw-bold mb-1">${gig.gig.price}</p>{" "}
                  {/* Gig price */}
                </div>
              </td>
              <td className="actions-column">
                <center>
                  <button
                    className="buttondelete"
                    role="button"
                    onClick={() => handleDelete(gig.id)} // Handle delete button click
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
