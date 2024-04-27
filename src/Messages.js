import React, { useState, useEffect } from 'react';

const Messages = ({ UserData, setUserData }) => {
  const [noCompanions, setNocompanions] = useState(false);


  // then make the emit for the socket, be with the send message
  // make a custom "room" to send only to one person

  useEffect(() => {
   
  }, []); // make socket connection

  return (
    <div className='Conversations-main-div'>
      {!noCompanions && (
        <div style={{paddingTop: '114px'}}>
        <h1>Current Conversations</h1>
      </div>
      )}
    </div>
  );
};

export default Messages;