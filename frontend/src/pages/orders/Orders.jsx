import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import "./Orders.scss";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "./../../utils/getCurrentUser.js";
import axios from "axios";

const Orders = () => {
  const currentUser = getCurrentUser();
  const [editingOrder, setEditingOrder] = useState(null);
  const [editedRequirements, setEditedRequirements] = useState("");
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch orders
  const fetchOrders = async () => {
    try {
      const res = await newRequest.get(`/orders`);
      setOrders(res.data); // Set orders from the response
      setIsLoading(false); // Set loading to false after fetching
    } catch (err) {
      setError(err); // Set error if request fails
      setIsLoading(false); // Set loading to false
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to handle contacting a user
  const handleContact = async (order) => {
    const {sellerId, buyerId} = order;
    const id = sellerId + buyerId;

    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.seller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  // Function to handle editing an order
  const handleEdit = (order) => {
    setEditingOrder(order); // Set the order being edited
    setEditedRequirements(order.requirements); // Set initial requirements for editing
  };

  // Function to handle saving the edited order
  const handleSave = async () => {
    try {
      await newRequest.post(
        `/orders/updateOrder/${editingOrder._id}`,
        {
          orderId: editingOrder._id,
          requirements: editedRequirements,
        }
      );
      await fetchOrders(); // Refresh orders after saving
      setEditingOrder(null); // Clear editing state
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="orders">
      {isLoading ? (
        "loading" // Show loading indicator while fetching data
      ) : error ? (
        "error" // Show error message if fetching data fails
      ) : (
        <div className="container">
          <div className="title">
            <h1>Orders</h1>
          </div>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Requirements</th>
                <th>Price</th>
                <th>Contact</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <img className="image" src={order.img} alt="" />
                  </td>
                  <td>{order.title}</td>
                  <td>
                    {editingOrder === order ? (
                      <input
                        type="text"
                        value={editedRequirements}
                        onChange={(e) => setEditedRequirements(e.target.value)}
                      />
                    ) : (
                      order.requirements
                    )}
                  </td>
                  <td>{order.price}</td>
                  <td>
                    <img
                      className="message"
                      src="./img/message.png"
                      alt=""
                      onClick={() => handleContact(order)}
                    />
                  </td>
                  <td>
                    {!currentUser.isSeller && // Only show edit button for buyers
                      (editingOrder === order ? (
                        <button onClick={handleSave}>Save</button>
                      ) : (
                        <button onClick={() => handleEdit(order)}>Edit</button>
                      ))}
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

export default Orders;
