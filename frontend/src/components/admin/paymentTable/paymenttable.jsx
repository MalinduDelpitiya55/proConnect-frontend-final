import React, { useEffect, useState } from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import newRequest from "./../../../utils/newRequest.js";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./../button.scss";
import "../Table.scss";

export default function App() {
  const [gigs, setGigs] = useState([]);
  const [searchUsername, setSearchUsername] = useState("");

  useEffect(() => {
    fetchpayment();
  }, []);

  const fetchpayment = async () => {
    try {
      const response = await newRequest.post("/admin/getpayment");
      setGigs(response.data);
    } catch (error) {
      console.error("Error fetching gigs:", error);
    }
  };

  const handleDelete = async (gigId) => {
    try {
      console.log(`${gigId}`);
      await axios.post(`http://localhost:8800/api/admin/deletepayment/${gigId}`);
      await fetchpayment();
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
    pdf.save("payments.pdf");

    gigTable.classList.remove('hide-actions'); // Remove class to restore actions column
  };

  const handleSearchUsernameChange = (event) => {
    setSearchUsername(event.target.value);
  };

  const filteredGigs = gigs
    .filter((gig) => gig.buyer.username.toLowerCase().includes(searchUsername.toLowerCase()))
    .sort((a, b) => {
      const aStartsWith = a.buyer.username.toLowerCase().startsWith(searchUsername.toLowerCase());
      const bStartsWith = b.buyer.username.toLowerCase().startsWith(searchUsername.toLowerCase());

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
        <h1 className="fw-bold">Payment</h1>
      </center>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by buyer username"
          value={searchUsername}
          onChange={handleSearchUsernameChange}
        />
        <button onClick={generatePDF} className="buttongenerate" role="button">
          Generate PDF
        </button>
      </div>
      <MDBTable align="middle" striped hover id="gigTable">
        <MDBTableHead>
          <tr className="table-dark">
            <th scope="col">Order ID</th>
            <th scope="col">Gig Title</th>
            <th scope="col">Seller Name</th>
            <th scope="col">Buyer Name</th>
            <th scope="col">Price</th>
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
                    src={gig.gig.cover}
                    alt=""
                    style={{ width: "45px", height: "45px" }}
                    className="rounded-1"
                  />
                  <div className="ms-3">
                    <p className="tit fw-normal mb-1">{gig.gig.title}</p>
                  </div>
                </div>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={gig.seller.img}
                    alt=""
                    style={{ width: "45px", height: "45px" }}
                    className="rounded-circle"
                  />
                  <div className="ms-3">
                    <p className="fw-bold mb-1">{gig.seller.username}</p>
                    <p className="text-muted mb-0">{gig.seller.email}</p>
                  </div>
                </div>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={gig.buyer.img}
                    alt=""
                    style={{ width: "45px", height: "45px" }}
                    className="rounded-circle"
                  />
                  <div className="ms-3">
                    <p className="fw-bold mb-1">{gig.buyer.username}</p>
                    <p className="text-muted mb-0">{gig.buyer.email}</p>
                  </div>
                </div>
              </td>
              <td>
                <div className="ms-3">
                  <p className="fw-bold mb-1">${gig.gig.price}</p>
                </div>
              </td>
              <td className="actions-column">
                <center>
                  <button
                    className="buttondelete"
                    role="button"
                    onClick={() => handleDelete(gig.id)}
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
