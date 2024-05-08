import { useState, useEffect, useRef } from "react";
import { io } from 'socket.io-client'


const Messages = ({ UserData, setUserData, ClickedConvo, setClickedConvo }) => {
  const [ConversationsArray, setConversationsArray] = useState([]);
  const [CurrentConvo, setCurrentConvo] = useState(null);
  const [NoCurrentConvo, SetNoCurrentConvo] = useState(false)
  const [messagesArray, setmessagesArray] = useState([]);
  const [CurrentConvoCompanionName, setCurrentConvoCompanionName] = useState(``);
  const [messageInput, setMessageInput] = useState('');
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
        // Check if the current user is part of the conversation and the message id matches the current conversation's message id
        if (currentUserInConversation && CurrentConvo && CurrentConvo.messageId === Conversation._id) {
          setmessagesArray(Conversation.messages);
        }
      });
    }
  
    // Clean up event listener when component unmounts
    return () => {
      if (socket) {
        socket.off('New-Message-update');
      }
    };
  }, [socket, setmessagesArray, UserData.id, UserData._id, CurrentConvo]);


  const ConvoCLick = (ConvoID, CompanionsNames, Convo) => {
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
        console.log(messagesArray)
      })
    .catch(error => {
      console.error('Error fetching conversations:', error);
    });
    
  }
  
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

  useEffect(() => {
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
    try {
      console.log('this is current convo', CurrentConvo)
      console.log(UserData.id , UserData._id)
      //do this if mesaages are only between 2 people
      if (CurrentConvo.messengers.length === 2) {
        console.log('less than two')
        if (socket) {
          const Convocompanionid = CurrentConvo.messengers.filter(id => id !== UserData.id && id !== UserData._id)[0];
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
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesArray]);
  

  const MarkMessagesRead = () => {
    
  }
  
  return (
    <div className="main-messages-div">
      <div className="messages-div">{/*Make this have padding top with flexdir row */}
        <div className="left-side-with-Conversations">
          <h3>Conversations</h3>
          {ConversationsArray.map(Convo => {
              // Check if Convo.UserNames is defined before filtering
              const otherUsernames = Convo.UserNames ? Convo.UserNames.filter(username => username !== UserData.username) : [];
              return (
                <div onClick={() => {ConvoCLick(Convo.messageId, otherUsernames.join(', '), Convo)}} className='current-convos-messages' key={Convo.messageId}>
                  <h3>Convo With: {otherUsernames.join(', ')}</h3>
                  <div className="Notif-Counter">{Convo.NotifNumber}</div>
                </div>
              );
            })}
        
          {/*loop thru array after fetch  post convos on left side with username of person*/}
        </div>
        <div className="right-side-with-messages">
          {NoCurrentConvo && (<h1>CLick a convo</h1>)}
          {!NoCurrentConvo && (
            <div>
              <h1 style={{margin: '0', marginBottom: '20px', paddingLeft: '50%', backgroundColor: 'rgba(172, 175, 185, 0.288)', paddingBottom: '20px'}}>{CurrentConvoCompanionName}</h1>
              <div onWheel={handleWheelScroll} className="Messages-alignment-div">
                {messagesArray.map((message, index) => (
                  <div key={index} className={message.senderUsername === UserData.username ? "message-right" : "message-left"}>
                    {message.senderUsername === UserData.username && (
                      <p style={{margin: 0, marginTop: '30px'}}>{message.read ? "Read" : "Sent"}</p>
                    )}
                    <p style={{margin: 0}} className={message.senderUsername === UserData.username ? "message-content" : "message-content2"}>{message.content}</p>
                  </div>
                ))}
               <div ref={messagesEndRef} />
              </div>
               {/*on click of convo get new messages with messages box and a array getting looped thru newest messages*/}
                <div className="input-div">
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