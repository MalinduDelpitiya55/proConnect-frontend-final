import React, {useEffect, useState} from "react";
import {MDBBadge, MDBTable, MDBTableHead, MDBTableBody} from "mdb-react-ui-kit"; // Assuming MDBReact components for table and badges
import axios from "axios"; // Axios for HTTP requests
import newRequest from "./../../../utils/newRequest.js"; // Custom Axios instance
import Noavatar from "../../../../public/img/noavatar.jpg"; // Placeholder image
import jsPDF from "jspdf"; // PDF generation library
import html2canvas from "html2canvas"; // Library to capture HTML elements as canvas
import "./../button.scss"; // Styles for buttons
import "../Table.scss"; // Styles for tables

export default function App() {
  const [buyers, setBuyers] = useState([]); // State for storing buyers data
  const [searchName, setSearchName] = useState(""); // State for search input value

  useEffect(() => {
    fetchBuyers(); // Fetch buyers data on component mount
  }, []);

  // Function to fetch buyers data from the server
  const fetchBuyers = async () => {
    try {
      const response = await newRequest.post("/admin/buyersDetails"); // Assuming endpoint for fetching buyers
      setBuyers(response.data); // Set buyers data in state
    } catch (error) {
      console.error("Error fetching buyers:", error);
    }
  };

  // Function to handle deletion of a buyer
  const handleDelete = async (buyerId) => {
    try {
      console.log(`Deleting buyer with ID: ${buyerId}`);
      await newRequest.post(`/admin/buyersDelete/${buyerId}`); // Example URL for deleting buyer
      await fetchBuyers(); // Refetch buyers data after deletion
    } catch (error) {
      console.error("Error deleting buyer:", error);
    }
  };

  // Function to generate PDF from the buyer table
  const generatePDF = async () => {
    const buyerTable = document.getElementById("buyerTable"); // Get the table element by ID
    buyerTable.classList.add("hide-actions"); // Add class to hide actions column for PDF generation

    const canvas = await html2canvas(buyerTable, {
      allowTaint: true,
      useCORS: true,
    }); // Convert table to canvas
    const imgData = canvas.toDataURL("image/png"); // Convert canvas to PNG image data
    const pdf = new jsPDF(); // Initialize jsPDF instance
    const imgProps = pdf.getImageProperties(imgData); // Get image properties
    const pdfWidth = pdf.internal.pageSize.getWidth(); // Get PDF width
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; // Calculate PDF height based on image properties
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); // Add image to PDF
    pdf.save("buyer_profiles.pdf"); // Save PDF with filename

    buyerTable.classList.remove("hide-actions"); // Remove class to restore actions column after PDF generation
  };

  // Function to handle search input change
  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value); // Update searchName state with input value
  };

  // Filtered buyers based on searchName
  const filteredBuyers = buyers
    .filter((buyer) =>
      buyer.name.toLowerCase().includes(searchName.toLowerCase())
    ) // Case-insensitive name search
    .sort((a, b) => {
      const aStartsWith = a.name
        .toLowerCase()
        .startsWith(searchName.toLowerCase()); // Check if name starts with searchName
      const bStartsWith = b.name
        .toLowerCase()
        .startsWith(searchName.toLowerCase());

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
        <h1 className="fw-bold">BUYER PROFILE</h1>
      </center>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={handleSearchNameChange}
        />
        <button onClick={generatePDF} className="buttongenerate" role="button">
          Generate PDF
        </button>
      </div>
      <MDBTable align="middle" striped hover id="buyerTable">
        <MDBTableHead>
          <tr className="table-dark">
            <th scope="col">Buyer ID</th>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col" className="actions-column">
              Actions
            </th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {filteredBuyers.map((buyer, index) => (
            <tr key={index}>
              <td>
                <p className="fw-normal mb-1">{buyer.buyerid}</p>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={buyer.img || Noavatar}
                    alt=""
                    style={{width: "45px", height: "45px"}}
                    className="rounded-circle"
                  />
                  <div className="ms-3">
                    <p className="fw-bold mb-1">{buyer.name}</p>
                    <p className="text-muted mb-0">{buyer.email}</p>
                  </div>
                </div>
              </td>
              <td>
                <MDBBadge color={buyer.statusColor} pill>
                  {buyer.status}
                </MDBBadge>
              </td>
              <td className="actions-column">
                <center>
                  <button
                    className="buttondelete"
                    role="button"
                    onClick={() => handleDelete(buyer.buyerid)}
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
