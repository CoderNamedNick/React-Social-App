import React, { useState, useEffect } from "react";
import Travelers from "./Travelers";

const HomePage = () => {

 // div one udates status with post request to change dailyObj
  // fetch if person is in guild if guild 2nd div shows notifs if not display WANT TO JOIN A GUILD??
  // div three fecth if person is in party  Shows Party Notfis  if not display Mkae a party with travelers
  // div 4 Find Travelers a search Bar to find travelers
  // div 5 edit Profile book
  //Tavern News That Devs post about updates
  
  
  return (
    <div className='Homepage-main-div'>
      <div className="Travelelers-hompage-div">
        <Travelers />
      </div>
      <div className="Homepage-content-div">
        <div>
          <div>Set your daily objective So travelers can know you a little better</div>
          <input></input>
        </div>
        <div>Guild CONTENT</div>
        <div>Party CONTENT</div>
        <div>Find Travelers CONTENT</div>
        <div>MAIN CONTENT</div>
        <div>Tavern News CONTENT</div>
        
      </div>
    </div>
  );
};

export default HomePage;