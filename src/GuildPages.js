import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const GuildPages = ({UserData, setUserData, clickedGuild, setclikedGuild}) => {
  const [AllMembers, setAllMembers] = useState(null);
  const [clickedMember, setclickedMember] = useState(null);

  const toggleTooltip = (memberId) => {
    setclickedMember(clickedMember === memberId ? null : memberId);
  };
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
              <h2>{AllMembers.Owner.UserName} <span style={{fontSize: '14px', fontWeight: '400'}}>Owner</span></h2>
              <hr/>
              <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                {AllMembers.Elders
                .filter(elders => elders.AccPrivate === true) 
                .map((elder) => (
                  <div>
                    <h2>{elder.UserName}<span style={{fontSize: '14px', fontWeight: '400'}}>Elder</span></h2>
                  </div>
                ))}
              </div>
              {AllMembers.Elders.length !== 0 && (<hr/>)}
              <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
              {AllMembers.Members
              .filter(member => member.AccPrivate === false) 
              .map((member) => (
                <div key={member.id}>
                  <h2 style={{cursor: 'pointer'}} onClick={() => toggleTooltip(member.id)}>
                    {member.UserName} <span style={{fontSize: '14px', fontWeight: '400'}}>Member</span>
                  </h2>
                  <div className="guild-member-tooltip" style={{ display: clickedMember === member.id ? 'block' : 'none' }}>
                    <div>View {member.UserName}'s Profile</div>
                    {UserData.username === AllMembers.Owner.UserName && (
                      <div>Promote to Elder</div>
                    )}
                    <hr style={{margin: '3px'}}/>
                    {(UserData.username === AllMembers.Owner.UserName || AllMembers.Elders.includes(UserData.username)) && (
                      <div>Ban From Guild</div>
                    )}
                  </div>
                </div>
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