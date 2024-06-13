import React, {useEffect, useState} from "react";
import {MDBTable, MDBTableHead, MDBTableBody} from "mdb-react-ui-kit"; // MDBReact components for table
import axios from "axios"; // Axios for HTTP requests
import newRequest from "./../../../utils/newRequest.js"; // Custom Axios instance for API requests
import jsPDF from "jspdf"; // Library for generating PDFs
import html2canvas from "html2canvas"; // Library for converting HTML to canvas
import "./../button.scss"; // Styles for buttons
import "../Table.scss"; // Styles for tables

export default function App() {
  const [gigs, setGigs] = useState([]); // State for storing gigs data
  const [searchTitle, setSearchTitle] = useState(""); // State for search input value

  useEffect(() => {
    fetchGigs(); // Fetch gigs data on component mount
  }, []);

  // Function to fetch gigs data from the server
  const fetchGigs = async () => {
    try {
      const response = await newRequest.post("/admin/gigsDetails"); // Assuming endpoint for fetching gigs
      setGigs(response.data); // Set gigs data in state
    } catch (error) {
      console.error("Error fetching gigs:", error);
    }
  };

  // Function to handle deletion of a gig
  const handleDelete = async (gigId) => {
    try {
      console.log(`${gigId}`);
      await newRequest.post(`/admin/deleteGig/${gigId}`); // Example URL for deleting gig
      await fetchGigs(); // Refetch gigs data after deletion
    } catch (error) {
      console.error("Error deleting gig:", error);
    }
  };

  // Function to generate PDF from the gig table
  const generatePDF = async () => {
    const gigTable = document.getElementById("gigTable"); // Get the table element by ID
    gigTable.classList.add("hide-actions"); // Add class to hide actions column for PDF generation

    const canvas = await html2canvas(gigTable, {
      allowTaint: true,
      useCORS: true,
    }); // Convert table to canvas
    const imgData = canvas.toDataURL("image/png"); // Convert canvas to PNG image data
    const pdf = new jsPDF(); // Initialize jsPDF instance
    const imgProps = pdf.getImageProperties(imgData); // Get image properties
    const pdfWidth = pdf.internal.pageSize.getWidth(); // Get PDF width
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; // Calculate PDF height based on image properties
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); // Add image to PDF
    pdf.save("gigs_profiles.pdf"); // Save PDF with filename

    gigTable.classList.remove("hide-actions"); // Remove class to restore actions column after PDF generation
  };

  // Function to handle search input change
  const handleSearchTitleChange = (event) => {
    setSearchTitle(event.target.value); // Update searchTitle state with input value
  };

  // Filter gigs based on searchTitle
  const filteredGigs = gigs
    .filter((gig) =>
      gig.title.toLowerCase().includes(searchTitle.toLowerCase())
    ) // Case-insensitive title search
    .sort((a, b) => {
      const aStartsWith = a.title
        .toLowerCase()
        .startsWith(searchTitle.toLowerCase()); // Check if title starts with searchTitle
      const bStartsWith = b.title
        .toLowerCase()
        .startsWith(searchTitle.toLowerCase());

      if (aStartsWith && !bStartsWith) {
        return -1;
      }
      if (!aStartsWith && bStartsWith) {
        return 1;
      }
      return 0;
    });

  // JSX rendering of the component
  return (
    <div className="te">
      <center>
        <h1 className="fw-bold">GIGS</h1>
      </center>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Gig Title"
          value={searchTitle}
          onChange={handleSearchTitleChange}
        />
        <button onClick={generatePDF} className="buttongenerate" role="button">
          Generate PDF
        </button>
      </div>
      <MDBTable align="middle" striped hover id="gigTable">
        <MDBTableHead>
          <tr className="table-dark">
            <th scope="col">Gig ID</th>
            <th scope="col">Gig Title</th>
            <th scope="col">Seller Name</th>
            <th scope="col" className="actions-column">
              Actions
            </th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {filteredGigs.map((gig, index) => (
            <tr key={index}>
              <td>
                <p className="fw-normal mb-1">{gig.id}</p>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={gig.cover}
                    alt=""
                    style={{width: "45px", height: "45px"}}
                    className="rounded-1"
                  />
                  <div className="ms-3">
                    <p className="fw-normal mb-1">{gig.title}</p>
                  </div>
                </div>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={gig.userID.img}
                    alt=""
                    style={{width: "45px", height: "45px"}}
                    className="rounded-circle"
                  />
                  <div className="ms-3">
                    <p className="fw-bold mb-1">{gig.userID.username}</p>
                    <p className="text-muted mb-0">{gig.userID.email}</p>
                  </div>
                </div>
              </td>
              <td className="actions-column">
                <center>
                  <button
                    className="buttondelete"
                    onClick={() => handleDelete(gig.id)}
                    role="button"
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
