import React, { useState, useEffect } from 'react';

const Messages = ({ UserData, setUserData }) => {


  // then make the emit for the socket, be with the send message
  // make a custom "room" to send only to one person

  useEffect(() => {
   
  }, []); // make socket connection

  return (
    <div>
      <br/>
      <br/>
      <br/>
      <br/>
      <h2>User Data</h2>
      <h2>Messages</h2>
      {/* Your Messages component JSX */}
    </div>
  );
};

export default Messages;