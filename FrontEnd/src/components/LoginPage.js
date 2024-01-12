// LoginPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticate } from './AuthService';
import { useUserContext } from './userContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUserContext } = useUserContext();
  const history = useNavigate();

  const handleLogin = () => {
    authenticate(username, password)
      .then((user) => {
       
      setUserContext(user);
        history('/dashboard', {state: {user}});
      })
      .catch((error) => {
        console.error('Authentication failed', error);
      });
  };  

  const goToRegister = () => {
    history('/register'); // Navigate to the registration page
  };

  return (
    <div>
      <h1>Login</h1>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
        <button type="button" onClick={goToRegister}>
          Go to Registration
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
