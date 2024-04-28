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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    // Establish Socket connection
    const socket = io('http://localhost:5000');
    setSocket(socket);

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('new-message', (message) => {
      // Handle new message received by sender
      console.log('New message received:', message);
      // You can update state or perform other actions as needed
      fetchConversations();
    });

    return () => {
      // Clean up socket connection when component unmounts
      socket.disconnect();
    };
  }, []);

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

  const startNewConvo = () => {
    socket.emit('sending-A-Message', UserData.id || UserData._id, Convocompanionid, formData.message);
    setShowConvoWindow(false);
    setFormData({ message: '' }); // Reset message content
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
              const otherMessengers = Convo.messengers.filter(messengerId => messengerId !== UserData.id && messengerId !== UserData._id);
              return (
                <div style={{ backgroundColor: 'white' }} key={Convo.id || Convo._id}>
                  <h3>Convo With: {otherMessengers.join(', ')}</h3>
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
          <div>
            <h1 style={{ marginLeft: '50px', paddingTop: '50px' }}>Sending To: {Convocompanion}</h1>
            <br />
            <textarea
              style={{ marginLeft: '50px', backgroundColor: '#d8d8d89a', fontSize: '30px', minWidth: '850px', minHeight: '550px', maxWidth: '850px', maxHeight: '550px' }}
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