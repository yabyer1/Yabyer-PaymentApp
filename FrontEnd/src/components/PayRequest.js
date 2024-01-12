// src/components/PayRequest.js
import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
const PayRequest = () => {
    const location = useLocation();
    const user = location.state ? location.state.user : null;
  const [paymentData, setPaymentData] = useState({
    toID: 0,
    amount: 0
  });

  const sendPaymentRequest = () => {
    axios.patch(`http://localhost:8080/user/${user.id}/PayQuery`, null, {
      params: {
        amount: paymentData.amount,
        toID: paymentData.toID
      }
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error sending payment request:', error);
      });
  };

  return (
    <div>
      <h2>Payment Request</h2>
      <label>To User ID:</label>
      <input type="number" onChange={(e) => setPaymentData({ ...paymentData, toID: parseInt(e.target.value) })} />
      <label>Amount:</label>
      <input type="number" onChange={(e) => setPaymentData({ ...paymentData, amount: parseInt(e.target.value) })} />
      <button onClick={sendPaymentRequest}>Send Payment Request</button>
    </div>
  );
};

export default PayRequest;
