import React, { useState, useEffect } from 'react';

const Messages = () => {
  const [socket, setSocket] = useState(null);

  // Establish WebSocket connection when the component mounts
  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:5000');

    // Event listener for when the connection is established
    newSocket.addEventListener('open', event => {
      console.log('WebSocket connection established');
    });

    // Event listener for incoming messages from the server
    newSocket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      // Handle incoming message (e.g., update state)
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
      {/* Your Messages component JSX */}
    </div>
  );
};

export default Messages;