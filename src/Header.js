import React from "react";
import { useLocation, Link } from "react-router-dom";
import Logo from './images/Tavern-logo.png'
import Menu from './icons/menu.png'

const Header = ({ title }) => {
  const location = useLocation();

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
    <div className="Header-Main-Div">
      <Link to='/HomePage'><img src={Logo} alt="TAVERN" className="Header-logo"></img></Link>
      <div className="Header-title">
        <h1>{title || getTitle()}</h1> 
      </div>
      <img src={Menu} alt="Menu" className="Header-menu"></img>
    </div>
  )
}

export default Header;
