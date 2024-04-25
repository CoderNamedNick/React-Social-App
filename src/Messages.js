import React, { useState, useEffect } from 'react';

const Messages = ({ UserData, setUserData }) => {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    console.log('Token:', token);
    if (!token) {
      console.error('Token not found in Session Storage');
      return;
    }
  
    const newSocket = new WebSocket('ws://localhost:5000');
  
    newSocket.addEventListener('open', event => {
      console.log('WebSocket connection established');
      
      // Send a message requesting user data and messages
      newSocket.send(JSON.stringify({ type: 'userDataAndMessages', token }));
    });
  
    newSocket.addEventListener('message', event => {
      const data = JSON.parse(event.data);
      if (data.userData && data.messages) {
        // Handle user data and messages received from the server
        console.log('Received user data:', data.userData);
        setUser(data.userData)
        console.log('Received messages:', data.messages);
      } else {
        // Handle other types of messages received from the server
        console.log('Received message:', data);
      }
    });
  
    newSocket.addEventListener('error', event => {
      console.error('WebSocket error:', event);
    });
  
    setSocket(newSocket);
  
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