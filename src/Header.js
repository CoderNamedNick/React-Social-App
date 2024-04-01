import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Logo from './images/Tavern-logo.png'
import Menu from './icons/menu.png'

const Header = ({ title }) => {
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
      default:
        return "TAVERN"; // Default title
    }
  };

  return( 
    <div>
      <div className="Header-Main-Div">
        <Link to='/HomePage'><img src={Logo} alt="TAVERN" className="Header-logo"></img></Link>
        <div className="Header-title">
          <h1>{title || getTitle()}</h1> 
        </div>
        <img onClick={menuClick} src={Menu} alt="Menu" className="Header-menu"></img>
      </div>
      <div className={`header-drop-down-menu ${showMenu ? 'show-menu' : ''}`}>
        <h2>Tavern Menu</h2>
        <div>
          <p>Profile Book</p>
          <p>Join A Guild</p>
          <p>Tavern News</p>
          <p>Make A Guild</p>
          <p>Form a Party</p>
          <hr></hr>
          <p>Leave the Tavern</p>
        </div>
      </div>
    </div>
  )
}

export default Header;