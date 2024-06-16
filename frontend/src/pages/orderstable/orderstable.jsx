import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import "./orderstable.scss";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "./../../utils/getCurrentUser.js";

const Orders = () => {
  const currentUser = getCurrentUser();
  const [editingOrder, setEditingOrder] = useState(null);
  const [editedRequirements, setEditedRequirements] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  // Function to fetch orders
  const fetchOrders = async () => {
    try {
      const res = await newRequest.get(`/orders`);
      setData(res.data); // Set orders from the response
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
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
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
    setEditingOrder(order);
    setEditedRequirements(order.requirements);
  };

  // Function to handle saving the edited order
  const handleSave = async () => {
    try {
      await newRequest.post(`/orders/updateOrder`, {
        orderId: editingOrder._id,
        requirements: editedRequirements,
      });
      // Refresh the data after saving
      await fetchOrders();
      setEditingOrder(null);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="orderst">
      <div className="orders">
        {isLoading ? (
          "loading"
        ) : error ? (
          "error"
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
                {data.map((order) => (
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
                          onChange={(e) =>
                            setEditedRequirements(e.target.value)
                          }
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
                      {editingOrder === order ? (
                        <button onClick={handleSave}>Save</button>
                      ) : (
                        <button onClick={() => handleEdit(order)}>Edit</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
