import React, { useEffect, useState } from "react";
import { MDBBadge, MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import axios from "axios";
import newRequest from "./../../../utils/newRequest.js";
import Noavatar from "../../../../public/img/noavatar.jpg";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./../button.scss";
import "../Table.scss";

export default function App() {
  const [buyers, setBuyers] = useState([]);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      const response = await newRequest.post("/admin/buyersDetails");
      setBuyers(response.data);
    } catch (error) {
      console.error("Error fetching buyers:", error);
    }
  };

  const handleDelete = async (buyerId) => {
    try {
      console.log(`Deleting buyer with ID: ${buyerId}`);
      await axios.post(`http://localhost:8800/api/admin/buyersDelete/${buyerId}`);
      await fetchBuyers();
    } catch (error) {
      console.error("Error deleting buyer:", error);
    }
  };

  const generatePDF = async () => {
    const buyerTable = document.getElementById('buyerTable');
    buyerTable.classList.add('hide-actions'); // Add class to hide actions column

    const canvas = await html2canvas(buyerTable, { allowTaint: true, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("buyer_profiles.pdf");

    buyerTable.classList.remove('hide-actions'); // Remove class to restore actions column
  };

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
  };

  const filteredBuyers = buyers
    .filter((c) => c.name.toLowerCase().includes(searchName.toLowerCase()))
    .sort((a, b) => {
      const aStartsWith = a.name.toLowerCase().startsWith(searchName.toLowerCase());
      const bStartsWith = b.name.toLowerCase().startsWith(searchName.toLowerCase());

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
            <th scope="col" className="actions-column">Actions</th>
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
                    style={{ width: "45px", height: "45px" }}
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
