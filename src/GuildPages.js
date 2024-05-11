import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const GuildPages = ({UserData, setUserData, clickedGuild, setclikedGuild}) => {
  // need sockets for post 
  //need socket for comments on post 
  //no need for sokcets for likes and dislikes
  // need original use effect fetch for guild data
  // need post functions with sockets
  
  return (
    <div className='Guild-Pages-main-div'>
      <h1>I AM GUILD PAGES</h1>
      <div className="Guild-Pages-left-side">
        {
         /*this will have Guild members/ elders/owner
         along with guildmoto   */
        }
      </div>
      <div className="Guild-Pages-middle-side">
        {
         /*this will have Guild Name, main post and feed  */
        }
      </div>
      <div className="Guild-Pages-right-side">
        {
         /*this will have guild settings depending on role in guild
         owner has all power/ elders can  ban / all users have option to Make Post,
         guild settings send message to elders,  leave guild,  */
        }
      </div>
     
    </div>
  );
};

export default GuildPages;