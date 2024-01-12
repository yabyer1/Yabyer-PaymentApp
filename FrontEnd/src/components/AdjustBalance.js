// src/components/AdjustBalance.js
import React, { useState } from 'react';
import axios from 'axios';

const AdjustBalance = ({ id }) => {
  const [adjustment, setAdjustment] = useState({
    balance: 0,
    operation: ""
  });

  const adjustBalance = () => {
    axios.patch(`http://localhost:8080/user/balance/${id}`, adjustment)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error adjusting balance:', error);
      });
  };

  return (
    <div>
      <label>Balance:</label>
      <input type="number" onChange={(e) => setAdjustment({ ...adjustment, balance: parseInt(e.target.value) })} />
      <label>Operation:</label>
      <input type="text" onChange={(e) => setAdjustment({ ...adjustment, operation: e.target.value })} />
      <button onClick={adjustBalance}>Adjust Balance</button>
    </div>
  );
};

export default AdjustBalance;
