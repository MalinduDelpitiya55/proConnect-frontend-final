import React, {useState, useEffect} from "react"; // Import necessary hooks from React
import {Link, useParams} from "react-router-dom"; // Import Link and useParams for routing
import newRequest from "../../utils/newRequest"; // Import the utility for making HTTP requests
import "./Message.scss"; // Import stylesheet for Message component

const Message = () => {
  const {id} = useParams(); // Extract the conversation ID from the URL
  const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Get the current user from local storage

  const [messages, setMessages] = useState([]); // State to store messages
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track error

  // Function to fetch messages
  const fetchMessages = async () => {
    try {
      const res = await newRequest.get(`/messages/${id}`); // Make GET request to fetch messages
      setMessages(res.data); // Set messages data
      setIsLoading(false); // Set loading to false
    } catch (err) {
      setError(err); // Set error if request fails
      setIsLoading(false); // Set loading to false
    }
  };

  // Fetch messages on component mount and when `id` changes
  useEffect(() => {
    fetchMessages();
  }, [id]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const newMessage = {
      conversationId: id, // Set conversation ID
      desc: e.target[0].value, // Get message text from input
    };

    try {
      await newRequest.post(`/messages`, newMessage); // Make POST request to send new message
      fetchMessages(); // Refetch messages after sending new message
    } catch (err) {
      setError(err); // Set error if request fails
    }
    e.target[0].value = ""; // Clear input field
  };

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages">Messages</Link> {/* Link to messages list */}
        </span>
        {isLoading ? (
          "loading" // Show loading indicator
        ) : error ? (
          "error" // Show error message
        ) : (
          <div className="messages">
            {messages.map((m) => (
              <div
                className={m.userId === currentUser._id ? "owner item" : "item"}
                key={m._id}
              >
                <img
                  src="https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt=""
                />
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        )}
        <hr />
        <form className="write" onSubmit={handleSubmit}>
          <textarea type="text" placeholder="write a message" />{" "}
          {/* Text area for writing message */}
          <button type="submit">Send</button> {/* Submit button */}
        </form>
      </div>
    </div>
  );
};

export default Message; // Export the Message component
