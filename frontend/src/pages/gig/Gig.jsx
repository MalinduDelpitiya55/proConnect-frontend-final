// Gig.js

import React, { useState } from "react";
import PopupForm from "../../components/PopupForm/PopupForm";
import "./Gig.scss";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";
import Greencheck from "../../../public/img/greencheck.png";
import Recycle from "../../../public/img/recycle.png";
import Clock from "../../../public/img/clock.png";
import Noavatar from "../../../public/img/noavatar.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Gig() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showPopupForm, setShowPopupForm] = useState(false);
  const [formData, setFormData] = useState(null);

  const handlePopupFormSubmit = (data) => {
    setFormData(data);
    navigate(`/pay/${id}`, { state: { formData: data, gigId: id } });
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["gig"],
    queryFn: () =>
      newRequest.get(`/gigs/single/${id}`).then((res) => {
        return res.data;
      }),
  });

  const userId = data?.userId;

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      newRequest.get(`/users/${userId}`).then((res) => {
        return res.data;
      }),
    enabled: !!userId,
  });

  return (
    <div className="gig">
      {isLoading ? (
        "loading"
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="container">
          <div className="left">
            <div
              id="carouselExampleInterval"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {data.images.map((img, index) => (
                  <div
                    key={index}
                    className={`carousel-item ${
                      index === 0 ? "active" : ""
                    }`}
                    data-bs-interval={index === 0 ? "10000" : "10000"}
                  >
                    <img
                      src={img}
                      className="d-block w-100 bordered-img" // Add a CSS class for styling
                      alt="..."
                    />
                  </div>
                ))}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleInterval"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleInterval"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
            <h2>About This Gig</h2>
            <p className="pt">{data.desc}</p>
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="seller">
                <h2>About The Seller</h2>
                <div className="user">
                  <img src={dataUser.img || Noavatar} alt="" />
                  <div className="info">
                    <span>{dataUser.username}</span>
                    <button>View</button>
                  </div>
                </div>
                <div className="box">
                  <div className="items">
                    <div className="item">
                      <span className="title">From</span>
                      <span className="desc">{dataUser.country}</span>
                    </div>
                    <div className="item">
                      <span className="title">Member since</span>
                      <span className="desc">May 2024</span>
                    </div>
                    <div className="item">
                      <span className="title">Avg. response time</span>
                      <span className="desc">4 hours</span>
                    </div>
                    <div className="item">
                      <span className="title">Languages</span>
                      <span className="desc">English</span>
                    </div>
                  </div>
                  <hr />
                  <p className="pt">{dataUser.desc}</p>
                </div>
              </div>
            )}
            <Reviews gigId={id} />
          </div>
          <div className="right">
            <div className="price">
              <h3>{data.shortTitle}</h3>
              <h2>$ {data.price}</h2>
            </div>
            <p className="pt">{data.shortDesc}</p>
            <div className="details">
              <div className="item">
                <img src={Clock} alt="" />
                <span>{data.deliveryTime} Days Delivery</span>
              </div>
              <div className="item">
                <img src={Recycle} alt="" />
                <span>{data.revisionNumber} Revisions</span>
              </div>
            </div>
            <div className="features">
              {data.features.map((feature) => (
                <div className="item" key={feature}>
                  <img src={Greencheck} alt="" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowPopupForm(true)}>Continue</button>
            {showPopupForm && <PopupForm onSubmit={handlePopupFormSubmit} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default Gig;
