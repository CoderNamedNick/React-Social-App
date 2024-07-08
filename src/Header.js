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

  const getTitle = () => {
    if (location.pathname.startsWith("/user/")) {
      const username = location.pathname.split("/")[2]; 
      // Return a custom title with the username
      return `${username}'s Profile Book`;
    }

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
        return "Messages & Parties";
      case "/Form-A-Party":
        return "Form A Party";
      case "/Tavern-News":
        return "TAVERN NEWS";
      case "/GuildPages":
        if (clickedGuild) {
          return `${clickedGuild.guildName}`;
        } else {
          return "";
        }
      default:
        return "TAVERN"; 
    }
  };
    
    useEffect(() => {
      const socket = io('https://tavern-backend-8tu5.onrender.com');
      setSocket(socket)
    
      socket.on('connect', () => {
        const userId = UserData.id || UserData._id;
        socket.emit('storeUserIdForConvos', userId);

        if (userId) {
          socket.emit('Conversation-count', userId, (unreadConversationCount) => {
            setconvoCount(unreadConversationCount); 
          });
          socket.emit('All-Unread-count', userId, (allunreadmessageCount) => {
            setMessageCount(allunreadmessageCount); 
          });
        }
      });
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
        socket.on('convo-count-update', (unreadConversationCount) => {
          setconvoCount(unreadConversationCount); 
        });
        socket.on('allunreadupdate', (NewUnreadNotifNumber) => {
          socket.emit('All-Unread-count', userId, (allunreadmessageCount) => {
            setMessageCount(allunreadmessageCount); 
          });
        });
        socket.on('Banned-From-A-Guild', handleBannedFromGuild);
        socket.on('Updated-User-Data', (NewUserData) => {
          setUserData(NewUserData)
        });
      }
    
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
          <div className="header-title">{title || getTitle()}</div>
        </div>
        <img onClick={menuClick} src={Menu} alt="Menu" className="Header-menu"></img>
      </div>
      <div className={`header-drop-down-menu ${showMenu ? 'show-menu' : ''}`}>
        <h2>Tavern Menu</h2>
        <div>
          <Link to="/ProfileBook"><div className="Menu-p-s">Profile Book</div></Link>
          <Link to="/Conversations"><div className="Menu-p-s">Conversations<span className="messages-span">{convoCount}</span></div></Link>
          <Link to="/Messages"><div className="Menu-p-s">Messages & Parties<span className="messages-span">{messageCount}</span></div></Link>
          <Link to="/Form-A-Party"><div className="Menu-p-s">Form a Party</div></Link>
          <Link to="/Join-Guild"><div className="Menu-p-s">Join A Guild</div></Link>
          <Link to="/Guild-Registry"><div className="Menu-p-s">Make A Guild</div></Link>
          <Link to="/Tavern-News"><div className="Menu-p-s">Tavern News</div></Link>
          <Link to="/Block-List"><div className="Menu-p-s">Blocked Travelers</div></Link>
          <Link to="/Login"><p style={{marginLeft: '25px'}} className="menu-leave" onClick={LogOut}>Leave the Tavern</p></Link>
        </div>
      </div>
    </div>
  )
}

export default Header;