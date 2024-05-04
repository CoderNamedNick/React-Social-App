import { useState, useEffect } from "react";


const Messages = ({ UserData, setUserData, ClickedConvo, setClickedConvo }) => {
  const [ConversationsArray, setConversationsArray] = useState([]);
  const [CurrentConvo, setCurrentConvo] = useState(null);
  const [NoCurrentConvo, SetNoCurrentConvo] = useState(false)
  const [messagesArray, setmessagesArray] = useState([]);
  const [CurrentConvoCompanionName, setCurrentConvoCompanionName] = useState(``);

  const ConvoCLick = (ConvoID, CompanionsNames) => {
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
    console.log(messagesArray);
  }, [messagesArray, setmessagesArray]);

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
        setConversationsArray(data.conversations);
      })
    .catch(error => {
      console.error('Error fetching conversations:', error);
    }); 
  };

  

  //can just do a normal fetch for convos at first on load
  //set up socket for incoming messages and convos made by other companions
  
  return (
    <div className="main-messages-div">
      <div className="messages-div">{/*Make this have padding top with flexdir row */}
        <div className="left-side-with-Conversations">
          <h2>Conversations</h2>
          {ConversationsArray.map(Convo => {
              // Check if Convo.UserNames is defined before filtering
              const otherUsernames = Convo.UserNames ? Convo.UserNames.filter(username => username !== UserData.username) : [];
              return (
                <div onClick={() => {ConvoCLick(Convo.messageId, otherUsernames.join(', '))}} className='current-convos-messages' key={Convo.messageId}>
                  <h3>Convo With: {otherUsernames.join(', ')}</h3>
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
              <div className="Messages-alignment-div">
                {messagesArray.map((message, index) => (
                  <div key={index} className={message.senderUsername === UserData.username ? "message-right" : "message-left"}>
                    <h1>{message.content}</h1>
                  </div>
                ))}
              </div>
               {/*on click of convo get new messages with messages box and a array getting looped thru newest messages*/}
                <div className="input-div">
                  <input className="messages-input"></input>
                  <button className="send-btn">Send Message</button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages