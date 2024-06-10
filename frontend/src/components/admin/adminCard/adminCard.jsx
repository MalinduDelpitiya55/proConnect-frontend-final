import React, { useEffect, useState } from "react";
import axios from "axios";
import Buyer from "./../../../../public/img/buyer.png";
import Payment from "./../../../../public/img/payment.png";
import Post from "./../../../../public/img/post.png";
import Seller from "./../../../../public/img/seller.png";
import "./adminCard.scss";

const DashboardStats = () => {
  const [cardData, setCardData] = useState([
    {
      title: "Loading...",
      text: "Total Buyer",
      color: "bg-success",
      icon: Buyer,
    },
    {
      title: "Loading...",
      text: "Total Seller",
      color: "bg-primary",
      icon: Seller,
    },
    {
      title: "Loading...",
      text: "Total Gig",
      color: "bg-warning",
      icon: Post,
    },
    {
      title: "Loading...",
      text: "Total Payment ",
      color: "bg-danger",
      icon: Payment,
    },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userCount, gigCount, paymentTotal] = await Promise.all([
        axios.post("http://localhost:8800/api/admin/userCount"),
        axios.post("http://localhost:8800/api/admin/getTotalGigCount"),
        axios.post(
          "http://localhost:8800/api/admin/getTotalCompletedOrderPrices"
        ),
      ]);
      setCardData([
        {
          title: userCount.data.buyers.toString(),
          text: "Total Buyer",
          color: "bg-success",
          icon: Buyer,
        },
        {
          title: userCount.data.sellers.toString(),
          text: "Total Seller",
          color: "bg-primary",
          icon: Seller,
        },
        {
          title: gigCount.data.total.toString(),
          text: "Total Gig",
          color: "bg-warning",
          icon: Post,
        },
        {
          title: paymentTotal.data.total.toString(),
          text: "Total Payment",
          color: "bg-danger",
          icon: Payment,
        },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors
    }
  };

  return (
    <div className="card-container">
      {cardData.map((card, index) => (
        <div className={`card ${card.color}`} key={index}>
          <div className="card-content">
            <img src={card.icon} alt="Admin Card" />
            <div className="card-details">
              <div className="card-title">{card.title}</div>
              <div className="card-text">{card.text}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
