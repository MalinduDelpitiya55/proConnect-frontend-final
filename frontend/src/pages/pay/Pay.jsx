import React, { useEffect, useState } from "react";
import "./Pay.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";
import {useLocation} from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51PMx68P9Im2s1DmzXXWmOpq6bHyu22R6b9ZoqGIdUarHBhvdVmE4MLwrke9SHZPS58niPDQ7NFHNMEA3b644OP9700cAQBFam3"
);

const Pay = () => {
  const [clientSecret, setClientSecret] = useState("");
  const location = useLocation();
  const {formData, gigId} = location.state;
  const { id } = useParams();

  useEffect(() => {
    const makeRequest = async () => {
      try {
        console.log(gigId)
        console.log(formData);
        
        const res = await newRequest.post(
          `/orders/create-payment-intent/${gigId}`,
          formData
        );
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.log(err);
      }
    };
    makeRequest();
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return <div className="pay">
    {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
  </div>;
};

export default Pay;
