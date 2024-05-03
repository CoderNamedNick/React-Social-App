import { useState, useEffect } from "react";


const Messages = ({ UserData, setUserData, ClickedConvo, setClickedConvo }) => {
  const [ConversationsArray, setConversationsArray] = useState([]);
  const [CurrentConvo, setCurrentConvo] = useState(null);
  const [NoCurrentConvo, SetNoCurrentConvo] = useState(false)
  const [messagesArray, setmessagesArray] = useState([])

  useEffect(() => {
    //setting Current with what convo was clicked
    console.log(ClickedConvo)
    fetchConversations()
    if (ClickedConvo === null) {
      SetNoCurrentConvo(true)
    } else{
      setCurrentConvo(ClickedConvo)
    }
    // when getting cliked convo compare it to fetch new array and display it on launch
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
        setConversationsArray(data.conversations);
      })
    .catch(error => {
      console.error('Error fetching conversations:', error);
    });
  };

  const ConvoCLick = (ConvoID) => {
    fetch(`http://localhost:5000/Messages/messagesById/id/${ConvoID}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch Message');
        }
      })
      .then(data => {
        console.log(data);
        setmessagesArray(data.messages.messages)
      })
    .catch(error => {
      console.error('Error fetching conversations:', error);
    });
    console.log(messagesArray)
  }
  

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
                <div onClick={() => {ConvoCLick(Convo.messageId)}} className='current-convos-messages' key={Convo.messageId}>
                  <h3>Convo With: {otherUsernames.join(', ')}</h3>
                </div>
              );
            })}
        
          {/*loop thru array after fetch  post convos on left side with username of person*/}
        </div>
        <div className="right-side-with-messages">
          {NoCurrentConvo && (<h1>CLick a convo</h1>)}

          {/*on click of convo get new messages with messages box and a array getting looped thru newest messages*/}
        </div>
      </div>
    </div>
  )
}

export default Messages