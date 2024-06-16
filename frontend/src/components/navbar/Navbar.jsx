import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";
import Logo from "/img/logo.png";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const { pathname } = useLocation();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <img
              className="logofimg"
              src={Logo}
              alt="proconnect"
              width={"20%"}
            />
          </Link>
        </div>
        <div className="links">
          
          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img src={currentUser.value.img || "/img/noavatar.jpg"} alt="" />
              <span>{currentUser?.value.username}</span>
              {open && (
                <div className="options">
                  {currentUser.value.isSeller && (
                    <>
                      <Link className="link" to="/profile">
                        Profile
                      </Link>
                      <Link className="link" to="/mygigs">
                        Gigs
                      </Link>
                      <Link className="link" to="/add">
                        Add New Gig
                      </Link>
                    </>
                  )}
                  <Link className="link" to="/orders">
                    Orders
                  </Link>
                  <Link className="link" to="/messages">
                    Messages
                  </Link>
                  <Link className="link" onClick={handleLogout}>
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">
                Sign in
              </Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !== "/") && (
        <>
          <div className="menu">
            <Link
              className="secondl link menuLink"
              to="/gigs?cat=Graphics Design"
            >
              Graphics Design
            </Link>
            <Link className="secondl link menuLink" to="/gigs?cat=Video Design">
              Video Design
            </Link>
            <Link className="secondl link menuLink" to="/gigs?cat=Web Design">
              Web Design
            </Link>
            <Link
              className="secondl link menuLink"
              to="/gigs?cat=Mobile Application Desing"
            >
              Mobile Application Desing
            </Link>
            <Link
              className="secondl link menuLink"
              to="/gigs?cat=Animation Design"
            >
              Animation Design
            </Link>
            <Link className="secondl link menuLink" to="/gigs?cat=AI Services">
              AI Services
            </Link>
            <Link
              className="secondl link menuLink"
              to="/gigs?cat=Writing & Translation"
            >
              Writing & Translation
            </Link>
            <Link
              className="secondl link menuLink"
              to="/gigs?cat=Music & Audio"
            >
              Music & Audio
            </Link>
            <Link
              className="secondl link menuLink"
              to="/gigs?cat=Programming & Tech"
            >
              Programming & Tech
            </Link>
          </div>
          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;
