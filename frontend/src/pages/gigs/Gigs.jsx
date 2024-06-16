import React, {useEffect, useRef, useState} from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import newRequest from "../../utils/newRequest";
import {useLocation} from "react-router-dom";

function Gigs() {
  const [sort, setSort] = useState("sales"); // State to manage sorting type
  const [open, setOpen] = useState(false); // State to manage the visibility of the sort menu
  const [gigs, setGigs] = useState([]); // State to store fetched gigs
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState(null); // State to manage error status
  const minRef = useRef(); // Ref to manage the minimum budget input
  const maxRef = useRef(); // Ref to manage the maximum budget input

  const {search} = useLocation(); // Get the current URL search parameters
  const params = new URLSearchParams(window.location.search); // Parse the search parameters
  const catValue = params.get("cat"); // Get the 'cat' parameter value
  console.log(catValue);

  // Function to fetch gigs data
  const fetchGigs = async () => {
    setIsLoading(true); // Set loading to true before fetching data
    try {
      const response = await newRequest.get(
        `/gigs${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
      ); // Fetch data from the API
      setGigs(response.data); // Store fetched data in state
      setError(null); // Reset any previous errors
    } catch (err) {
      setError("Something went wrong!"); // Set error message if there's an error
    } finally {
      setIsLoading(false); // Set loading to false after fetching data
    }
  };

  useEffect(() => {
    fetchGigs(); // Fetch gigs data when the component mounts
  }, [sort, catValue]); // Dependency array ensures this runs when 'sort' or 'catValue' changes

  const reSort = (type) => {
    setSort(type); // Set the sorting type
    setOpen(false); // Close the sort menu
  };

  const apply = () => {
    fetchGigs(); // Fetch gigs data with the current budget filters
  };

  return (
    <div className="gigs">
      <div className="container">
        <h1>{catValue || "All Gigs"}</h1>{" "}
        {/* Display the category or default to "All Gigs" */}
        <br />
        <div className="menu">
          <div className="left">
            <span>Budget</span> {/* Budget filter label */}
            <input ref={minRef} type="number" placeholder="min" />{" "}
            {/* Minimum budget input */}
            <input ref={maxRef} type="number" placeholder="max" />{" "}
            {/* Maximum budget input */}
            <button onClick={apply}>Apply</button>{" "}
            {/* Button to apply budget filters */}
          </div>
          <div className="right">
            <span className="sortBy">Sort by</span> {/* Sort by label */}
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}{" "}
              {/* Display current sort type */}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />{" "}
            {/* Toggle sort menu */}
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span> // Option to sort by newest
                ) : (
                  <span onClick={() => reSort("sales")}>Best Selling</span> // Option to sort by best selling
                )}
                <span onClick={() => reSort("sales")}>Popular</span>{" "}
                {/* Option to sort by popular */}
              </div>
            )}
          </div>
        </div>
        <br />
        <div className="cards">
          {isLoading
            ? "loading" // Show loading text if data is being fetched
            : error
            ? error // Show error message if there's an error
            : gigs && gigs.length > 0
            ? gigs.map((gig) => <GigCard key={gig._id} item={gig} />) // Render gig cards if data is available
            : "No gigs found."}{" "}
          {/* Show message if no gigs are found */}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
