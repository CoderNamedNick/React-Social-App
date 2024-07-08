import { useState, useEffect, useRef } from "react";
import { io } from 'socket.io-client'
import { Link } from "react-router-dom";

const Messages = ({ UserData, setUserData, ClickedConvo, setClickedConvo }) => {
  const [ConversationsArray, setConversationsArray] = useState([]);
  const [ConvosClicked, setConvosClicked] = useState(true);
  const [PartiesClicked, setPartiesClicked] = useState(false);
  const [showPartysettings, setshowPartysettings] = useState(false);
  const [Party, setParty] = useState(null);
  const [PartiesArray, setPartiesArray] = useState([]);
  const [THECurrentConvo, setCurrentConvo] = useState(null);
  const [NoCurrentConvo, SetNoCurrentConvo] = useState(false);
  const [messagesArray, setmessagesArray] = useState([]);
  const [CurrentConvoCompanionName, setCurrentConvoCompanionName] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [errorMessage, seterrorMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io('https://tavern-backend-8tu5.onrender.com');
    setSocket(socket);

    socket.on('connect', () => {
      const userId = UserData.id || UserData._id;
      socket.emit('storeUserIdForInTheMessages', userId);
      socket.emit('Find-Parties', userId);
    });

    fetchConversations();
    SetNoCurrentConvo(true);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('New-Message-update', (Conversation) => {
        const currentUserInConversation = Conversation.messengers.includes(UserData.id) || Conversation.messengers.includes(UserData._id);
        fetchData();
        setCurrentConvo((prevConvo) => {
          if (currentUserInConversation && prevConvo && prevConvo.messageId === Conversation._id) {
            setmessagesArray(Conversation.messages);
            MarkMessagesRead();
          }
          return prevConvo;
        });
      });

      socket.on('Read-update', (NewUnreadNotifNumber) => {
        fetchData();
      });

      socket.on('Parties-Found', (parties) => {
        setPartiesArray(parties);
      });

      socket.on('Message-to-Party-update', (party) => {
        if (Party && Party._id === party._id) {
          setmessagesArray(party.messages);
        }
      });
      socket.on('Left-Party', (partyId) => {
        const userId = UserData.id || UserData._id
        socket.emit('Find-Parties', userId);
        setParty(null)
        fetchConversations();
        SetNoCurrentConvo(true);
      });
    }

    return () => {
      if (socket) {
        socket.off('New-Message-update');
        socket.off('Message-to-Party-update');
      }
    };
  }, [socket, Party]);

  const ConvoCLick = (ConvoID, CompanionsNames, Convo) => {
    setCurrentConvo(Convo);
    setParty(null);
    setmessagesArray([]);
    if (CompanionsNames !== '') {
      setCurrentConvoCompanionName(CompanionsNames);
    }
    fetch(`https://tavern-backend-8tu5.onrender.com/Messages/messagesById/id/${ConvoID}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch Message');
        }
      })
      .then(data => {
        SetNoCurrentConvo(false);
        setParty(null);
        setmessagesArray(data.messages);
      })
      .catch(error => {
        console.error('Error fetching conversations:', error);
      });
  };

  const PartyClick = (PartyID, PartyName, itsParty) => {
    setParty(itsParty);
    setmessagesArray([]);
    if (PartyName !== '') {
      setCurrentConvoCompanionName(PartyName);
    }
    if (socket) {
      socket.emit('get-party-messages', PartyID, (response) => {
        if (response.error) {
          console.error('Error fetching party messages:', response.error);
        } else {
          setmessagesArray(response.messages);
          SetNoCurrentConvo(false);
        }
      });
    }
  };
  useEffect(() => {
    if (THECurrentConvo) {
      MarkMessagesRead();
    }
  }, [THECurrentConvo]);


  const fetchData = async () => {
    try {
      const response = await fetch(`https://tavern-backend-8tu5.onrender.com/Messages/Conversations/${UserData.id || UserData._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      const data = await response.json();
      const conversations = data.conversations;

      const promises = conversations.map(conversation => {
        const companionId = conversation.messengers.find(id => id !== UserData.id && id !== UserData._id); 
        return new Promise(resolve => {
          socket.emit('message-count2', UserData.id || UserData._id, companionId, (unreadMessageCount) => {
            const updatedConversation = {
              ...conversation,
              NotifNumber: unreadMessageCount
            };
            resolve(updatedConversation);
          });
        });
      });

      Promise.all(promises).then(updatedConversations => {
        setConversationsArray(updatedConversations);
      });
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  useEffect(() => {
    if (socket) {
      fetchData();
    }
  }, [socket, UserData.id, UserData._id]);

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
        setConversationsArray(data.conversations);
      })
      .catch(error => {
        console.error('Error fetching conversations:', error);
      });
  };

  const handleWheelScroll = (event) => {
    const deltaY = event.deltaY;
    const scrollSpeed = 50;
    const messageDiv = document.querySelector('.Messages-alignment-div');
    messageDiv.scrollTop += deltaY > 0 ? scrollSpeed : -scrollSpeed;
  };

  const sendAMessage = async () => {
    if (Party === null) {
      try {
        if (THECurrentConvo.messengers.length === 2) {
          if (socket) {
            const Convocompanionid = THECurrentConvo.messengers.filter(id => id !== UserData.id && id !== UserData._id)[0];
            if (!UserData.companions.includes(Convocompanionid)) {
              seterrorMessage('this Traveler is No longer your Companion');
              return;
            }
            const userId = UserData.id || UserData._id;
            const content = messageInput;
            MarkMessagesRead()
            socket.emit('sending-A-New-Message', userId, Convocompanionid, content);
            setMessageInput('');
          }
        }
      } catch (error) {
        console.error('Error posting to API:', error.message);
      }
    }
    if (Party !== null) {
      if (socket) {
        const userId = UserData.id || UserData._id;
        const partyId = Party.id || Party._id;
        const content = messageInput;
        socket.emit('Send-Message-To-Party', userId, partyId, content);
        setMessageInput('');
      }
    }
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesArray]);

  const MarkMessagesRead = () => {
    if (socket && THECurrentConvo) {
      const Convocompanionid = THECurrentConvo.messengers.filter(id => id !== UserData.id && id !== UserData._id)[0];
      socket.emit('Mark-As-Read', UserData.id || UserData._id, Convocompanionid);
    }
  };

  const PartySettingsClicked = (TheParty) => {
    if (!showPartysettings) {
      setshowPartysettings(true)
      setParty(TheParty)
    }
    if (showPartysettings) {
      setshowPartysettings(false)
      setParty(null)
    }
  }

  const handlePartyandConvoswitch = () => {
    setConvosClicked(!ConvosClicked);
    setPartiesClicked(!PartiesClicked);
  };
  const handlePartyLeave = () => {
    const userId = UserData.id || UserData._id
    const PartyId = Party.id || Party._id
    socket.emit('Leave-Party', userId, PartyId )
  };

  return (
    <div className="main-messages-div">
      <div className="messages-div">
        { ConvosClicked && !PartiesClicked &&  (
          <div className="left-side-with-Conversations">
            <h4>Convos</h4>
            <div onClick={handlePartyandConvoswitch}>switch to parties</div>
            {ConversationsArray.map(Convo => {
                const otherUsernames = Convo.UserNames ? Convo.UserNames.filter(username => username !== UserData.username) : [];
                return (
                  <div onClick={() => {ConvoCLick(Convo.messageId, otherUsernames.join(', '), Convo)}} className='current-convos-messages' key={Convo.messageId}>
                    <h2 style={{wordBreak: 'break-word', paddingRight: '10px'}}>{otherUsernames.join(', ')}</h2>
                    <div className="Notif-Counter">{Convo.NotifNumber}</div>
                  </div>
                );
              })}
          </div>
        )}
        { !ConvosClicked && PartiesClicked && (
          <div className="left-side-with-Conversations">
            <h4>Parties</h4>
            <div onClick={handlePartyandConvoswitch}>switch to convos</div>
            {PartiesArray.map(TheParty => (
              <div onClick={() => {PartyClick(TheParty.id || TheParty._id, TheParty.partyname, TheParty)}} className='current-convos-messages' key={TheParty.messageId}>
                <h3 style={{wordBreak: 'break-word'}}>{TheParty.partyname}</h3>
                <div onClick={() => {PartySettingsClicked(TheParty)}} className="Parties-questionmark">?</div>
              </div>
              ))}
          </div>
        )}
        {!showPartysettings && (
          <div className="right-side-with-messages">
            {NoCurrentConvo && (<h2>Select A Conversation</h2>)}
            {!NoCurrentConvo && (
              <div style={{width: '100%'}}>
                <div style={{margin: '0',  fontSize: '34px',display: 'flex', flexDirection: 'column', marginBottom: '20px', backgroundColor: 'rgba(172, 175, 185, 0.288)', paddingBottom: '20px', alignItems: 'center'}}>{CurrentConvoCompanionName}</div>
                <div onWheel={handleWheelScroll} className="Messages-alignment-div">
                  {messagesArray.map((message, index) => (
                    <div key={index} className={message.senderUsername === UserData.username ? "message-right" : "message-left"}>
                      {Party === null && message.senderUsername === UserData.username && (
                        <p style={{margin: 0, marginTop: '30px'}}>{message.read ? "Read" : "Sent"}</p>
                      )}
                      {Party !== null && message.senderUsername !== UserData.username && (
                        <p style={{margin: 0, marginTop: '30px'}}>{message.senderUsername}</p>
                      )}
                      <p style={{marginTop: '5px'}} className={message.senderUsername === UserData.username ? "message-content" : "message-content2"}>{message.content}</p>
                    </div>
                  ))}
                <div ref={messagesEndRef} />
                </div>
                  <div className="input-div">
                    {errorMessage}
                    <input 
                    className="messages-input"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    ></input>
                    <button onClick={sendAMessage} className="send-btn">Send Message</button>
                  </div>
              </div>
            )}
          </div>
        )}
        {Party && showPartysettings && (
          <div className="right-side-with-messages">
            <h1>Party Settings</h1>
            <div className="party-setting-div">
              <div>Party Name: {Party.partyname}</div>
              <div>Creator: {Party.creatorUserName}</div>
              <div> Members: </div>
              <div>
               <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px'}}>
                  {Party.UserNames.map(user => (
                    <Link to={`/user/${user}`}><div style={{border: 'solid black 1px', padding: '5px 10px'}}>{user}</div></Link>
                  ))}
                </div>
              </div>
              <div>Total Messages: {Party.messages.length}</div>
            </div>
            <div className="LeaveParty" onClick={handlePartyLeave}>Leave Party</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages