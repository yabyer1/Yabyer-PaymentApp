// src/components/AddUser.js
import React, { useState } from 'react';
import axios from 'axios';

const AddUser = () => {
  const [user, setUser] = useState({
    name: '',
    balance: 0,
    username: '',
    password: ''
  });

  const addUser = () => {
    axios.post('http://localhost:8080/user/add', user)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  };

  return (
    <div>
      <h2>Add User</h2>
    
      <label>Name:</label>
      <input type="text" onChange={(e) => setUser({ ...user, name: e.target.value })} />
      <label>Balance:</label>
      <input type="number" onChange={(e) => setUser({ ...user, balance: parseInt(e.target.value) })} />
      <label>Username:</label>
      <input type="text" onChange={(e) => setUser({ ...user, username: e.target.value })} />
      <label>Password:</label>
      <input type="text" onChange={(e) => setUser({ ...user, password: e.target.value })} />
      <button onClick={addUser}>Add User</button>
    </div>
  );
};

export default AddUser;