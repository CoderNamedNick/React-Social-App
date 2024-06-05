import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Logo from './images/Tavern-logo.png'
import Menu from './icons/menu.png'
import { io } from "socket.io-client"

const Header = ({ title, LogOut, UserData, setUserData, clickedGuild, }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [convoCount, setconvoCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();


  // make notif counter for messages all added together


  // Function to get the title based on the current route
  const getTitle = () => {
    // Check if the current route contains "/user/" substring
    if (location.pathname.startsWith("/user/")) {
      // Extract the username from the URL
      const username = location.pathname.split("/")[2]; // Assuming "/user/:username" format
      
      // Return a custom title with the username
      return `${username}'s Profile Book`;
    }
    


    // For other routes, provide default titles
    switch (location.pathname) {
      case "/":
        return "Login";
      case "/SignUp":
        return "Sign Up";
      case "/HomePage":
        return "Home";
      case "/ProfileBook":
        return "Profile Book";
      case "/FindCompanions":
        return "Find Companions";
      case "/Companion-Request":
        return "Companion Request";
      case "/Block-List":
        return "Blocked Travelers";
      case "/Guild-Registry":
        return "Guild Registry";
      case "/All-Guilds":
        return "Guild Connections";
      case "/Join-Guild":
        return "Join A Guild";
      case "/Conversations":
        return "Conversations";
      case "/Messages":
        return "Messages";
      case "/GuildPages":
        if (clickedGuild) {
          return `${clickedGuild.guildName}`;
        } else {
          return "";
        }
      default:
        return "TAVERN"; // Default title
    }
  };
    
    useEffect(() => {
      // Establish Socket connection
      const socket = io('http://localhost:5000');
      setSocket(socket)
    
      socket.on('connect', () => {
        console.log('connected');
    
        // Retrieve user ID from session storage or wherever it's stored
        const userId = UserData.id || UserData._id; // Assuming the user ID is stored in session storage
        socket.emit('storeUserIdForConvos', userId);
        // If user ID exists, emit it to the server to get the initial message count
        if (userId) {
          socket.emit('Conversation-count', userId, (unreadConversationCount) => {
            console.log('got Conversation count response', unreadConversationCount);
            setconvoCount(unreadConversationCount); // Update message count based on the initial response
          });
          socket.emit('All-Unread-count', userId, (allunreadmessageCount) => {
            console.log('got messages count response', allunreadmessageCount);
            setMessageCount(allunreadmessageCount); // Update message count based on the initial response
          });
        }
      });
      // Clean up socket connection when component unmounts
      return () => {
        socket.disconnect();
      };
    
    }, [UserData]);

    useEffect(() => {
      const handleBannedFromGuild = (NewUserInfo) => {
        setUserData(NewUserInfo);
        if (location.pathname === "/GuildPages") {
          navigate('/HomePage');
        }
      };
      if (socket) {
        const userId = UserData.id || UserData._id
        // Listen for socket event indicating conversation count update
        socket.on('convo-count-update', (unreadConversationCount) => {
          console.log('Conversation count updated:', unreadConversationCount);
          setconvoCount(unreadConversationCount); // Update message count based on the updated response
        });
        socket.on('allunreadupdate', (NewUnreadNotifNumber) => {
          socket.emit('All-Unread-count', userId, (allunreadmessageCount) => {
            console.log('got messages count response', allunreadmessageCount);
            setMessageCount(allunreadmessageCount); // Update message count based on the initial response
          });
        });
        socket.on('Banned-From-A-Guild', handleBannedFromGuild);
        socket.on('Updated-User-Data', (NewUserData) => {
          setUserData(NewUserData)
        });
      }
    
      // Clean up event listener when component unmounts
      return () => {
        if (socket) {
          socket.off('convo-count-update');
        }
      };
    }, [location.pathname, navigate, socket, UserData]);

  const menuClick = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="Header">
      <div className="Header-Main-Div">
        <Link to='/HomePage'><img src={Logo} alt="TAVERN" className="Header-logo"></img></Link>
        <div className="Header-title">
          <h1 className="header-title">{title || getTitle()}</h1>
        </div>
        <img onClick={menuClick} src={Menu} alt="Menu" className="Header-menu"></img>
      </div>
      <div className={`header-drop-down-menu ${showMenu ? 'show-menu' : ''}`}>
        <h2>Tavern Menu</h2>
        <div>
          <Link to="/ProfileBook"><div className="Menu-p-s">Profile Book</div></Link>
          <Link to="/Conversations"><div className="Menu-p-s">Conversations<span className="messages-span">{convoCount}</span></div></Link>
          <Link to="/Messages"><div className="Menu-p-s">Messages<span className="messages-span">{messageCount}</span></div></Link>
          <div className="Menu-p-s">Form a Party</div>
          <Link to="/Join-Guild"><div className="Menu-p-s">Join A Guild</div></Link>
          <Link to="/Guild-Registry"><div className="Menu-p-s">Make A Guild</div></Link>
          <div className="Menu-p-s">Tavern News</div>
          <Link to="/Block-List"><div className="Menu-p-s">Blocked Travelers</div></Link>
          <Link to="/Login"><p className="menu-leave" onClick={LogOut}>Leave the Tavern</p></Link>
        </div>
      </div>
    </div>
  )
}

export default Header;