import React, {useEffect, useState} from "react";
import "./Pay.scss";
import {loadStripe} from "@stripe/stripe-js"; // Importing loadStripe function from Stripe JS library
import {Elements} from "@stripe/react-stripe-js"; // Importing Elements component from Stripe React library
import newRequest from "../../utils/newRequest"; // Importing utility function for making HTTP requests
import {useParams, useLocation} from "react-router-dom"; // Importing useParams and useLocation hooks from React Router DOM
import CheckoutForm from "../../components/checkoutForm/CheckoutForm"; // Importing CheckoutForm component
import {useNavigate} from "react-router-dom"; // Importing useNavigate hook from React Router DOM

// Function to load the Stripe SDK asynchronously
const stripePromise = loadStripe(
  "pk_test_51PMx68P9Im2s1DmzXXWmOpq6bHyu22R6b9ZoqGIdUarHBhvdVmE4MLwrke9SHZPS58niPDQ7NFHNMEA3b644OP9700cAQBFam3"
);

const Pay = () => {
  const [clientSecret, setClientSecret] = useState(""); // State to store the client secret received from the server
  const location = useLocation(); // Hook to access the current location object
  const {formData, gigId} = location.state; // Destructuring formData and gigId from location state
  const {id} = useParams(); // Destructuring id parameter from URL params

  // useEffect hook to fetch the client secret from the server when the component mounts
  useEffect(() => {
    const makeRequest = async () => {
      try {
        // Making a POST request to create a payment intent with the gigId and formData
        const res = await newRequest.post(
          `/orders/create-payment-intent/${gigId}`, // Endpoint to create payment intent for a specific gig
          formData // Data containing payment details
        );
        setClientSecret(res.data.clientSecret); // Setting the client secret received from the server
      } catch (err) {
        console.log(err); // Logging any errors that occur during the request
      }
    };
    makeRequest(); // Calling the function to make the request when component mounts
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const appearance = {
    theme: "stripe", // Setting appearance theme for Stripe Elements
  };

  const options = {
    clientSecret, // Passing client secret to options for Stripe Elements
    appearance, // Passing appearance options to Stripe Elements
  };

  return (
    <div className="pay">
      {clientSecret && ( // Rendering Elements component only when clientSecret is truthy
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />{" "}
          {/* Rendering CheckoutForm component wrapped in Elements */}
        </Elements>
      )}
    </div>
  );
};

export default Pay;
