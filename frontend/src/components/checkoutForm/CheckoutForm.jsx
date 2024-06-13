// Import necessary libraries and components
import React, {useEffect, useState} from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "./CheckoutForm.scss"; // Custom styles for the form

// Define the main component
const CheckoutForm = () => {
  const stripe = useStripe(); // Stripe hook for managing Stripe instance
  const elements = useElements(); // Stripe hook for managing Elements instance

  // State variables
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect hook to handle payment intent retrieval on component mount
  useEffect(() => {
    if (!stripe) return; // Exit if Stripe has not loaded

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) return; // Exit if no client secret is found

    // Retrieve payment intent to check its status
    stripe.retrievePaymentIntent(clientSecret).then(({paymentIntent}) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!stripe || !elements) return; // Exit if Stripe or Elements have not loaded

    setIsLoading(true); // Set loading state

    // Confirm payment with Stripe
    const {error} = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:5173/success", // URL to redirect to upon payment completion
      },
    });

    // Handle errors from payment confirmation
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message); // Set error message
      } else {
        setMessage("An unexpected error occurred."); // Set general error message
      }
    }

    setIsLoading(false); // Reset loading state
  };

  // Options for the PaymentElement
  const paymentElementOptions = {
    layout: "tabs", // Use tabs layout for PaymentElement
  };

  // Render the component
  return (
    <div className="payment">
      <form id="payment-form" onSubmit={handleSubmit}>
        <center>
          <h1 className="titlep">Payment</h1>
        </center>
        <br />
        <LinkAuthenticationElement
          id="link-authentication-element"
          onChange={(e) => setEmail(e.target.value)} // Handle email input change
        />
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Pay now"
            )}{" "}
            {/* Show spinner if loading */}
          </span>
        </button>
        {message && <div id="payment-message">{message}</div>}{" "}
        {/* Show message if exists */}
      </form>
    </div>
  );
};

export default CheckoutForm;
