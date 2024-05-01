import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

const Conversations = ({ UserData, setUserData }) => {
  const [noCompanions, setNoCompanions] = useState(false);
  const [Conversations, setConversations] = useState([]);
  const [companionsData, setCompanionsData] = useState([]);
  const [showConvoWindow, setShowConvoWindow] = useState(false);
  const [Convocompanion, setConvocompanion] = useState('');
  const [Convocompanionid, setConvocompanionid] = useState('');
  const [socket, setSocket] = useState(null);
  const [formData, setFormData] = useState({
    message: '',
  });

  useEffect(() => {
    // Establish Socket connection
    const socket = io('http://localhost:5000');
    setSocket(socket)
  
    socket.on('connect', () => {
      console.log('connected');
    });
    // Clean up socket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    // Fetch user conversations when component mounts
    fetchConversations();
  }, []);

  const fetchConversations = () => {
    fetch(`http://localhost:5000/Messages/Conversations/${UserData.id || UserData.id}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch conversations');
        }
      })
      .then(data => {
        console.log(data.conversations);
        setConversations(data.conversations);
        setNoCompanions(data.conversations.length === 0);
      })
    .catch(error => {
      console.error('Error fetching conversations:', error);
    });
  };

  useEffect(() => {
    // Fetch companion data when UserData.companions change
    const fetchCompanionData = async () => {
      if (UserData.companions.length > 0) {
        const companionDataPromises = UserData.companions.map(async id => {
          const userData = await fetchUserDataById(id);
          return { id, userData };
        });
        const companionData = await Promise.all(companionDataPromises);
        setCompanionsData(companionData);
      }
    };

    fetchCompanionData();
  }, [UserData.companions]);

  const fetchUserDataById = async id => {
    const response = await fetch(`http://localhost:5000/Users/id/${id}`);
    const userData = await response.json();
    return userData;
  };

  const startConvoClick = (companionName, companionid) => {
    setShowConvoWindow(true);
    setConvocompanion(companionName);
    setConvocompanionid(companionid);
  };

  const cancelConvo = () => {
    setShowConvoWindow(false);
    setFormData({ message: '' }); // Reset message content
  };

  const startNewConvo = async () => {
    console.log(UserData.id || UserData._id, Convocompanionid, formData.message)
    try {
      const response = await fetch(`http://localhost:5000/Messages/messages/${UserData.id || UserData._id}/send/${Convocompanionid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: formData.message })
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Post successful:', data);
  
        // Emit socket event to the companion
        if (socket) {
          const userId = UserData.id || UserData._id
          const companionId = Convocompanionid
          socket.emit('new-convo', userId, companionId );
          console.log('new convo sent');
        }
  
        // Handle success, update state or show a success message
        setShowConvoWindow(false);
        setFormData({ message: '' }); // Reset message content
      } else {
        console.error('Error posting to API:', response.statusText);
        // Handle error, show an error message
      }
    } catch (error) {
      console.error('Error posting to API:', error.message);
      // Handle error, show an error message
    }
    fetchConversations()
  };

  return (
    <div className='Conversations-main-div'>
      {!showConvoWindow && noCompanions && (
        <div className='Convos-div'>
          <h1>You have No Conversations</h1>
          <br />
          <br />
          <br />
          <h2>Make a Conversation with a companion</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7px', width: '98%', }}>
            {companionsData.map(({ userData }, index) => (
              <div className='Convo-companion-map-div' key={userData._id || userData.id} >
                <h3>{userData.username}</h3>
                <p style={{ wordWrap: 'break-word', marginTop: '-10px' }}>Daily: {userData.dailyObj}</p>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '15px', justifyContent: 'space-between' }}>
                  <Link key={userData._id || userData.id} to={`/user/${userData.username}`}><div>View Profile</div></Link>
                  <div style={{ cursor: 'pointer' }} onClick={() => startConvoClick(userData.username, userData._id || userData.id)}>Make A Conversation</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!showConvoWindow && !noCompanions && (
        <div style={{ paddingTop: '114px' }}>
          <div>
            <h1>Current Conversations</h1>
            {Conversations.map(Convo => {
              // Check if Convo.UserNames is defined before filtering
              const otherUsernames = Convo.UserNames ? Convo.UserNames.filter(username => username !== UserData.username) : [];
              return (
                <div className='current-convos' key={Convo.id || Convo._id}>
                  <h3>Convo With: {otherUsernames.join(', ')}</h3>
                </div>
              );
            })}
          </div>
          <br />
          <br />
          <h2>Make A New Conversation</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '7px', width: '98%', }}>
            {companionsData.map(({ userData }, index) => (
              <div className='Convo-companion-map-div' key={userData._id || userData.id} >
                <h3>{userData.username}</h3>
                <p style={{ wordWrap: 'break-word', marginTop: '-10px' }}>Daily: {userData.dailyObj}</p>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '15px', justifyContent: 'space-between' }}>
                  <Link key={userData._id || userData.id} to={`/user/${userData.username}`}><div>View Profile</div></Link>
                  <div style={{ cursor: 'pointer' }} onClick={() => startConvoClick(userData.username, userData._id || userData.id)}>Make A Conversation</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showConvoWindow && (
        <div className='convo-window-main-div'>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <h1 style={{alignSelf: 'center'}}>Start a conversation and Send a message</h1>
            <h2 >Sending To: {Convocompanion}</h2>
            <br />
            <textarea
              className='start-new-convo-textarea'
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message">
            </textarea>
          </div>
          <h2 style={{ cursor: 'pointer', position: 'absolute', left: '10px', bottom: '0' }} onClick={cancelConvo}>Cancel Message</h2>
          <h1 style={{ cursor: 'pointer', position: 'absolute', right: '10px', bottom: '0' }} onClick={startNewConvo}>Send Message</h1>
        </div>
      )}
    </div>
  );
};

export default Conversations;