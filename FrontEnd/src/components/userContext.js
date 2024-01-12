import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const setUserContext = (userData) => {
    setUser(userData);
  };

  const getUserContext = () => {
    return user;
  };

  useEffect(() => {
  //  console.log("Fetching user data...");
    const fetchUserData = async () => {
        if (user) {
          try {
            
            const response = await fetch(`http://localhost:8080/user/${user.id}/info`);
            const contentType = response.headers.get('content-type');
      
            if (response.ok && contentType && contentType.includes('application/json')) {
              const userInfo = await response.json();
              setUserContext(userInfo);
              //console.log('User Information:', userInfo);
            } else {
              console.error('Invalid JSON response or non-OK status:', response);
            }
          } catch (error) {
            console.error('Error fetching user info', error);
          }
        }
      };
      

    fetchUserData();
  }, [user]);

  return (
    <UserContext.Provider value={{ setUserContext, getUserContext }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
