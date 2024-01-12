// RegisterPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddUser from './AddUser'; 
import ListUsers from './ListUsers';

const RegisterPage = () => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [showListUsers, setShowListUsers] = useState(false);
  const history = useNavigate();

  const toggleAddUser = () => {
    setShowAddUser(!showAddUser);
  };

  const ShowAllUsers = () => {
    setShowListUsers(!showListUsers);
  };
  const goToLogin = () => {
    history('/login'); // Navigate to the login page
  };
  return (
    <div>
      <h1>Register Page</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Button to toggle the AddUser form */}
        <button onClick={toggleAddUser}>New User</button>

        {/* Display AddUser component if showAddUser is true */}
        {showAddUser && <AddUser />}
        
        {/* Button to toggle the AddUser form */}
        <button onClick={ShowAllUsers}>All Users</button>

        {/* Display AddUser component if showAddUser is true */}
        {showListUsers && <ListUsers />}
        <button onClick={goToLogin}>Return to Login </button>
      </form>
    </div>
  );
};

export default RegisterPage;
