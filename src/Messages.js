import { useState } from "react";


const Messages = ({ UserData, setUserData, ClickedConvo, setClickedConvo }) => {
  const [ConversationsArray, setConversationsArray] = useState([]);
  const [CurrentConvo, setCurrentConvo] = useState(null);
  const [messagesArray, setmessagesArray] = useState([])

  //can just do a normal fetch for convos at first on load
  //set up socket for incoming messages and convos made by other companions
  
  return (
    <div className="main-messages-div">
      <div className="messages-div">{/*Make this have padding top with flexdir row */}
        <div className="left-side-with-Conversations">
          <h2>Conversations</h2>
        
          {/*loop thru array after fetch  post convos on left side with username of person*/}
        </div>
        <div className="right-side-with-messages">
          <h1>CLick a convo</h1>

          {/*on click of convo get new messages with messages box and a array getting looped thru newest messages*/}
        </div>
      </div>
    </div>
  )
}

export default Messages