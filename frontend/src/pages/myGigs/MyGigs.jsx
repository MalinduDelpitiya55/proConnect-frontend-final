import React, {useState, useEffect} from "react"; // Import necessary hooks from React
import {Link} from "react-router-dom"; // Import Link for routing
import "./MyGigs.scss"; // Import stylesheet for MyGigs component
import getCurrentUser from "../../utils/getCurrentUser"; // Import the utility to get the current user
import newRequest from "../../utils/newRequest"; // Import the utility for making HTTP requests

function MyGigs() {
  const currentUser = getCurrentUser(); // Get the current user
  const [gigs, setGigs] = useState([]); // State to store gigs
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track error
  const [editGig, setEditGig] = useState(null); // State to track the gig being edited
  const [newTitle, setNewTitle] = useState(""); // State to store new title for editing

  // Function to fetch gigs
  const fetchGigs = async () => {
    try {
      const res = await newRequest.get(`/gigs?userId=${currentUser._id}`); // Make GET request to fetch gigs
      setGigs(res.data); // Set gigs data
      setIsLoading(false); // Set loading to false
    } catch (err) {
      setError(err); // Set error if request fails
      setIsLoading(false); // Set loading to false
    }
  };

  // Fetch gigs on component mount
  useEffect(() => {
    fetchGigs();
  }, []);

  // Function to delete a gig
  const handleDelete = async (id) => {
    try {
      await newRequest.delete(`/gigs/${id}`); // Make DELETE request to delete gig
      fetchGigs(); // Refetch gigs after deletion
    } catch (err) {
      setError(err); // Set error if request fails
    }
  };

  // Function to edit a gig
  const handleEdit = (gig) => {
    setEditGig(gig._id); // Set the gig being edited
    setNewTitle(gig.title); // Set the current title of the gig in the input
  };

  // Function to save the edited gig
  const handleSave = async (id) => {
    try {
      await newRequest.post(`/gigs/updategig/${id}`, {
        userID: currentUser._id,
        gig: {title: newTitle},
      }); // Make POST request to update gig
      setEditGig(null); // Clear the editing state
      fetchGigs(); // Refetch gigs after updating
    } catch (err) {
      setError(err); // Set error if request fails
    }
  };

  return (
    <div className="myGigs">
      {isLoading ? (
        "Loading..." // Show loading indicator
      ) : error ? (
        <div>Error: {error.message}</div> // Show error message
      ) : (
        <div className="container">
          <div className="title">
            <h1>Gigs</h1>
            {currentUser.isSeller && (
              <Link to="/add">
                <button>Add New Gig</button>
              </Link>
            )}
          </div>
          {gigs.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Sales</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {gigs.map((gig) => (
                  <tr key={gig._id}>
                    <td>
                      <img className="image" src={gig.cover} alt={gig.title} />
                    </td>
                    <td>
                      {editGig === gig._id ? (
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                        />
                      ) : (
                        gig.title
                      )}
                    </td>
                    <td>{gig.price}</td>
                    <td>{gig.sales}</td>
                    <td>
                      {editGig === gig._id ? (
                        <button onClick={() => handleSave(gig._id)}>
                          Save
                        </button>
                      ) : (
                        <button onClick={() => handleEdit(gig)}>Edit</button>
                      )}
                      <img
                        className="delete"
                        src="./img/delete.png"
                        alt="Delete"
                        onClick={() => handleDelete(gig._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No gigs found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MyGigs; // Export the MyGigs component
