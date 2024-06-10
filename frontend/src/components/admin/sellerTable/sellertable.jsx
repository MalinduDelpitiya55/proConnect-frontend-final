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
  const [seller, setSeller] = useState([]);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    fetchSeller();
  }, []);

  const fetchSeller = async () => {
    try {
      const response = await newRequest.post("/admin/sellerDetails");
      setSeller(response.data);
    } catch (error) {
      console.error("Error fetching seller:", error);
    }
  };

  const handleDelete = async (sellerId) => {
    try {
      console.log(`Deleting seller with ID: ${sellerId}`);
      await axios.post(`http://localhost:8800/api/admin/sellerDelete/${sellerId}`);
      await fetchSeller();
    } catch (error) {
      console.error("Error deleting seller:", error);
    }
  };

  const generatePDF = async () => {
    const sellerTable = document.getElementById('sellerTable');
    sellerTable.classList.add('hide-actions'); // Add class to hide actions column

    const canvas = await html2canvas(sellerTable, { allowTaint: true, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("seller_profiles.pdf");

    sellerTable.classList.remove('hide-actions'); // Remove class to restore actions column
  };

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
  };

  const filteredSellers = seller
    .filter((s) => s.name.toLowerCase().includes(searchName.toLowerCase()))
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
          <h1 className="fw-bold">SELLER PROFILE</h1>
        </center>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name"
            value={searchName}
            onChange={handleSearchNameChange}
          />
          <button
            onClick={generatePDF}
            className="buttongenerate"
            role="button"
          >
            Generate PDF
          </button>
        </div>
        <MDBTable align="middle" striped hover id="sellerTable">
          <MDBTableHead>
            <tr className="table-dark">
              <th scope="col">Seller ID</th>
              <th scope="col">Name</th>
              <th scope="col">Title</th>
              <th scope="col" className="actions-column">
                Status
              </th>
              <th scope="col" className="actions-column">
                Actions
              </th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {filteredSellers.map((seller, index) => (
              <tr key={index}>
                <td>
                  <p className="fw-normal mb-1">{seller.sellerid}</p>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={seller.img || Noavatar}
                      alt=""
                      style={{width: "45px", height: "45px"}}
                      className="rounded-circle"
                    />
                    <div className="ms-3">
                      <p className="fw-bold mb-1">{seller.name}</p>
                      <p className="text-muted mb-0">{seller.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p className="fw-normal mb-1">{seller.title}</p>
                </td>
                <td className="actions-column">
                  <MDBBadge color={seller.statusColor} pill>
                    {seller.status}
                  </MDBBadge>
                </td>
                <td className="actions-column">
                  <center>
                    <button
                      className="buttondelete"
                      role="button"
                      onClick={() => handleDelete(seller.sellerid)}
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
