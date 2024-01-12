// src/components/HandleRequest.js
import React, { useState } from 'react';
import axios from 'axios';

const HandleRequest = ({ targetID, requesterID, amount }) => {
  const [decision, setDecision] = useState("");

  const handleRequest = () => {
    
    axios.patch(`http://localhost:8080/user/${targetID}/handle-request`, {
      requesterID: requesterID,
      amount: amount,
      decision: decision
      
    })
      .then(response => {
        console.log(response.data);
        // Handle the response as needed, e.g., show a success message or update the UI.
      })
      .catch(error => {
        console.error('Error handling request:', error);
      });
  };

  return (
    <div>
      <p>Request from User ID: {requesterID}</p>
      <p>Amount: {amount}</p>
      <label>Decision:</label>
      <input type="text" onChange={(e) => setDecision(e.target.value)} />
      <button onClick={handleRequest}>Handle Request</button>
    </div>
  );
};

export default HandleRequest;
