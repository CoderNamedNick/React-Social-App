import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Logo from './images/Tavern-logo.png'
import Menu from './icons/menu.png'

const Header = ({ title, LogOut }) => {
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  const menuClick = () => {
    setShowMenu(!showMenu);
  };

  // Function to get the title based on the current route
  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Login";
      case "/SignUp":
        return "Sign Up";
      case "/HomePage":
        return "Home";
      case "/ProfileBook":
        return "ProfileBook";
      default:
        return "TAVERN"; // Default title
    }
  };

  return( 
    <div>
      <div className="Header-Main-Div">
        <Link to='/HomePage'><img src={Logo} alt="TAVERN" className="Header-logo"></img></Link>
        <div className="Header-title">
          <h1 className="medievalsharp-regular">{title || getTitle()}</h1> 
        </div>
        <img onClick={menuClick} src={Menu} alt="Menu" className="Header-menu"></img>
      </div>
      <div className={`header-drop-down-menu ${showMenu ? 'show-menu' : ''}`}>
        <h2>Tavern Menu</h2>
        <div>
          <Link to="/ProfileBook"><div className="Menu-p-s">Profile Book</div></Link>
          <div className="Menu-p-s">Join A Guild</div>
          <div className="Menu-p-s">Tavern News</div>
          <div className="Menu-p-s">Make A Guild</div>
          <div className="Menu-p-s">Form a Party</div>
          <Link to="/Login"><p className="menu-leave"onClick={LogOut}>Leave the Tavern</p></Link>
        </div>
      </div>
    </div>
  )
}

export default Header;