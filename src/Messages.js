import React, { useState, useEffect } from 'react';

const Messages = ({ UserData, setUserData }) => {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token'); // Retrieve token from Session Storage
    console.log('Token:', token);
    if (!token) {
      console.error('Token not found in Session Storage');
      return;
    }

    // Establish WebSocket connection
    const newSocket = new WebSocket('ws://localhost:5000');

    // Event listener for when the connection is established
    newSocket.addEventListener('open', event => {
      console.log('WebSocket connection established');
      
      // Send the token in the WebSocket headers
      newSocket.send(JSON.stringify({ token }));
    });

    // Event listener for incoming messages from the server
    newSocket.addEventListener('message', event => {
      const data = JSON.parse(event.data);
      if (data.user) {
        // Update user state with user-specific data received from the server
        setUser(data.user);
        console.log('data.user', data.user)
      } else {
        // Handle other types of messages received from the server
        console.log('Received message:', data);
      }
    });

    // Event listener for errors
    newSocket.addEventListener('error', event => {
      console.error('WebSocket error:', event);
    });

    // Store the WebSocket instance in state
    setSocket(newSocket);

    // Clean up WebSocket connection when the component unmounts
    return () => {
      newSocket.close();
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div>
      <br/>
      <br/>
      <br/>
      <br/>
      <h2>User Data</h2>
      {user && (
        <div>
          <p>Username: {user.username}</p>
          {/* Display other user-specific data as needed */}
        </div>
      )}
      <h2>Messages</h2>
      {/* Your Messages component JSX */}
    </div>
  );
};

export default Messages;