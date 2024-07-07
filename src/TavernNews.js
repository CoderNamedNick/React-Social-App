import React, { useState, useEffect } from "react";
import returnArrow from './icons/left.png'




const TavernNews = ({ UserData, setUserData }) => {
  const [ShowUpdatesComingsSoon, setShowUpdatesComingsSoon] = useState(false);
  const [ShowBehindTheTavern, setShowBehindTheTavern] = useState(false);
  const [ShowHowToHelpTheTavern, setShowHowToHelpTheTavern] = useState(false);
  const [ShowReportAProblemorBug, setShowReportAProblemorBug] = useState(false);
  const [ShowContactTavern, setShowContactTavern] = useState(false);
  
  const returnArrowClick = () => {
    setShowUpdatesComingsSoon(false)
    setShowBehindTheTavern(false)
    setShowHowToHelpTheTavern(false)
    setShowReportAProblemorBug(false)
    setShowContactTavern(false)
  }

  return (
    <div className="Tavern-News-main-div">
      <h2>Hello And Welcome To Tavern News</h2>
      { !ShowUpdatesComingsSoon &&
        !ShowBehindTheTavern &&
        !ShowHowToHelpTheTavern &&
        !ShowReportAProblemorBug &&
        !ShowContactTavern && (
        <div style={{display:'flex', flexDirection: 'column', gap: '10px'}}>
          <div onClick={() => {setShowUpdatesComingsSoon(true)}} className="TN-contents-divs">
            <h2>Updates Comings Soon?</h2>
          </div>
          <div onClick={() => {setShowBehindTheTavern(true)}}  className="TN-contents-divs">
            <div><h2>Behind The Tavern</h2></div>
            <div>'how it was made'</div>
          </div>
          <div onClick={() => {setShowHowToHelpTheTavern(true)}}  className="TN-contents-divs">
            <h2>How To Help The Tavern</h2>
          </div>
          <div onClick={() => {setShowReportAProblemorBug(true)}}  className="TN-contents-divs">
          <h2>Report A Problem or Bug</h2>
          </div>
          <div onClick={() => {setShowContactTavern(true)}}  className="TN-contents-divs">
            <h2>Contact Tavern</h2>
          </div>
        </div>
      )}
      { ShowUpdatesComingsSoon && (
        <div className="TN-fixed-divs">
          <img className="TN-return-arrow" onClick={returnArrowClick} src={returnArrow}></img>
          <h2>Updates coming soon</h2>
          <div style={{width: '90%'}}><span style={{fontWeight: '600', fontSize: '32px'}}>Custom Profile Pictures / more exclusive Avatars: </span>
            I want people to have a better experience by having more ways to show who you are!
            so soon in a future update i want to have more avatars and more personality to your Profile Book.
          </div>
          <div style={{width: '90%'}}><span style={{fontWeight: '600', fontSize: '32px'}}>Post Images and other Files: </span>
            To have anything now without a photo to go with it is sad. Soon with help I can add way for the Tavern to have 
            photos and files be posted on the guild and also throught messages/parties!
          </div>
          <div style={{width: '90%'}}><span style={{fontWeight: '600', fontSize: '32px'}}>Bug Fixes And More: </span>
            With the offical release of Tavern there are ganna be many bugs and problems. I hope to notice them as fast as possible 
            and give everyone the best experience i can offer.
          </div>
          <div style={{width: '90%'}}><span style={{fontWeight: '600', fontSize: '32px'}}>Tavern App: </span>
            ???????
          </div>
        </div>
      )}
      { ShowBehindTheTavern && (
        <div className="TN-fixed-divs">
          <img className="TN-return-arrow" onClick={returnArrowClick} src={returnArrow}></img>
          <h2>How Tavern Was Made</h2>
          <div style={{width: '90%'}}>
            Tavern was at start exposed to be a porfolio project, but soon after working and connecting the pieces of Tavern I 
            enjoyed what it was becoming. Im a solo web developer and i wanted to make something unique and something that shows what I can do.
            As of Always Tavern is open to the public and is a repo on github where all can see. So if you want to see the code go here.
          </div>
        </div>
      )}
      { ShowHowToHelpTheTavern && (
        <div className="TN-fixed-divs">
          <img className="TN-return-arrow" onClick={returnArrowClick} src={returnArrow}></img>
          <h2>How To Help Tavern</h2>
          <div style={{width: '90%'}}>
            Tavern Is free to enjoy and always will be free! I want Tavern to welcome all. If you truly want to help the Tavern Grow and 
            be more amazing. make sure to click an Ad every now and then or better yet. contact me and tell me how you want to help, But 
            I stongly say that everyone can enjoy Tavern no matter what!
          </div>
        </div>
      )}
      { ShowReportAProblemorBug && (
        <div className="TN-fixed-divs">
          <img className="TN-return-arrow" onClick={returnArrowClick} src={returnArrow}></img>
          <h2>Ohh No! </h2>
          <div style={{width: '90%'}}>
            Tavern Is still a work in progress. if you do find a problem please reach out to me thu email. and i will try to fix it in short time.
            in the email please try to give me relevant info of what happen. And it you tried To break the website.... Please Dont!
            <br></br>
            <br></br>
            <h3>Email: tavern.cool.email@gmail.com</h3>
          </div>
        </div>
      )}
      { ShowContactTavern && (
        <div className="TN-fixed-divs">
          <img className="TN-return-arrow" onClick={returnArrowClick} src={returnArrow}></img>
          <h2>I love feedback!</h2>
          <div style={{width: '90%'}}>
            <h3>Email: tavern.cool.email@gmail.com</h3>
            <br></br>
            <h3>The Creator's X 'twitter': <a>https://x.com/CoderNamedNick</a></h3>
          </div>
        </div>
      )}
    </div>
  ); 
};

export default TavernNews;