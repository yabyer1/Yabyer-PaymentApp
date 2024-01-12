const authenticate = async (username, password) => {
    const response = await fetch('http://localhost:8080/user/api/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    if (response.ok) {
      const user = await response.json();
      if(user == -1){
        throw new Error('Authentication failed');
      }
      return user;
    } else {
      throw new Error('Authentication failed');
    }
  };
  
  export { authenticate };
  