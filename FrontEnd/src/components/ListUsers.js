// src/components/ListUsers.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListUsers = () => {
  const [users, setUsers] = useState([]);

  const getAllUsers = () => {
    axios.get('http://localhost:8080/user/getAll')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  };

  useEffect(() => {
    getAllUsers();
  }, []); // Run once when the component mounts

  return (
    <div>
      <h2>All Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>Name:</strong> {user.name},  <strong>Balance:</strong> {user.balance}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListUsers;
