import React from "react";
import Logo from './images/Tavern-logo.png'

const Header = () => {
  
  return( 
  <div class="Header-Main-Div">
    <img src={Logo} alt="TAVERN" class="Header-logo"></img>
    <div class="Header-title">
      <h1>TAVERN</h1> 
    </div>
    <div class="Header-menu">
      Drop down Menu 
    </div>
  </div>
  )
}

export default Header
