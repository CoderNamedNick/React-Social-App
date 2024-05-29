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
  const [ShowGuildGuidelines, setShowGuildGuidelines] = useState(false)
  const [ShowGuildGuidelines2, setShowGuildGuidelines2] = useState(false)
  const [BaninputValue, setBanInputValue] = useState('');
  const [GuidelinesinputValue, setGuidelinesinputValue] = useState('');
  const [ShowGuildSettings, setShowGuildSettings] = useState(false)
  const [ShowChangeGuildFeatures, setShowChangeGuildFeatures] = useState(false)
  const [ShowEditGuildFeatures, setShowEditGuildFeatures] = useState(false)
  const [ShowGuildReportUser, setShowGuildReportUser] = useState(false)
  const [guildData, setGuildData] = useState({
    guildMoto: clickedGuild.guildMoto,
    bio: clickedGuild.bio,
    RequestToJoin: clickedGuild.RequestToJoin,
    Findable: clickedGuild.Findable,
    guildColor: clickedGuild.guildColor,
  });
  const containerRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGuildData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const guildId = clickedGuild.id || clickedGuild._id; // Assuming guild ID is stored in clickedGuild._id
    try {
      const response = await fetch(`http://localhost:5000/Guilds/id/${guildId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guildData),
      });

      if (!response.ok) {
        throw new Error('Failed to update guild');
      }

      const updatedGuild = await response.json();
      console.log('Updated Guild:', updatedGuild);
      if (socket) {
        socket.emit('update-all-guild', guildId);
      }

      handleChangeFeatures(); // Close the edit form
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const colors = [
    { name: 'blue', color1: '#B5BAE1', color2: '#0F2180' },
    { name: 'green', color1: '#9FE5A6', color2: '#0F6617' },
    { name: 'red', color1: '#C26D6D', color2: '#A70909' },
    { name: 'purple', color1: '#D8B4D9', color2: '#78096F' },
    { name: 'yellow', color1: '#F9F1C7', color2: '#F6D936' },
    { name: 'orange', color1: '#F6AF75', color2: '#EA6A00' },
    { name: 'grey', color1: '#D3D3D3', color2: '#4D4545' },
  ];

  const getGuildColors = (guildColor) => {
    const selectedColorData = colors.find(color => color.name === guildColor);
    return selectedColorData ? `linear-gradient(to top, ${selectedColorData.color1}, ${selectedColorData.color2})` : '';
  };


  const handleBanInputChange = (event) => {
    setBanInputValue(event.target.value);
  };
  const handleGuidelinesInputChange = (event) => {
    setGuidelinesinputValue(event.target.value);
  }
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
      socket.on('Guild-Settings-updates', (updatedGuild) => {
        console.log('got new guild update')
        setclickedGuild(updatedGuild)
      });
      socket.on('guild-update', (updatedGuild) => {
        console.log('got new guild update')
        setclickedGuild(updatedGuild)
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

  const ChangeGuidelines = (NewGuidelines) => {
    // check if this works pls
    if (socket) {
      const GuildId = clickedGuild.id || clickedGuild._id
      console.log('sending emit')
      socket.emit('Guidelines-updated', GuildId, NewGuidelines);
    }
    setShowGuildGuidelines(false)
    setShowGuildGuidelines2(false)
    setGuidelinesinputValue("")
  }

  const handleViewGuildStats = () => {
    setShowGuildStats(!ShowGuildStats)
  }
  const handleManageJoinReq = () => {
    setShowGuildJoinRequest(!ShowGuildJoinRequest)
  }
  const handleGuildSettings = () => {
    setShowGuildSettings(!ShowGuildSettings)
  }
  const handleGuildGuidelines = () => {
    setShowGuildGuidelines(!ShowGuildGuidelines)
  }
  const handleGuildGuidelines2 = () => {
    setShowGuildGuidelines2(!ShowGuildGuidelines2)
  }
  const handleChangeFeatures= () => {
    setShowChangeGuildFeatures(!ShowChangeGuildFeatures)
  }
  const handleEditFeatures= () => {
    setShowEditGuildFeatures(!ShowEditGuildFeatures)
  }
  const handleReportAUser= () => {
    setShowGuildReportUser(!ShowGuildReportUser)
  }
  
  return (
    <div style={{background: getGuildColors(clickedGuild.guildColor)}} className='Guild-Pages-main-div'>
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
                .map((elder) => (
                  <div>
                    <h2 style={{cursor: 'pointer'}} onClick={() => toggleTooltip(elder.id)}>{elder.UserName } <span style={{fontSize: '14px', fontWeight: '400'}}>Elder</span></h2>
                    {UserData.username !== elder.UserName && (
                      <div className="guild-member-tooltip" style={{ display: clickedMember === elder.id ? 'block' : 'none' }}>
                      {!elder.AccPrivate && (<Link to={`/user/${elder.UserName}`}><div>View {elder.UserName}'s Profile</div></Link>)}
                      {elder.AccPrivate && (<div>{elder.UserName}'s Profile Is Private</div>)}
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
              .map((member) => (
                <div key={member.id}>
                  <h2 style={{cursor: 'pointer'}} onClick={() => toggleTooltip(member.id)}>
                    {member.UserName} <span style={{fontSize: '14px', fontWeight: '400'}}>Member</span>
                  </h2>
                  {UserData.username !== member.UserName && (
                    <div className="guild-member-tooltip" style={{ display: clickedMember === member.id ? 'block' : 'none' }}>
                      {!member.AccPrivate && (<Link to={`/user/${member.UserName}`}><div>View {member.UserName}'s Profile</div></Link>)}
                      {member.AccPrivate && (<div>{member.UserName}'s Profile Is Private</div>)}
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
        <p style={{fontSize: '42px', paddingLeft: '10px', color: 'white'}} className="medievalsharp-regular">{clickedGuild.guildName}</p>
        {
         /*this will have Guild Name, main post and feed  */
        }
        <div style={{bottom: '1%', left: '21%', position: 'absolute'}}>Make A post</div>
      </div>
      <div className="Guild-Pages-right-side">
        <h4 style={{marginTop: '108px'}}>Configuration</h4>
        {/* for owner */}
        {AllMembers && UserData.username === AllMembers.Owner.UserName && (
          <div className="guild-rightside-div">
            <h2 onClick={handleViewGuildStats} style={{cursor: 'pointer'}}>View Guild Stats</h2>
            <h2 onClick={handleManageJoinReq} style={{cursor: 'pointer'}}>Manage Guild Join request <span className="guild-req-counter">{GuildRequestCount}</span></h2>
            <h2>Send A Guild Alert</h2>
            <h2>View Elder messages</h2>
            <h2 className="guild-settings" onClick={handleGuildSettings}>Guild Settings</h2>
          </div>
        )}
        {/* for elders */}
        {AllMembers && AllMembers.Elders.some(elder => elder.UserName === UserData.username) && (
          <div className="guild-rightside-div">
            <h2 onClick={handleViewGuildStats} style={{cursor: 'pointer'}}>View Guild Stats</h2>
            <h2 onClick={handleManageJoinReq} style={{cursor: 'pointer'}}>Manage Guild Join request <span className="guild-req-counter">{GuildRequestCount}</span></h2>
            <h2>Send a message up to Guild Master</h2>
            <h2 className="guild-settings" onClick={handleGuildSettings}>Guild Settings</h2>
          </div>
        )}
        {/* for members */}
        {AllMembers && AllMembers.Members.some(Member => Member.UserName === UserData.username) && (
          <div className="guild-rightside-div">
            <h2 onClick={handleViewGuildStats} style={{cursor: 'pointer'}}>View Guild Stats</h2>
            <h2>View Warnings</h2>
            <h2 className="guild-settings" onClick={handleGuildSettings}>Guild Settings</h2>
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
              <div style={{marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
                <p>You currently have {clickedGuild.guildJoinRequest.length} join request.</p>
                <p style={{position: 'absolute', bottom: '0', cursor: 'pointer'}} onClick={handleManageJoinReq}>Finish</p>
              </div>
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
                        <div style={{cursor: 'pointer'}} onClick={() => {AcceptJoinRequest(traveler.id || traveler._id)}}>Accept Request</div>
                        <div style={{cursor: 'pointer'}} onClick={() => {DeclineJoinRequest(traveler.id || traveler._id)}}>Decline Request</div>
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
      {ShowGuildSettings && (
        <div className="guild-settings-div">
          {AllMembers && AllMembers.Members.some(Member => Member.UserName === UserData.username) && (
            <div className="guild-settings-popup">
              <div onClick={handleGuildSettings} style={{alignSelf: 'flex-start', cursor: 'pointer'}}>Finish</div>
              <div className="guild-settings-popup-item" onClick={handleGuildGuidelines}>View Guild guidelines</div>
              <div className="guild-settings-popup-item" onClick={handleReportAUser}>Report A Guild User</div>
              <div className="guild-settings-popup-item">Veiw Any Warnings</div>
              <div className="guild-settings-popup-item">Report Guild</div>
              <div className="guild-settings-popup-item">Retire From Guild</div>
            </div>
          )}
          {AllMembers && AllMembers.Elders.some(elder => elder.UserName === UserData.username) && (
            <div className="guild-settings-popup">
              <div onClick={handleGuildSettings} style={{alignSelf: 'flex-start', cursor: 'pointer'}}>Finish</div>
              <div className="guild-settings-popup-item" onClick={handleGuildGuidelines}>View Guild guidelines</div>
              <div className="guild-settings-popup-item"onClick={handleReportAUser}>Report A Guild User</div>
              <div className="guild-settings-popup-item">Report Guild</div>
              <div className="guild-settings-popup-item">Demote Self</div>
              <div className="guild-settings-popup-item">See Report List</div>
              <div className="guild-settings-popup-item">Give User a Warning</div>
              <div className="guild-settings-popup-item">Veiw Any Warnings</div>
            </div>
          )}
          {AllMembers && UserData.username === AllMembers.Owner.UserName && (
            <div className="guild-settings-popup">
              <div onClick={handleGuildSettings} style={{alignSelf: 'flex-start', cursor: 'pointer'}}>Finish</div>
              <div className="guild-settings-popup-item" onClick={handleGuildGuidelines}>Manage Guild guidelines</div>
              <div className="guild-settings-popup-item" onClick={handleChangeFeatures}>Change Guild Features</div>
              <div className="guild-settings-popup-item">See Report List</div>
              <div className="guild-settings-popup-item">Give User a Warning</div>
              <div className="guild-settings-popup-item">Manage Banned Travelers</div>
              <div className="guild-settings-popup-item">Give Up OwnerShip</div>
              <div className="guild-settings-popup-item">Disband Guild</div>
            </div>
          )}
        </div>
      )}
      {ShowGuildGuidelines && (
        <div className="guild-guidelines-popup-main">
          <h2>Guild Guidelines</h2>
          <p style={{textAlign: 'center'}}>Guild Guidelines are unique to each guild to make the guild a welcoming and safe place.</p>
          {AllMembers && UserData.username !== AllMembers.Owner.UserName && (
            <div className="guild-Guideline-popup">
              {clickedGuild.guildGuidelines === "" && (
                <div>
                  Your guild leader has not yet set up guidelines for the Guild.
                  Please come back when he has to check the newest updated guidelines!
                </div>
              )}
              {clickedGuild.guildGuidelines !== "" && (
                <div>
                  {clickedGuild.guildGuidelines}
                </div>
              )}
              <h2 onClick={handleGuildGuidelines} >Acknowledge guidelines</h2>
            </div>
          )}
          {AllMembers && UserData.username === AllMembers.Owner.UserName && (
            <div className="guild-Guideline-popup">
              {clickedGuild.guildGuidelines === "" && (
                <div>
                  <p>There Are No guidelines to follow. As Guild Leader please make Guild Lines For your members to follow</p>
                  <textarea
                    style={{width: '95%', height: '195px', resize: 'none', fontSize: '20px', fontWeight: '600' }}
                    value={GuidelinesinputValue}
                    onChange={handleGuidelinesInputChange}
                  />
                  <h2 onClick={() => {ChangeGuidelines(GuidelinesinputValue)}}>Save and Exit?</h2>
                </div>
              )}
              {clickedGuild.guildGuidelines !== "" && (
                <div>
                  {!ShowGuildGuidelines2 && (
                    <div>
                      <p>These Are the Current Guidelines</p>
                      <br></br>
                      {clickedGuild.guildGuidelines}
                      <br/>
                      <br/>
                      <br/>
                      Whould you Like to change them??
                      <h2><span style={{paddingRight: '60%', cursor: 'pointer'}} onClick={handleGuildGuidelines2}>Yes</span>       <span style={{cursor: 'pointer'}}  onClick={handleGuildGuidelines}>No</span></h2>
                    </div>
                  )}
                  {ShowGuildGuidelines2 && (
                    <div>
                    <textarea
                      style={{width: '95%', height: '195px', resize: 'none', fontSize: '20px', fontWeight: '600' }}
                      value={GuidelinesinputValue}
                      onChange={handleGuidelinesInputChange}
                    />
                    <h2 onClick={() => {ChangeGuidelines(GuidelinesinputValue)}}>Save and Exit?</h2>
                  </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {ShowChangeGuildFeatures && (
        <div>
          {!ShowEditGuildFeatures && (
            <div className="guild-features-popup-main">
              <h2 style={{textAlign: 'center'}}>Guild Features</h2>
              <div>Guild Moto: {clickedGuild.guildMoto}</div>
              <div>Guild bio: {clickedGuild.bio}</div>
              <div>{clickedGuild.RequestToJoin ? 'Request To Join' : 'Open For all'}</div>
              <div>Findable: {clickedGuild.Findable ? 'Findable' : 'Hidden'}</div>
              <div>Guild Color: {clickedGuild.guildColor}</div>
              <h3 className="guild-settings" onClick={handleEditFeatures}>Edit Features</h3>
              <h3 onClick={handleChangeFeatures} style={{position: 'absolute', bottom: '0', right: '10px', cursor: 'pointer'}}>Finish</h3>
            </div>
          )}
          {ShowEditGuildFeatures && (
            <div className="guild-features-popup-main">
            <h2 style={{ textAlign: 'center' }}>Edit Guild Features</h2>
            <form onSubmit={handleSubmit}>
              <div className="guild-features-form-divs">
                <label>Guild Moto: </label>
                <input
                  maxLength={45}
                  type="text"
                  name="guildMoto"
                  value={guildData.guildMoto}
                  onChange={handleChange}
                />
              </div>
              <div className="guild-features-form-divs">
                <label>Guild bio: </label>
                <textarea
                  maxLength={165}
                  name="bio"
                  value={guildData.bio}
                  onChange={handleChange}
                  style={{resize: 'none', height: '60px', width: '60%'}}
                />
              </div>
              <div className="guild-features-form-divs">
                <label>
                  <input
                    type="checkbox"
                    name="RequestToJoin"
                    checked={guildData.RequestToJoin}
                    onChange={handleChange}
                  />
                   Request To Join
                </label>
              </div>
              <div className="guild-features-form-divs">
                <label>
                  <input
                    type="checkbox"
                    name="Findable"
                    checked={guildData.Findable}
                    onChange={handleChange}
                  />
                   Findable
                </label>
              </div>
              <div className="guild-features-form-divs">
                <label>Guild Color: </label>
                <select
                  name="guildColor"
                  value={guildData.guildColor}
                  onChange={handleChange}
                >
                  <option value="blue">Blue</option>
                  <option value="red">Red</option>
                  <option value="orange">Orange</option>
                  <option value="yellow">Yellow</option>
                  <option value="grey">Grey</option>
                  <option value="purple">Purple</option>
                  <option value="green">Green</option>
                </select>
              </div>
              <button className="guild-features-form-submit-btn" type="submit">Finish</button>
              <h2 onClick={handleEditFeatures} style={{ position: 'absolute', bottom: '0', left: '10px', cursor: 'pointer' }}>leave</h2>
            </form>
          </div>
          )}
        </div>
      )}
      {ShowGuildReportUser && (
        <div className="guild-Report-A-User-popup-main">
        <h2>Report A Guild User</h2>
        <p>Who is the User you are reporting in the guild?</p>
        <div style={{overflowY: 'auto', maxHeight: '55%', border: 'white solid 3px', paddingLeft: '20px', paddingRight: '20px'}}>
          <h3>Elders</h3>
          <div className="Report-A-User-grid-container">
            {AllMembers.Elders.map((elder) => (
              <div className="Report-A-User-grid-item" key={elder.UserName}>
                <div>{elder.UserName}</div>
                <div>Elder</div>
              </div>
            ))}
          </div>
          <h3>Members</h3>
          <div className="Report-A-User-grid-container">
            {AllMembers.Members.map((member) => (
              <div className="Report-A-User-grid-item" key={member.UserName}>
                <div>{member.UserName}</div>
                <div>Member</div>
              </div>
            ))}
          </div>
        </div>
        <h3 style={{ position: 'absolute', bottom: '0', left: '10px', cursor: 'pointer' }} onClick={handleReportAUser}>Finish</h3>
      </div>
      )}
    </div>
  );
};

export default GuildPages;