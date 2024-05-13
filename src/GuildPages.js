import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const GuildPages = ({UserData, setUserData, clickedGuild, setclikedGuild}) => {
  const [socket, setSocket] = useState(null);
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

  const fetchGuildMembers = async () => {
    try {
      const response = await fetch(`http://localhost:5000/Guilds/JoinedTravelers/${clickedGuild.id || clickedGuild._id}`);
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
  useEffect(() => {
     // Establish Socket connection
     const socket = io('http://localhost:5000');
     setSocket(socket)
    // make a socket for notifs
     socket.on('connect', () => {
       console.log('connected');
     });
    
     // Clean up socket connection when component unmounts
    fetchGuildMembers();
    return () => {
      socket.disconnect();
    };
  }, []); 
  useEffect(() => {
    if (socket) {
      socket.on('promote-update', (updatedGuild, guildMembersWithElders) => {
        setAllMembers(guildMembersWithElders);
      });
    }
  
    // Clean up event listener when component unmounts
    return () => {
      if (socket) {
        socket.off('promote-update');
      }
    };
  }, [AllMembers]);
  console.log(clickedGuild)

  const PromoteToElder = (TravelerId) => {
    // check if this works pls
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id
      socket.emit('update-to-elder', GuildId, TravelerId)
    }
  }
  
  return (
    <div className='Guild-Pages-main-div'>
      <div className="Guild-Pages-left-side">
        <div className="GP-left-side-2nd" >
          <p style={{fontSize: '40px'}} className="medievalsharp-regular">{clickedGuild.guildName}</p>
          <p className="GP-guild-moto">{clickedGuild.guildMoto}</p>
        </div>
          {AllMembers && (
            <div style={{width: '98%'}}>
              <h2 style={{cursor: 'pointer'}} onClick={() => toggleTooltip(AllMembers.Owner.id)}>{AllMembers.Owner.UserName} <span style={{fontSize: '14px', fontWeight: '400'}}>Owner</span></h2>
              {UserData.username !== AllMembers.Owner.UserName && (
                <div className="guild-Owner-tooltip" style={{ display: clickedMember === AllMembers.Owner.id ? 'block' : 'none' }}>
                  <Link to={`/user/${AllMembers.Owner.UserName}`}><div>View {AllMembers.Owner.UserName}'s Profile</div></Link> 
                </div>
              )}
              <hr/>
              <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                {AllMembers.Elders
                .filter(elders => elders.AccPrivate === true) 
                .map((elder) => (
                  <div>
                    <h2 style={{cursor: 'pointer'}} onClick={() => toggleTooltip(elder.id)}>{elder.UserName}<span style={{fontSize: '14px', fontWeight: '400'}}>Elder</span></h2>
                    {UserData.username !== elder.UserName && (
                      <div className="guild-elder-tooltip" style={{ display: clickedMember === elder.id ? 'block' : 'none' }}>
                      <Link to={`/user/${elder.UserName}`}><div>View {elder.UserName}'s Profile</div></Link>
                        {UserData.username === AllMembers.Owner.UserName && (
                          <div>Demote to Member</div>
                        )}
                        <hr style={{margin: '3px'}}/>
                        {UserData.username === AllMembers.Owner.UserName  && (
                          <div>Ban From Guild</div>
                        )}
                      </div>
                    )}
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
                  {UserData.username !== member.UserName && (
                    <div className="guild-member-tooltip" style={{ display: clickedMember === member.id ? 'block' : 'none' }}>
                      <Link to={`/user/${member.UserName}`}><div>View {member.UserName}'s Profile</div></Link>
                      {UserData.username === AllMembers.Owner.UserName && (
                        <div onClick={() => {PromoteToElder(member.id || member._id)}}>Promote to Elder</div>
                      )}
                      <hr style={{margin: '3px'}}/>
                      {(UserData.username === AllMembers.Owner.UserName || AllMembers.Elders.includes(UserData.username)) && (
                        <div>Ban From Guild</div>
                      )}
                    </div>
                  )}
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