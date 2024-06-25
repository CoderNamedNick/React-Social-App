import { useState, useEffect, useRef } from "react";
import { io } from 'socket.io-client'


const Messages = ({ UserData, setUserData, ClickedConvo, setClickedConvo }) => {
  const [ConversationsArray, setConversationsArray] = useState([]);
  const [ConvosClicked, setConvosClicked] = useState(true)
  const [PartiesClicked, setPartiesClicked] = useState(false)
  const [Party, setParty] = useState(null)
  const [PartiesArray, setPartiesArray] = useState([]);
  const [CurrentConvo, setCurrentConvo] = useState(null);
  const [NoCurrentConvo, SetNoCurrentConvo] = useState(false)
  const [messagesArray, setmessagesArray] = useState([]);
  const [CurrentConvoCompanionName, setCurrentConvoCompanionName] = useState(``);
  const [messageInput, setMessageInput] = useState('');
  const [errorMessage, seterrorMessage] = useState('')
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish Socket connection
    const socket = io('http://localhost:5000');
    setSocket(socket)
   // make a socket for notifs
    socket.on('connect', () => {
      console.log('connected');
      const userId = UserData.id || UserData._id;
      socket.emit('storeUserIdForInTheMessages', userId);
      socket.emit('Find-Parties', userId)
    });
   
    // Clean up socket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  
  }, []);

  useEffect(() => {
    if (socket) {
      // Listen for socket event indicating message update
      socket.on('New-Message-update', (Conversation) => {
        // Check if the current user is part of the conversation
        const currentUserInConversation = Conversation.messengers.includes(UserData.id) || Conversation.messengers.includes(UserData._id);
        console.log('Current convo message Id', CurrentConvo?.messageId); // Use optional chaining
        console.log('new convo received id', Conversation._id);
        fetchData()
        // Check if the current user is part of the conversation and the message id matches the current conversation's message id
        if (currentUserInConversation && CurrentConvo && CurrentConvo.messageId === Conversation._id) {
          setmessagesArray(Conversation.messages);
          MarkMessagesRead();
        }
      });
      socket.on('Read-update', (NewUnreadNotifNumber) => {
        console.log('got a read update')
        fetchData()
      })
      socket.on('Parties-Found', (parties) => {
        setPartiesArray(parties)
        console.log("this is parties")
        console.log(parties)
      })
      socket.on('Message-to-Party-update', (party) => {
        if (Party && Party._id === party._id) {
          setmessagesArray(party.messages);
        }
      });
    }
  
    // Clean up event listener when component unmounts
    return () => {
      if (socket) {
        socket.off('New-Message-update');
        socket.off('Message-to-Party-update');
      }
    };
  }, [socket, Party]);


  const ConvoCLick = (ConvoID, CompanionsNames, Convo) => {
    setParty(null)
    setmessagesArray([]);
    if (CompanionsNames !== '') {
      setCurrentConvoCompanionName(CompanionsNames)
      console.log(CompanionsNames)
    }
    fetch(`http://localhost:5000/Messages/messagesById/id/${ConvoID}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch Message');
        }
      })
      .then(data => {
        console.log(data.messages);
        setmessagesArray(data.messages)
        SetNoCurrentConvo(false)
        setCurrentConvo(Convo)
        setParty(null)
        console.log(messagesArray)
      })
    .catch(error => {
      console.error('Error fetching conversations:', error);
    });
    
  }

  const PartyClick = (PartyID, PartyName, itsParty) => {
    setParty(itsParty);
    setmessagesArray([]);
    if (PartyName !== '') {
      setCurrentConvoCompanionName(PartyName)
    }
    if (socket) {
      socket.emit('get-party-messages', PartyID, (response) => {
        if (response.error) {
          console.error('Error fetching party messages:', response.error);
        } else {
          setmessagesArray(response.messages)
          SetNoCurrentConvo(false)
        }
      });
    }
  }
  
  useEffect(() => {
    if (CurrentConvo) {
      MarkMessagesRead();
    }
  }, [CurrentConvo]);
  
  useEffect(() => {
    setCurrentConvoCompanionName('')
    //setting Current with what convo was clicked
    if (ClickedConvo && ClickedConvo.UserNames) {
      const othersNames = ClickedConvo.UserNames.filter(name => name !== UserData.username);
      const OtherN = othersNames.join(', ')
      setCurrentConvoCompanionName(`${OtherN}`);
    }
    fetchConversations()
    if (ClickedConvo === null) {
      SetNoCurrentConvo(true)
    } else{
      setCurrentConvo(ClickedConvo)
      ConvoCLick(ClickedConvo.messageId,CurrentConvoCompanionName)
      console.log(messagesArray)
    }
    // when getting cliked convo compare it to fetch new array and display it on launch
    return () => {
      setClickedConvo(null)
    };
  }, []); 


  const fetchData = async () => {
    try {
      // Fetch conversations
      const response = await fetch(`http://localhost:5000/Messages/Conversations/${UserData.id || UserData._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      const data = await response.json();
      const conversations = data.conversations;

      // Update conversation array with unread message counts
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

  useEffect(() => {
    console.log(messagesArray);
    console.log('current Convo', CurrentConvo)
    console.log('convo array', ConversationsArray)
  }, [messagesArray, setmessagesArray]);

  const fetchConversations = () => {
    fetch(`http://localhost:5000/Messages/Conversations/${UserData.id || UserData._id}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch conversations');
        }
      })
      .then(data => {
        console.log(data.conversations);
        setConversationsArray(data.conversations);
      })
    .catch(error => {
      console.error('Error fetching conversations:', error);
    }); 
  };

  
  const handleWheelScroll = (event) => {
    const deltaY = event.deltaY;
    const scrollSpeed = 50; // Adjust scroll speed as needed
    const messageDiv = document.querySelector('.Messages-alignment-div');
    messageDiv.scrollTop += deltaY > 0 ? scrollSpeed : -scrollSpeed;
  };

  const sendAMessage = async () => {
    if (Party === null) {
      try {
        if (CurrentConvo.messengers.length === 2) {
          console.log('less than two')
          if (socket) {
            const Convocompanionid = CurrentConvo.messengers.filter(id => id !== UserData.id && id !== UserData._id)[0];
            if (!UserData.companions.includes(Convocompanionid)) {
              seterrorMessage('this Traveler is No longer your Companion')
              return
            } 
            const userId = UserData.id || UserData._id
            const content = messageInput
            console.log(Convocompanionid)
            socket.emit('sending-A-New-Message', userId, Convocompanionid, content)
            setMessageInput('');
          }
        } 
      }catch (error) {
        console.error('Error posting to API:', error.message);
        // Handle error, show an error message
      }
    }
    if (Party !== null) {
      if (socket) {
        console.log('party is not null')
        const userId = UserData.id || UserData._id
        const partyId = Party.id || Party._id
        const content = messageInput
        socket.emit('Send-Message-To-Party', userId, partyId, content)
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
    if (socket) {
      const Convocompanionid = CurrentConvo.messengers.filter(id => id !== UserData.id && id !== UserData._id)[0];
      socket.emit('Mark-As-Read', UserData.id || UserData._id, Convocompanionid)
    }
  }
  const handlePartyandConvoswitch = () => {
    setConvosClicked(!ConvosClicked)
    setPartiesClicked(!PartiesClicked)
  }
  
  return (
    <div className="main-messages-div">
      <div className="messages-div">{/*Make this have padding top with flexdir row */}
        { ConvosClicked && !PartiesClicked &&  (
          <div className="left-side-with-Conversations">
            <h4>Convos</h4>
            <div onClick={handlePartyandConvoswitch}>switch to parties</div>
            {ConversationsArray.map(Convo => {
                // Check if Convo.UserNames is defined before filtering
                const otherUsernames = Convo.UserNames ? Convo.UserNames.filter(username => username !== UserData.username) : [];
                return (
                  <div onClick={() => {ConvoCLick(Convo.messageId, otherUsernames.join(', '), Convo)}} className='current-convos-messages' key={Convo.messageId}>
                    <h2>{otherUsernames.join(', ')}</h2>
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
                <h2>{TheParty.partyname}</h2>
              </div>
              ))}
          </div>
        )}
        <div className="right-side-with-messages">
          {NoCurrentConvo && (<h1>Select A Conversation</h1>)}
          {!NoCurrentConvo && (
            <div>
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
                    <p style={{margin: 0}} className={message.senderUsername === UserData.username ? "message-content" : "message-content2"}>{message.content}</p>
                  </div>
                ))}
               <div ref={messagesEndRef} />
              </div>
               {/*on click of convo get new messages with messages box and a array getting looped thru newest messages*/}
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
      </div>
    </div>
  )
}

export default Messages