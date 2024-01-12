// PendingRequestsList.js

import React from 'react';

const PendingRequestsList = ({ pendingRequests, handleRequest }) => {
  return (
    <div>
      {pendingRequests.length > 0 ? (
        pendingRequests.map(request => (
          <div key={request.userId}>
            {/* Display details of each pending request */}
            <p>Request from User ID: {request.userId}</p>
            <p>Amount: {request.amount}</p>
            <button onClick={() => handleRequest(request.userId, 'accept')}>Accept</button>
            <button onClick={() => handleRequest(request.userId, 'reject')}>Reject</button>
          </div>
        ))
      ) : (
        <p>No pending requests</p>
      )}
    </div>
  );
};

export default PendingRequestsList;
