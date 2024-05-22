import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const GuildPages = ({UserData, setUserData, clickedGuild, setclickedGuild}) => {
  const [socket, setSocket] = useState(null);
  const [AllMembers, setAllMembers] = useState(null);
  const [RequestedMembers, setRequestedMembers] = useState(null);
  const [clickedMember, setclickedMember] = useState(null);
  const [GuildRequestCount, setGuildRequestCount] = useState('0')
  const [ShowGuildStats, setShowGuildStats] = useState(false);
  const [ShowGuildJoinRequest, setShowGuildJoinRequest] = useState(false);
  const [ShowBanReasonInput, setShowBanReasonInput] = useState(false);
  const [BaninputValue, setBanInputValue] = useState('');
  const containerRef = useRef(null);


  const handleBanInputChange = (event) => {
    setBanInputValue(event.target.value);
  };
  // Function to handle mouse wheel scroll
  const handleScroll = (e) => {
    const container = containerRef.current;
    container.scrollTop += e.deltaY;
  };

  // Function to handle touch events (swipe)
  let touchStartY = 0;
  const handleTouchStart = (e) => {
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const container = containerRef.current;
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - touchStartY;
    container.scrollTop += deltaY * 2; // Adjust the scrolling speed as needed
    touchStartY = touchY;
  };

  const toggleTooltip = (memberId) => {
    setclickedMember(clickedMember === memberId ? null : memberId);
    setShowBanReasonInput(false)
    setBanInputValue('')
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
  const fetchRequestToJoinMembers = async () => {
    try {
      const response = await fetch(`http://localhost:5000/Guilds/ReqToJoinTavelers/${clickedGuild.id || clickedGuild._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      const travelersData = await response.json();
      console.log(travelersData)
      setRequestedMembers(travelersData.traveler);
    } catch (error) {
      console.error('Error fetching all guilds:', error);
    }
  };
  useEffect(() => {
     // Establish Socket connection
     const socket = io('http://localhost:5000');
     setSocket(socket)
    // make a socket for notifs
    const guildId = clickedGuild.id || clickedGuild._id
     socket.on('connect', () => {
       console.log('connected');
     });
     socket.emit('joinGuildRoom', guildId);
     // Clean up socket connection when component unmounts
    fetchGuildMembers();
    fetchRequestToJoinMembers()
    setGuildRequestCount(clickedGuild.guildJoinRequest.length)
    return () => {
      socket.disconnect();
    };
  }, []); 
  useEffect(() => {
    if (socket) {
      socket.on('memberUpdates', (guildMembersWithElders) => {
        console.log('got new member')
        setAllMembers(guildMembersWithElders);
      });
      socket.on('guildReqUpdates', (updatedGuild, joinRequestCount, ReqToJoinTavelers) => {
        console.log('got new request update')
        setclickedGuild(updatedGuild)
        setGuildRequestCount(joinRequestCount)
        setRequestedMembers(ReqToJoinTavelers)
      });
    }
  
    // Clean up event listener when component unmounts
    return () => {
      if (socket) {
        socket.off('promote-update');
        socket.off('guildReqUpdates');
      }
    };
  }, [AllMembers]);
  console.log(clickedGuild)

  const PromoteToElder = (TravelerId) => {
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id;
      console.log('sending emit');
      socket.emit('update-to-elder', GuildId, TravelerId)
    }
  };
  const DemoteToMember = (TravelerId) => {
    // check if this works pls
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id
      console.log('sending emit')
      socket.emit('demote-to-member', GuildId, TravelerId );
    }
  }
  
  const HandleBanMember = (TravelerId, ) => {
    setShowBanReasonInput(true)
  }

  const BanMember = (TravelerId, Reason) => {
    // check if this works pls
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id
      console.log('sending emit')
      socket.emit('Ban-member', GuildId, TravelerId, Reason );
    }
  }

  const AcceptJoinRequest = (TravelerId) => {
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id
      console.log('sending emit')
      socket.emit('New-member-Accepted', GuildId, TravelerId );
    }
  }

  const DeclineJoinRequest = (TravelerId) => {
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id
      console.log('sending emit')
      socket.emit('New-member-Declined', GuildId, TravelerId );
    }
  }

  const handleViewGuildStats = () => {
    setShowGuildStats(!ShowGuildStats)
  }
  const handleManageJoinReq = () => {
    setShowGuildJoinRequest(!ShowGuildJoinRequest)
  }
  
  return (
    <div className='Guild-Pages-main-div'>
      <div className="Guild-Pages-left-side">
        <div className="GP-left-side-2nd" >
          <p style={{width: '96%', paddingLeft: '2%'}} className="GP-guild-moto">{clickedGuild.guildMoto}</p>
        </div>
          {AllMembers && (
            <div className="members-div"
            ref={containerRef}
            onWheel={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            style={{width: '98%'}}>
              <h2 style={{cursor: 'pointer'}} onClick={() => toggleTooltip(AllMembers.Owner.id)}>{AllMembers.Owner.UserName} <span style={{fontSize: '14px', fontWeight: '400'}}>Owner</span></h2>
              {UserData.username !== AllMembers.Owner.UserName && (
                <div className="guild-Owner-tooltip" style={{ display: clickedMember === AllMembers.Owner.id ? 'block' : 'none' }}>
                  <Link to={`/user/${AllMembers.Owner.UserName}`}><div>View {AllMembers.Owner.UserName}'s Profile</div></Link> 
                </div>
              )}
              <hr/>
              <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                {AllMembers.Elders
                .filter(elders => elders.AccPrivate === false) 
                .map((elder) => (
                  <div>
                    <h2 style={{cursor: 'pointer'}} onClick={() => toggleTooltip(elder.id)}>{elder.UserName } <span style={{fontSize: '14px', fontWeight: '400'}}>Elder</span></h2>
                    {UserData.username !== elder.UserName && (
                      <div className="guild-member-tooltip" style={{ display: clickedMember === elder.id ? 'block' : 'none' }}>
                      <Link to={`/user/${elder.UserName}`}><div>View {elder.UserName}'s Profile</div></Link>
                        {UserData.username === AllMembers.Owner.UserName && (
                          <div style={{cursor: 'pointer'}} onClick={() => {DemoteToMember(elder.id || elder._id)}}>Demote to Member</div>
                        )}
                        <hr style={{margin: '3px'}}/>
                        {UserData.username === AllMembers.Owner.UserName  && (
                          <div style={{cursor: 'pointer'}} onClick={() => {HandleBanMember(elder.id || elder._id)}}>Ban From Guild</div>
                        )}
                        { ShowBanReasonInput && (<div className="guild-ban-tooltip" style={{ display: clickedMember === elder.id ? 'block' : 'none' }}>
                          <div>Reason For Ban: </div>
                          <input
                            type="text"
                            value={BaninputValue}
                            onChange={handleBanInputChange}
                          />
                          <button onClick={() => {BanMember(elder.id || elder._id, BaninputValue )}}>Confirm Ban</button>
                        </div>)}
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
                        <div style={{cursor: 'pointer'}} onClick={() => {PromoteToElder(member.id || member._id)}}>Promote to Elder</div>
                      )}
                      <hr style={{margin: '3px'}}/>
                      {(UserData.username === AllMembers.Owner.UserName || AllMembers.Elders.some(elder => elder.UserName === UserData.username)) && (
                        <div style={{cursor: 'pointer'}} onClick={() => {HandleBanMember(member.id || member._id)}}>Ban From Guild</div>
                      )}
                      { ShowBanReasonInput && (<div className="guild-ban-tooltip" style={{ display: clickedMember === member.id ? 'block' : 'none' }}>
                        <div>Reason For Ban: </div>
                        <input
                          type="text"
                          value={BaninputValue}
                          onChange={handleBanInputChange}
                        />
                        <button onClick={() => {BanMember(member.id || member._id, BaninputValue )}}>Confirm Ban</button>
                      </div>)}
                    </div>
                  )}
                </div>
              ))}
              </div>
            </div>
          )}
        <div> 
      </div>
      </div>
      <div className="Guild-Pages-middle-side">
        <p style={{fontSize: '42px', paddingLeft: '10px', color: 'white', zIndex: '1000'}} className="medievalsharp-regular">{clickedGuild.guildName}</p>
        {
         /*this will have Guild Name, main post and feed  */
        }
        <div style={{bottom: '1%', left: '21%', position: 'absolute'}}>Make A post</div>
      </div>
      <div className="Guild-Pages-right-side">
        <h1 style={{marginTop: '108px'}}>Configuration</h1>
        {/* for owner */}
        {AllMembers && UserData.username === AllMembers.Owner.UserName && (
          <div className="guild-rightside-div">
            <h2 onClick={handleViewGuildStats} style={{cursor: 'pointer'}}>View Guild Stats</h2>
            <h2 onClick={handleManageJoinReq}>Manage Guild Join request <span className="guild-req-counter">{GuildRequestCount}</span></h2>
            <h2>Send A Guild Alert</h2>
            <h2>Manage Guild</h2>
            <h2 className="guild-settings">Guild Settings</h2>
          </div>
        )}
        {/* for elders */}
        {AllMembers && AllMembers.Elders.some(elder => elder.UserName === UserData.username) && (
          <div className="guild-rightside-div">
            <h2 onClick={handleViewGuildStats} style={{cursor: 'pointer'}}>View Guild Stats</h2>
            <h2 onClick={handleManageJoinReq}>Manage Guild Join request <span className="guild-req-counter">{GuildRequestCount}</span></h2>
            <h2>Send a message up to Guild Master</h2>
            <h2 className="guild-settings">Guild Settings</h2>
          </div>
        )}
        {/* for members */}
        {AllMembers && AllMembers.Members.some(Member => Member.UserName === UserData.username) && (
          <div className="guild-rightside-div">
            <h2 onClick={handleViewGuildStats} style={{cursor: 'pointer'}}>View Guild Stats</h2>
            <h2 className="guild-settings">Guild Settings</h2>
          </div>
        )}
        {
         /*this will have guild settings depending on role in guild
         owner has all power/ elders can  ban / all users have option to Make Post,
         guild settings send message to elders,  leave guild,  */
        }
      </div>
      {ShowGuildStats && (
        <div className="Guild-stats-popup">
          <div><h2>{clickedGuild.guildName}</h2></div>
          <div>Guild Privacy: {clickedGuild.Findable ? 'Findable' : 'Private'}</div>
          <div>Request To Join: {clickedGuild.RequestToJoin ? 'Yes' : 'No'}</div>
          <div>Owner: {AllMembers.Owner.UserName}</div>
          <div>Guild Color: {clickedGuild.guildColor}</div>
          <div>Guild Creation Date: {clickedGuild.guildDate ? clickedGuild.guildDate.substring(0, 10) : ''}</div>
          <div> # of Members: {clickedGuild.joinedTravelers.length + clickedGuild.guildElders.length}</div>
          <div># of Post: {clickedGuild.guildPost.length}</div>
          <div># of Banned Travelers: {clickedGuild.bannedTravelers.length}</div>
          <div style={{alignSelf: 'center', cursor: 'pointer'}} onClick={handleViewGuildStats}>Finish</div>
        </div>
      )}
      {ShowGuildJoinRequest && (
        <div className="Guild-Request-popup">
          {clickedGuild.RequestToJoin ? (
            <div>
              <div style={{marginBottom: '10px'}}>You currently have {clickedGuild.guildJoinRequest.length} join request.</div>
              {clickedGuild.guildJoinRequest.length !== 0 && (
                <div>
                  {RequestedMembers.map((traveler, index) => ( // Added parentheses and index parameter
                    <div className="ReqMember-item" key={index}> {/* Added key for each mapped element */}
                      <div>
                        {traveler.UserName}
                        {traveler.AccPrivate ? (
                          <div>This Account is Private</div>
                        ) : (
                          <Link to={`/user/${traveler.UserName}`}>
                            <div>View Profile</div>
                          </Link>
                        )}
                      </div>
                      <div style={{display: 'flex', flexDirection: 'column', gap:'10px'}}>
                        <div onClick={() => {AcceptJoinRequest(traveler.id || traveler._id)}}>Accept Request</div>
                        <div onClick={() => {DeclineJoinRequest(traveler.id || traveler._id)}}>Decline Request</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p>Your guild is currently open for all to join. To change this, go to guild settings.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GuildPages;