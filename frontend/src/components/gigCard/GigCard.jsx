import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "bootstrap/dist/css/bootstrap.min.css";
import img from './../../../public/img/sobbg.png'

const GigCard = ({ item }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () =>
      newRequest.get(`/users/${item.userId}`).then((res) => {
        return res.data;
      }),
  });
  console.log(item);
  return (
    // <Link to={`/gig/${item._id}`} className="link">
    //   <div className="gigCard">
    //     <img src={item.cover} alt="" />
    //     <div className="info">
    //       {isLoading ? (
    //         "loading"
    //       ) : error ? (
    //         "Something went wrong!"
    //       ) : (
    //         <div className="user">
    //           <img src={data.img || "/img/noavatar.jpg"} alt="" />
    //           <span>{data.username}</span>
    //         </div>
    //       )}
    //       <p>{item.title}</p>
    //       <div className="star">
    //         <img src="./img/star.png" alt="" />
    //         <span>
    //           {!isNaN(item.totalStars / item.starNumber) &&
    //             Math.round(item.totalStars / item.starNumber)}
    //         </span>
    //       </div>
    //     </div>
    //     <hr />
    //     <div className="detail">
    //       <img src="./img/heart.png" alt="" />
    //       <div className="price">
    //         <span>STARTING AT</span>
    //         <h2>$ {item.price}</h2>
    //       </div>
    //     </div>
    //   </div>
    // </Link>
    <Link to={`/gig/${item._id}`} className="link">
      <div class="card gigCard">
        <img src={item.cover} class="card-img-top cover" alt="..." />
        <div class="card-body">
          <div className="d-flex flex-row info">
            <div className="user">
              <img src={data.img || img} alt="" />
              <span>{data.username}</span>
            </div>
          </div>
          <div className="title">
            <p class="card-text">{item.title}</p>
          </div>
        </div>
        <ul class="list-group list-group-flush">
          <div className="info">
            <div className="star">
              <img src="./img/star.png" alt="" />
              <span>
                {!isNaN(item.totalStars / item.starNumber) &&
                  Math.round(item.totalStars / item.starNumber)}
              </span>
            </div>
          </div>
        </ul>
        <div class="card-body">
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
