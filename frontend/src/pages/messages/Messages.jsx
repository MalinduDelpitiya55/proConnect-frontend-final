import React, {useState, useEffect} from "react"; // Import necessary hooks from React
import {Link} from "react-router-dom"; // Import Link for routing
import newRequest from "../../utils/newRequest"; // Import the utility for making HTTP requests
import "./Messages.scss"; // Import stylesheet for Messages component
import moment from "moment"; // Import moment for date formatting

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Get the current user from local storage

  const [conversations, setConversations] = useState([]); // State to store conversations
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track error

  // Function to fetch conversations
  const fetchConversations = async () => {
    try {
      const res = await newRequest.get(`/conversations`); // Make GET request to fetch conversations
      setConversations(res.data); // Set conversations data
      setIsLoading(false); // Set loading to false
    } catch (err) {
      setError(err); // Set error if request fails
      setIsLoading(false); // Set loading to false
    }
  };

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Function to mark conversation as read
  const markAsRead = async (id) => {
    try {
      await newRequest.put(`/conversations/${id}`); // Make PUT request to mark conversation as read
      fetchConversations(); // Refetch conversations after marking as read
    } catch (err) {
      setError(err); // Set error if request fails
    }
  };

  return (
    <div className="messages">
      {isLoading ? (
        "loading" // Show loading indicator
      ) : error ? (
        "error" // Show error message
      ) : (
        <div className="container">
          <div className="title">
            <h1>Messages</h1>
          </div>
          <table>
            <thead>
              <tr>
                <th>{currentUser.isSeller ? "Buyer" : "Seller"}</th>
                <th>Last Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((c) => (
                <tr
                  className={
                    ((currentUser.isSeller && !c.readBySeller) ||
                      (!currentUser.isSeller && !c.readByBuyer)) &&
                    "active" // Highlight unread messages
                  }
                  key={c.id}
                >
                  <td>{currentUser.isSeller ? c.buyerId : c.sellerId}</td>
                  <td>
                    <Link to={`/message/${c.id}`} className="link text-dark" >
                      {c?.lastMessage?.substring(0, 100)}...
                    </Link>
                  </td>
                  <td>{moment(c.updatedAt).fromNow()}</td>
                  <td>
                    {((currentUser.isSeller && !c.readBySeller) ||
                      (!currentUser.isSeller && !c.readByBuyer)) && (
                      <button onClick={() => markAsRead(c.id)}>
                        Mark as Read
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Messages; // Export the Messages component
