//import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import "./CatCard.scss";

function CatCard({card}) {
  return (
    <Link to={`/gigs?cat=${card.cat}`}>
      <div className="catCard">
        <img src={card.img} alt="" />
        <span className="desc">{card.desc}</span>
        <span className="title">{card.title}</span>
      </div>
    </Link>
  );
}

CatCard.propTypes = {
  card: PropTypes.shape({
    cat: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default CatCard;
