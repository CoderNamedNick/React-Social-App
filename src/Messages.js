import React, { useState, useEffect } from 'react';

const Messages = ({ UserData, setUserData }) => {
  const [noCompanions, setNocompanions] = useState(false);
  const [Conversations, setConversations] = useState([]);
  const [companionsData, setCompanionsData] = useState([]);


  useEffect(() => {
    fetch(`http://localhost:5000/Messages/Conversations/${UserData.id || UserData.id}`)
    .then(response => {
      // Check if the response is successful (status code 200)
      if (response.ok) {
        // Parse the JSON response
        return response.json();
      } else {
        // If the response is not successful, throw an error
        throw new Error('Failed to fetch conversations');
      }
    })
    .then(data => {
      // Data contains the conversations fetched from the backend
      console.log(data.conversations);
      setConversations(data.conversations)
      if (data.conversations.length === 0) {
        setNocompanions(true)
      }
      // Use the conversations data as needed
    })
    .catch(error => {
      console.error('Error fetching conversations:', error);
    });
  }, []); // make socket connection

  
  useEffect(() => {
    const fetchCompanionData = async () => {
      if (UserData.companions !== 0) {

        const companionDataPromises = UserData.companions.map(async (id) => {
          const userData = await fetchUserDataById(id);
          return { id, userData }; // Store ID and user data
        });
        const companionData = await Promise.all(companionDataPromises);
        setCompanionsData(companionData);
      }
    };

    fetchCompanionData();
  }, [UserData.companions]);


  const fetchUserDataById = async (id) => {
    const response = await fetch(`http://localhost:5000/Users/id/${id}`);
    const userData = await response.json();
    return userData;
  };

  return (
    <div className='Conversations-main-div'>
      {noCompanions && (
        <div style={{paddingTop: '114px'}}>
          <h1>You have No Conversations</h1>
          <br/>
          <br/>
          <br/>
          <h2>Make a Conversation with a companion</h2>
          {companionsData.map(({ userData}, index) => (
            <div key={userData._id || userData.id} >
              <p style={{paddingTop: '10px'}}>{userData.username}</p>
              <p style={{wordWrap: 'break-word', marginTop: '-10px'}}>Daily: {userData.dailyObj}</p>
            </div>
          ))}
        </div>
      )}
      {!noCompanions && (
        <div style={{paddingTop: '114px'}}>
          <h1>Current Conversations</h1>
          {Conversations.map(Convo => {
            // Filter out the user's own ID from the messengers list
            const otherMessengers = Convo.messengers.filter(messengerId => messengerId !== UserData.id && messengerId !== UserData._id);
            
            return (
              <div style={{backgroundColor: 'white'}} key={Convo.id || Convo._id}>
                <h3>Convo With: {otherMessengers.join(', ')}</h3>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Messages;