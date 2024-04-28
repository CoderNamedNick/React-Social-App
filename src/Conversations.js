import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Conversations = ({ UserData, setUserData }) => {
  const [noCompanions, setNocompanions] = useState(false);
  const [Conversations, setConversations] = useState([]);
  const [companionsData, setCompanionsData] = useState([]);
  const [showConvoWindow, setshowConvoWindow] = useState(false);
  const [Convocompanion, setConvocompanion] = useState('');
  const [Convocompanionid, setConvocompanionid] = useState('');

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
  const cancelconvo = () => {
    setshowConvoWindow(false)
  }
  const startconvoclick = (companionName, companionid) => {
    setshowConvoWindow(!showConvoWindow)
    setConvocompanion(companionName)
    setConvocompanionid(companionid)
  }

  const StartNewConvo = () => {

  }

  return (
    <div className='Conversations-main-div'>
     {!showConvoWindow && noCompanions && (
        <div className='Convos-div'>
          <h1>You have No Conversations</h1>
          <br />
          <br />
          <br />
          <h2>Make a Conversation with a companion</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7px', width: '98%',}}>
            {companionsData.map(({ userData }, index) => (
              <div className='Convo-companion-map-div' key={userData._id || userData.id} >
                <h3>{userData.username}</h3>
                <p style={{ wordWrap: 'break-word', marginTop: '-10px' }}>Daily: {userData.dailyObj}</p>
                <div style={{display: 'flex', flexDirection: 'row', gap: '15px', justifyContent: 'space-between' }}>
                  <Link key={userData._id || userData.id} to={`/user/${userData.username}`}><div>View Profile</div></Link>
                  <div style={{cursor: 'pointer'}} onClick={() => {startconvoclick(userData.username, userData._id || userData.id)}}>Make A Conversation</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!showConvoWindow && !noCompanions && (
        <div style={{paddingTop: '114px'}}>
          <div>
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
          <br />
          <br />
          <h2>Make A New Conversation</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7px', width: '98%',}}>
            {companionsData.map(({ userData }, index) => (
              <div className='Convo-companion-map-div' key={userData._id || userData.id} >
                <h3>{userData.username}</h3>
                <p style={{ wordWrap: 'break-word', marginTop: '-10px' }}>Daily: {userData.dailyObj}</p>
                <div style={{display: 'flex', flexDirection: 'row', gap: '15px', justifyContent: 'space-between' }}>
                  <Link key={userData._id || userData.id} to={`/user/${userData.username}`}><div>View Profile</div></Link>
                  <div style={{cursor: 'pointer'}} onClick={startconvoclick}>Make A Conversation</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showConvoWindow && (
        <div className='convo-window-main-div'>
          <div>
            <h1 style={{marginLeft: '50px', paddingTop: '50px'}}>Sending To: {Convocompanion}</h1>
            <br/>
            <textarea style={{marginLeft: '50px', backgroundColor: '#d8d8d89a', fontSize: '30px', minWidth: '850px', minHeight: '550px', maxWidth: '850px', maxHeight: '550px'}}></textarea>
          </div>
          <h2 style={{cursor: 'pointer', position: 'absolute', left: '10px', bottom: '0'}} onClick={cancelconvo}>Cancel Message</h2>
          <h1 style={{cursor: 'pointer', position: 'absolute', right: '10px', bottom: '0'}} onClick={cancelconvo}>Send Message</h1>
        </div>
      )}
    </div>
  );
};

export default Conversations;