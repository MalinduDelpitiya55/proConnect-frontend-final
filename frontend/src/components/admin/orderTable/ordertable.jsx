import React, {useState, useEffect} from "react";
import {MDBTable, MDBTableHead, MDBTableBody} from "mdb-react-ui-kit";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./../button.scss";
import "../Table.scss";
import newRequest from "./../../../utils/newRequest.js";
const App = () => {
  const [orders, setOrders] = useState([]);
  const [searchUsername, setSearchUsername] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await newRequest.post(`/admin/getpayment`);
      const fetchedOrders = response.data; // Replace with actual data property name
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      console.log(`${orderId}`);
      await newRequest.post(`/admin/deletepayment/${orderId}`);
      await fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const generatePDF = async () => {
    const orderTable = document.getElementById("orderTable");
    orderTable.classList.add("hide-actions"); // Add class to hide actions column

    const canvas = await html2canvas(orderTable, {
      allowTaint: true,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("orders.pdf");

    orderTable.classList.remove("hide-actions"); // Remove class to restore actions column
  };

  const handleSearchUsernameChange = (event) => {
    setSearchUsername(event.target.value);
  };

  const filteredOrders = orders
    .filter((order) =>
      order.buyer?.username.toLowerCase().includes(searchUsername.toLowerCase())
    )
    .sort((a, b) => {
      const aStartsWith = a.buyer?.username
        .toLowerCase()
        .startsWith(searchUsername.toLowerCase());
      const bStartsWith = b.buyer?.username
        .toLowerCase()
        .startsWith(searchUsername.toLowerCase());

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
        <h1 className="fw-bold">ORDERS</h1>
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
      <MDBTable align="middle" striped hover id="orderTable">
        <MDBTableHead>
          <tr className="table-dark">
            <th scope="col">Order ID</th>
            <th scope="col">Gig Title</th>
            <th scope="col">Seller Name</th>
            <th scope="col">Buyer Name</th>
            <th scope="col" className="actions-column">
              Actions
            </th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {filteredOrders.length > 0 &&
            filteredOrders.map((orderData, index) => (
              <tr key={index}>
                <td>
                  <p className="fw-normal mb-1">{orderData.id || "N/A"}</p>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={orderData.gig.cover || "/default-gig-image.png"}
                      alt=""
                      style={{width: "45px", height: "45px"}}
                      className="rounded-1"
                    />
                    <div className="ms-3">
                      <p className="fw-normal mb-1">{orderData.gig.title}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={orderData.seller?.img || "/default-avatar.png"}
                      alt=""
                      style={{width: "45px", height: "45px"}}
                      className="rounded-circle"
                    />
                    <div className="ms-3">
                      <p className="fw-bold mb-1">
                        {orderData.seller?.username || "N/A"}
                      </p>
                      <p className="text-muted mb-0">
                        {orderData.seller?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={orderData.buyer?.img || "/default-avatar.png"}
                      alt=""
                      style={{width: "45px", height: "45px"}}
                      className="rounded-circle"
                    />
                    <div className="ms-3">
                      <p className="fw-bold mb-1">
                        {orderData.buyer?.username || "N/A"}
                      </p>
                      <p className="text-muted mb-0">
                        {orderData.buyer?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="actions-column">
                  <center>
                    <button
                      className="buttondelete"
                      role="button"
                      onClick={() => handleDelete(orderData.id)}
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
};

export default App;
