import React, { useEffect, useState } from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import axios from "axios";
import newRequest from "./../../../utils/newRequest.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./../button.scss";
import "../Table.scss";

export default function App() {
  const [gigs, setGigs] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      const response = await newRequest.post("/admin/gigsDetails");
      setGigs(response.data);
    } catch (error) {
      console.error("Error fetching gigs:", error);
    }
  };

  const handleDelete = async (gigId) => {
    try {
      console.log(`${gigId}`);
      await axios.post(`http://localhost:8800/api/admin/deleteGig/${gigId}`);
      await fetchGigs();
    } catch (error) {
      console.error("Error deleting gig:", error);
    }
  };

  const generatePDF = async () => {
    const gigTable = document.getElementById('gigTable');
    gigTable.classList.add('hide-actions'); // Add class to hide actions column

    const canvas = await html2canvas(gigTable, { allowTaint: true, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("gigs_profiles.pdf");

    gigTable.classList.remove('hide-actions'); // Remove class to restore actions column
  };

  const handleSearchTitleChange = (event) => {
    setSearchTitle(event.target.value);
  };

  const filteredGigs = gigs
    .filter((gig) => gig.title.toLowerCase().includes(searchTitle.toLowerCase()))
    .sort((a, b) => {
      const aStartsWith = a.title.toLowerCase().startsWith(searchTitle.toLowerCase());
      const bStartsWith = b.title.toLowerCase().startsWith(searchTitle.toLowerCase());

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
            <th scope="col" className="actions-column">Actions</th>
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
                    style={{ width: "45px", height: "45px" }}
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
                    style={{ width: "45px", height: "45px" }}
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
