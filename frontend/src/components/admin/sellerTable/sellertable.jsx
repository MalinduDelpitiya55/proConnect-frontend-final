// Import necessary libraries and components
import React, {useEffect, useState} from "react";
import {MDBBadge, MDBTable, MDBTableHead, MDBTableBody} from "mdb-react-ui-kit";
import newRequest from "./../../../utils/newRequest.js";
import Noavatar from "../../../../public/img/noavatar.jpg";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./../button.scss"; // Custom button styles
import "../Table.scss"; // Custom table styles

// Define the main component
export default function App() {
  const [seller, setSeller] = useState([]); // State to store seller data
  const [searchName, setSearchName] = useState(""); // State to store search input

  // Fetch sellers when the component mounts
  useEffect(() => {
    fetchSeller();
  }, []);

  // Function to fetch seller data from the server
  const fetchSeller = async () => {
    try {
      const response = await newRequest.post("/admin/sellerDetails"); // Make a request to fetch sellers
      setSeller(response.data); // Update the seller state with fetched data
    } catch (error) {
      console.error("Error fetching seller:", error); // Log any errors
    }
  };

  // Function to handle deleting a seller
  const handleDelete = async (sellerId) => {
    try {
      console.log(`Deleting seller with ID: ${sellerId}`);
      await newRequest.post(`/admin/sellerDelete/${sellerId}`); // Make a request to delete the seller
      await fetchSeller(); // Fetch updated seller data
    } catch (error) {
      console.error("Error deleting seller:", error); // Log any errors
    }
  };

  // Function to generate a PDF of the sellers table
  const generatePDF = async () => {
    const sellerTable = document.getElementById("sellerTable"); // Get the sellers table element
    sellerTable.classList.add("hide-actions"); // Add a class to hide actions column

    const canvas = await html2canvas(sellerTable, {
      allowTaint: true,
      useCORS: true,
    }); // Capture the table as a canvas
    const imgData = canvas.toDataURL("image/png"); // Convert the canvas to an image
    const pdf = new jsPDF(); // Create a new jsPDF instance
    const imgProps = pdf.getImageProperties(imgData); // Get image properties
    const pdfWidth = pdf.internal.pageSize.getWidth(); // Get PDF width
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; // Calculate PDF height
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); // Add image to PDF
    pdf.save("seller_profiles.pdf"); // Save the PDF

    sellerTable.classList.remove("hide-actions"); // Remove the class to restore actions column
  };

  // Function to handle search input change
  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value); // Update search input value
  };

  // Filter and sort sellers based on the search input
  const filteredSellers = seller
    .filter((s) => s.name.toLowerCase().includes(searchName.toLowerCase())) // Filter sellers by name
    .sort((a, b) => {
      const aStartsWith = a.name
        .toLowerCase()
        .startsWith(searchName.toLowerCase()); // Check if name starts with search input
      const bStartsWith = b.name
        .toLowerCase()
        .startsWith(searchName.toLowerCase()); // Check if name starts with search input

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
        <h1 className="fw-bold">SELLER PROFILE</h1> {/* Header */}
      </center>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName} // Bind input value to state
          onChange={handleSearchNameChange} // Handle input change
        />
        <button onClick={generatePDF} className="buttongenerate" role="button">
          Generate PDF {/* Button to generate PDF */}
        </button>
      </div>
      <MDBTable align="middle" striped hover id="sellerTable">
        <MDBTableHead>
          <tr className="table-dark">
            <th scope="col">Seller ID</th> {/* Column header for Seller ID */}
            <th scope="col">Name</th> {/* Column header for Name */}
            <th scope="col">Title</th> {/* Column header for Title */}
            <th scope="col" className="actions-column">
              Status {/* Column header for Status */}
            </th>
            <th scope="col" className="actions-column">
              Actions {/* Column header for Actions */}
            </th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {filteredSellers.map((seller, index) => (
            <tr key={index}>
              <td>
                <p className="fw-normal mb-1">{seller.sellerid}</p>{" "}
                {/* Seller ID */}
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={seller.img || Noavatar} // Seller avatar or default image
                    alt=""
                    style={{width: "45px", height: "45px"}}
                    className="rounded-circle"
                  />
                  <div className="ms-3">
                    <p className="fw-bold mb-1">{seller.name}</p>{" "}
                    {/* Seller name */}
                    <p className="text-muted mb-0">{seller.email}</p>{" "}
                    {/* Seller email */}
                  </div>
                </div>
              </td>
              <td>
                <p className="fw-normal mb-1">{seller.title}</p>{" "}
                {/* Seller title */}
              </td>
              <td className="actions-column">
                <MDBBadge color={seller.statusColor} pill>
                  {seller.status} {/* Seller status */}
                </MDBBadge>
              </td>
              <td className="actions-column">
                <center>
                  <button
                    className="buttondelete"
                    role="button"
                    onClick={() => handleDelete(seller.sellerid)} // Handle delete button click
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
