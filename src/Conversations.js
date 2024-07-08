import React, { useState, useEffect } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const Conversations = ({ UserData, setUserData, ClickedConvo, setClickedConvo }) => {
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
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io('https://tavern-backend-8tu5.onrender.com');
    setSocket(socket)
    socket.on('connect', () => {
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = () => {
    fetch(`https://tavern-backend-8tu5.onrender.com/Messages/Conversations/${UserData.id || UserData._id}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch conversations');
        }
      })
      .then(data => {
        setConversations(data.conversations);
        setNoCompanions(data.conversations.length === 0);
      })
    .catch(error => {
      console.error('Error fetching conversations:', error);
    });
  };

  useEffect(() => {
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
    const response = await fetch(`https://tavern-backend-8tu5.onrender.com/Users/id/${id}`);
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
    setFormData({ message: '' });
  };

  const startNewConvo = async () => {
    try {
      const response = await fetch(`https://tavern-backend-8tu5.onrender.com/Messages/messages/${UserData.id || UserData._id}/send/${Convocompanionid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: formData.message })
      });
      if (response.ok) {
        const data = await response.json();
        if (socket) {
          const userId = UserData.id || UserData._id
          const companionId = Convocompanionid
          socket.emit('new-convo', userId, companionId );
        }
        setShowConvoWindow(false);
        setFormData({ message: '' }); 
      } else {
        console.error('Error posting to API:', response.statusText);
      }
    } catch (error) {
      console.error('Error posting to API:', error.message);
    }
    fetchConversations()
  };

  const ConvoClicked = (ConvoData) => {
    navigate(`/Messages`)
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
          <div className='Make-A-convo-grid'>
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
              const otherUsernames = Convo.UserNames ? Convo.UserNames.filter(username => username !== UserData.username) : [];
              return (
                <div onClick={() => {ConvoClicked(Convo)}} className='current-convos' key={Convo.id || Convo._id}>
                  <h3>Convo With: {otherUsernames.join(', ')}</h3>
                </div>
              );
            })}
          </div>
          <br />
          <br />
          <h2>Make A New Conversation</h2>
          <div className='Make-A-convo-grid' >
          {companionsData
            .filter(({ userData }) => {
              return !Conversations.some(Convo =>
                Convo.UserNames && Convo.UserNames.includes(userData.username)
              );
            })
            .map(({ userData }, index) => (
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
            <h2 style={{alignSelf: 'center'}}>Start a conversation and Send a message</h2>
            <h3>Sending To: {Convocompanion}</h3>
            <br />
            <textarea
              className='start-new-convo-textarea'
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message">
            </textarea>
          </div>
          <h2 style={{ cursor: 'pointer', position: 'absolute', left: '10px', bottom: '0' }} onClick={cancelConvo}>Cancel </h2>
          <h2 style={{ cursor: 'pointer', position: 'absolute', right: '10px', bottom: '0' }} onClick={startNewConvo}>Send Message</h2>
        </div>
      )}
    </div>
  );
};

export default Conversations;