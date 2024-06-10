//import React from "react";
import "./Footer.scss";
import Logo from "/img/logo.png";
import Coin from "/img/coin.png";
import Language from "/img/language.png";
import Accessibility from "/img/accessibility.png";


function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <div className="top">
          <div className="item">
            <h2>Categories</h2>
            <a href="#">Graphics & Design</a>
            <a href="#">Digital Marketing</a>
            <a href="#">Writing & Translation</a>
            <a href="#">Video & Animation</a>
            <a href="#">Music & Audio</a>
            <a href="#">Programming & Tech</a>
            <a href="#">Data</a>
            <a href="#">Business</a>
            <a href="#">Lifestyle</a>
            <a href="#">Photography</a>
            <a href="#">Sitemap</a>
          </div>
          <div className="item">
            <h2>About</h2>
            <a href="#">Careers</a>
            <a href="#">Press & News</a>
            <a href="#">Partnerships</a>
            <a href="#">Privacy Policy</a>
          </div>
          <div className="item">
            <h2>Support</h2>
            <a href="#">Help & Support</a>
            <a href="#">Trust & Safety</a>
            <a href="#">Selling on ProConnect</a>
            <a href="#">Buying on ProConnect</a>
          </div>
          <div className="item">
            <img className="logofimg" src={Logo} alt="proconnect" />
            <span>+0125454548</span>
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <img className="logof" src={Logo}  width={150} alt="proconnect" />
            <span>© IUHS Campus Nalanda Foundation</span>
          </div>
          <div className="right">
            
            <div className="link">
              <img src={Coin} alt="" />
              <span>English</span>
            </div>
            <div className="link">
              <img src={Language} alt="" />
              <span>USD</span>
            </div>
            <img src={Accessibility} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
