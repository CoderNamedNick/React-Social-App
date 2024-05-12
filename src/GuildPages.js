import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const GuildPages = ({UserData, setUserData, clickedGuild, setclikedGuild}) => {
  const [AllMembers, setAllMembers] = useState(null)
  // need sockets for post 
  //need socket for comments on post 
  //no need for sokcets for likes and dislikes
  // need original use effect fetch for guild data
  // need post functions with sockets

  useEffect(() => {
    const fetchGuildMembers = async () => {
      try {
        const response = await fetch(`http://localhost:5000/Guilds//JoinedTravelers/${clickedGuild.id || clickedGuild._id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        const MembersData = await response.json();
        console.log(MembersData)
        setAllMembers(MembersData);
      } catch (error) {
        console.error('Error fetching all guilds:', error);
      }
    };
    fetchGuildMembers();
  }, []); 
  console.log(clickedGuild)
  
  return (
    <div className='Guild-Pages-main-div'>
      <div className="Guild-Pages-left-side">
        <div className="GP-left-side-2nd" >
          <p style={{fontSize: '40px'}} className="medievalsharp-regular">{clickedGuild.guildName}</p>
          <p className="GP-guild-moto">{clickedGuild.guildMoto}</p>
        </div>
          {AllMembers && (
            <div style={{width: '98%'}}>
              <h2>Owner</h2>
              <h3>{AllMembers.Owner.UserName}</h3>
              <h2>Elders</h2>
              <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                {AllMembers.Elders
                .filter(elders => elders.AccPrivate === true) 
                .map((elder) => (
                  <div>
                    {elder.UserName}
                  </div>
                ))}
              </div>
              <h2>Members</h2>
              <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                {AllMembers.Members
                .filter(members => members.AccPrivate === false) 
                .map((member) => (
                  <h3>
                    {member.UserName}
                  </h3>
                ))}
              </div>
            </div>
          )}
        <div> 
      </div>
        {
         /*this will have Guild members/ elders/owner
         along with guildmoto   */
        }
      </div>
      <div className="Guild-Pages-middle-side">
        <h1 style={{marginTop: '108px'}}>I AM GUILD PAGES</h1>
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