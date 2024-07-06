import React, { useState, useEffect } from "react";

const TavernNews = ({ UserData, setUserData }) => {
  const [ShowUpdatesComingsSoon, setShowUpdatesComingsSoon] = useState(false);
  const [ShowBehindTheTavern, setShowBehindTheTavern] = useState(false);
  const [ShowHowToHelpTheTavern, setShowHowToHelpTheTavern] = useState(false);
  const [ShowReportAProblemorBug, setShowReportAProblemorBug] = useState(false);
  const [ShowContactTavern, setShowContactTavern] = useState(false);
  

  return (
    <div className="Tavern-News-main-div">
      <h2>Hello And Welcome To Tavern News</h2>
      <div style={{display:'flex', flexDirection: 'column', gap: '10px'}}>
        <div className="TN-contents-divs">
          <h2>Updates Comings Soon?</h2>
        </div>
        <div className="TN-contents-divs">
          <div><h2>Behind The Tavern</h2></div>
          <div>'how it was made'</div>
        </div>
        <div className="TN-contents-divs">
          <h2>How To Help The Tavern</h2>
        </div>
        <div className="TN-contents-divs">
         <h2>Report A Problem or Bug</h2>
        </div>
        <div className="TN-contents-divs">
          <h2>Contact Tavern</h2>
        </div>
      </div>
    </div>
  ); 
};

export default TavernNews;