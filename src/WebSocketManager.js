import React, { useState, useEffect } from 'react';

const WebSocketManager = ({ children }) => {
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    // Create WebSocket connection
    const socket = new WebSocket('ws://localhost:5000');

    // Event listener for incoming messages from the server
    socket.addEventListener('message', event => {
      const { count } = JSON.parse(event.data);
      console.log('Received message count:', count);
      // Update message count when a new count is received
      setMessageCount(count);
    });

    // Clean up WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return typeof children === 'function' ? children(messageCount) : null;
};

export default WebSocketManager;