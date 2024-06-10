//import React from "react";
import PropTypes from "prop-types";
import "./Slide.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slide = ({slidesToShow, arrowsScroll, slides}) => {
  const settings = {
    slidesToShow,
    slidesToScroll: arrowsScroll || 1,
    arrows: true,
    infinite: true,
  };

  return (
    <div className="slide">
      <div className="container">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index}>{slide}</div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

Slide.propTypes = {
  slidesToShow: PropTypes.number.isRequired,
  arrowsScroll: PropTypes.number,
  slides: PropTypes.arrayOf(PropTypes.node).isRequired,
};

Slide.defaultProps = {
  slides: [],
};

export default Slide;
