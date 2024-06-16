import React, {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import jsPDF from "jspdf"; // Import jsPDF
import newRequest from "../../utils/newRequest";
import "./Success.scss"; // Import the SCSS file

const Success = () => {
  const {search} = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const payment_intent = params.get("payment_intent");

  useEffect(() => {
    const generatePDF = (orderDetails) => {
      const doc = new jsPDF();

      // Add text to the PDF
      doc.text("Receipt", 10, 10);
      doc.text(`Order ID: ${orderDetails._id}`, 10, 20);
      doc.text(`Payment Intent: ${orderDetails.payment_intent}`, 10, 30);
      doc.text(`Amount: ${orderDetails.price}`, 10, 40);
      doc.text(
        `Date: ${new Date(orderDetails.updatedAt).toLocaleString()}`,
        10,
        50
      );
      doc.text(
        `Customer Name: ${
          orderDetails.firstName + " " + orderDetails.lastName
        }`,
        10,
        60
      );
      doc.text(`Buyer ID: ${orderDetails.buyerId}`, 10, 70);
      doc.text(`Seller ID: ${orderDetails.sellerId}`, 10, 80);
      doc.text(`Gig ID: ${orderDetails.gigId}`, 10, 90);
      doc.text(`Gig Title: ${orderDetails.title}`, 10, 100);
      doc.text(`Requirements: ${orderDetails.requirements}`, 10, 110);

      // Save the PDF
      doc.save("receipt.pdf");
    };

    const makeRequest = async () => {
      try {
        // Make the request to update the order
        const response = await newRequest.post("/orders", {payment_intent});
        const orderDetails = response.data;

        // Generate and download the PDF receipt
        generatePDF(orderDetails);

        // Redirect to the orders page after 5 seconds
        setTimeout(() => {
          navigate("/orders");
        }, 5000);
      } catch (err) {
        console.log(err);
      }
    };

    makeRequest();
  }, [payment_intent, navigate]);

  return (
    <div className="success">
      <div className="message">
        Payment successful. You are being redirected to the orders page. Please
        do not close the page.
      </div>
      <div className="loader"></div>
    </div>
  );
};

export default Success;
