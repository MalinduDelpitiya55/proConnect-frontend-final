import React from "react";
import "./GigCard.scss";
import {Link} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "bootstrap/dist/css/bootstrap.min.css";
import img from "./../../../public/img/sobbg.png";

const GigCard = ({item}) => {
  const {isLoading, error, data} = useQuery({
    queryKey: [item.userId],
    queryFn: () =>
      newRequest.get(`/users/${item.userId}`).then((res) => res.data),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
 console.log("item", item);
  return (
    <Link to={`/gig/${item._id}`} className="link">
      <div className="card gigCard">
        <img src={item.cover} className="card-img-top cover" alt="Cover" />
        <div className="card-body">
          <div className="d-flex flex-row info">
            <div className="user">
              <img src={item.img || img} alt="User" />
              <span>{item.username || item.title}</span>
            </div>
          </div>
          <div className="title">
            <p className="card-text">{item.title}</p>
          </div>
        </div>
        <ul className="list-group list-group-flush">
          <div className="info">
            <div className="star">
              <img src="./img/star.png" alt="Star" />
              <span>
                {!isNaN(item.totalStars / item.starNumber) &&
                  Math.round(item.totalStars / item.starNumber)}
              </span>
            </div>
          </div>
        </ul>
        <div className="card-body">
          <div className="price d-flex justify-content-between">
            <span>STARTING AT</span>
            <h2>$ {item.price}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
