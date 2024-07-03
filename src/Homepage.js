import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Travelers from "./Travelers";

const HomePage = ({UserData, setUserData}) => {
  console.log(UserData)

  return (
    <div className='Homepage-main-div'>
      <div>
        <Travelers UserData={UserData} setUserData={setUserData}/>
      </div>
      <div className="Homepage-content-div">
        <Link to='/ProfileBook'>
          <div className="Homepage-contents-divs"> 
            <h2>Profile Book</h2>
          </div>
        </Link>

        {/* Div for Guild content */}
        <Link to="/All-Guilds">
          <div className="Homepage-contents-divs">
            <h2>Guild Content</h2>
          </div>
        </Link>

        {/* Div for Party content */}
        <Link to="/Messages"><div className="Homepage-contents-divs">
          <h2>Messages & Party Content</h2>
        </div></Link>

        {/* Div for finding travelers */}
        <Link to="/FindCompanions"><div className="Homepage-contents-divs">
          <h2>Find Travelers</h2>
        </div></Link>

        {/* Div for Tavern News */}
        <Link to="/Tavern-News"><div style={{marginBottom: '100px'}} className="Homepage-contents-divs">
          <h2>Tavern News</h2>
        </div></Link>
      </div>
    </div>
  );
};

export default HomePage;