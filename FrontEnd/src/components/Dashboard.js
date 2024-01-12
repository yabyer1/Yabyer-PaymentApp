// Dashboard.js

import React, { useEffect, useCallback, useState } from 'react';
import { useUserContext } from './userContext';
import { useLocation } from 'react-router-dom';
import PayRequest from './PayRequest';
import PendingRequestsList from './PendingRequestsList'; // Corrected file name

const Dashboard = () => {
  const { getUserContext, fetchUserInfo } = useUserContext();
  const location = useLocation();
  const user = location.state ? location.state.user : null;
  const [addAmount, setAddAmount] = useState('');
  const [subtractAmount, setSubtractAmount] = useState('');
  const [paymentData, setPaymentData] = useState({
    toID: 0,
    amount: 0
  });

  const fetchUserData = useCallback(async () => {
    if (user && user.id) {
      try {
        const response = await fetch(`/api/user/${user.id}/info`);
        const contentType = response.headers.get('content-type');

        if (response.ok && contentType && contentType.includes('application/json')) {
          const userInfo = await response.json();
          fetchUserInfo(userInfo);
        } else {
          console.error('Invalid JSON response or non-OK status:', response);
        }
      } catch (error) {
        console.error('Error fetching user info', error);
      }
    }
  }, [user, fetchUserInfo]);

  const fetchPendingRequests = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/user/${user.id}/pending-requests`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched Pending Requests:', data); // Add this line
        setPendingRequests(data);
      } else {
        console.error('Failed to fetch pending requests');
      }
    } catch (error) {
      console.error('Error fetching pending requests', error);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.id) {
      fetchUserData();
     // Corrected the function name
    }
  }, [user, fetchUserData]); // Corrected the dependencies
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (user && user.id) {
        fetchPendingRequests();
      }
    }, 5000); // Adjust the interval as needed (e.g., every 5 seconds)
  
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [user, fetchPendingRequests]);
  
  useEffect(() => {
    //console.log("User Information:", user);
  }, [user]);

  const [pendingRequests, setPendingRequests] = useState([]);

  const AddToBalance = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user/balance/${user.id}?operation=add&amount=${addAmount}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchUserData();
      } else {
        console.error('Failed to add to balance');
      }
    } catch (error) {
      console.error('Error adding to balance', error);
    }
  };

  const SubtractFromBalance = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user/balance/${user.id}?operation=subtract&amount=${subtractAmount}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchUserData();
      } else {
        console.error('Failed to subtract from balance');
      }
    } catch (error) {
      console.error('Error subtracting from balance', error);
    }
  };

  const handleRequest = async (requesterId, decision) => {
    try {
        console.log("User id " + user.id + " Requester ID  " + requesterId + "   Decision" + decision);

        const response = await fetch(`http://localhost:8080/user/${user.id}/Handler/${requesterId}/${decision}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json(); // assuming the response is in JSON format

        if (response.ok) {
            // Refresh pending requests after handling
            fetchPendingRequests();
        } else {
            console.error('Failed to handle pending request:', data);
        }
    } catch (error) {
        console.error('Error handling pending request', error);
    }
};

  

  useEffect(() => {
    console.log('Pending Requests:', pendingRequests);
  }, [pendingRequests]);

  return (
    <div>
      <h1>Welcome to the Dashboard, {user && getUserContext() && getUserContext().username}!</h1>
      <h1> Balance: {getUserContext().balance}</h1>
      <div>
        <input
          type="text"
          placeholder="Add to Balance"
          value={addAmount}
          onChange={(e) => setAddAmount(e.target.value)}
        />
        <button type="button" onClick={AddToBalance}>
          Add to Balance
        </button>

        <input
          type="text"
          placeholder="Subtract from Balance"
          value={subtractAmount}
          onChange={(e) => setSubtractAmount(e.target.value)}
        />
        <button type="button" onClick={SubtractFromBalance}>
          Subtract from Balance
        </button>
      </div>
      {/* Include PayRequest component */}
      <div>
        <PayRequest />
        <PendingRequestsList pendingRequests={pendingRequests} handleRequest={handleRequest} />
      </div>
    </div>
  );
};

export default Dashboard;
