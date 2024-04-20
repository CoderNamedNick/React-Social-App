import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const JoinAGuild = ({ UserData, setUserData }) => {
  const [AllGuilds, setAllGuilds] = useState([]);
  const [expandedGuild, setExpandedGuild] = useState(null);
  const [joinedGuilds, setJoinedGuilds] = useState([]);
  const [requestedGuilds, setRequestedGuilds] = useState([]);

  const colors = [
    { name: 'blue', color1: '#F5F6FC', color2: '#0F2180' },
    { name: 'green', color1: '#9FE5A6', color2: '#0F6617' },
    { name: 'red', color1: '#C26D6D', color2: '#A70909' },
    { name: 'purple', color1: '#D8B4D9', color2: '#78096F' },
    { name: 'yellow', color1: '#F9F1C7', color2: '#F6D936' },
    { name: 'orange', color1: '#F6AF75', color2: '#EA6A00' },
    { name: 'grey', color1: '#D3D3D3', color2: '#4D4545' },
  ];

  useEffect(() => {
    const fetchAllGuilds = async () => {
      try {
        const response = await fetch('http://localhost:5000/Guilds');
        if (!response.ok) {
          throw new Error('Failed to fetch Guilds');
        }
        const allGuildsData = await response.json();
        setAllGuilds(allGuildsData);
      } catch (error) {
        console.error('Error fetching all guilds:', error);
      }
    };
    fetchAllGuilds();
  }, []);

  useEffect(() => {
    // Assuming UserData.guildsJoined is an array of joined guild IDs
    setJoinedGuilds(UserData.guildsJoined || []);
  }, [UserData]);

  useEffect(() => {
    // Assuming UserData.requestedGuilds is an array of guild IDs to which the user has sent join requests
    setRequestedGuilds(UserData.requestedGuilds || []);
  }, [UserData]);

  const getGuildColors = (guildColor) => {
    const selectedColorData = colors.find(color => color.name === guildColor);
    return selectedColorData ? `linear-gradient(to top, ${selectedColorData.color1}, ${selectedColorData.color2})` : '';
  };

  const handleGuildBioClick = (guildId) => {
    setExpandedGuild(expandedGuild === guildId ? null : guildId);
  };

  const handleRequestToJoinClick = async (guildId) => {
    try {
      const response = await fetch(`http://localhost:5000/Guilds/${guildId}/Join-Request`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          TravelerId: UserData.id || UserData._id, // Assuming UserData has the traveler's ID
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send join request');
      }
      const data = await response.json(); // assuming the response includes both user and guild data
  
      // Update UserData with the user data from the response
      setUserData(data.user);
      console.log('Join request sent successfully');
      // Optionally, you can update the UI or state to reflect the request sent
      setRequestedGuilds([...requestedGuilds, guildId]); // Update the list of requested guilds
    } catch (error) {
      console.error('Error sending join request:', error);
      // Handle error: display error message to user or retry request
    }
  };
  console.log(requestedGuilds)

  const handleJoinGuildClick = async (guildId) => {
    try {
      const response = await fetch(`http://localhost:5000/Guilds/${guildId}/Join`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          TravelerId: UserData.id || UserData._id, // Assuming UserData has the traveler's ID
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send join request');
      }
      const data = await response.json(); // assuming the response includes both user and guild data
  
      // Update UserData with the user data from the response
      setUserData(data.user);
      console.log('Joined successfully');
      // Optionally, you can update the UI or state to reflect the request sent
      setJoinedGuilds([...joinedGuilds, guildId]); // Update the list of joined guilds
    } catch (error) {
      console.error('Error sending join request:', error);
      // Handle error: display error message to user or retry request
    }
  };

  return (
    <div className='Join-A-Guild-main-div'>
      <h1 style={{ paddingTop: '108px' }}>What Is A Guild</h1>
      <p className="make-guild-p" style={{ width: '80%', textAlign: 'center' }}>
        A guild is a place you and others around the world can join together to
        communicate and share the stories of your travels. All Guilds Are unique and have Unique 
        people, Try to find one that fits you the best.
      </p>
      <br/>
      <br/>
      <h1>Findable Guilds</h1>
      {AllGuilds.filter(guild => 
        !joinedGuilds.includes(guild.id || guild._id) && 
        guild.Findable &&
        !guild.joinedTravelers.includes(UserData.id) &&
        !guild.joinedTravelers.includes(UserData._id) &&
        !requestedGuilds.includes(guild.id) &&
        !requestedGuilds.includes(guild._id) &&
        !guild.bannedTravelers.includes(UserData.id) &&
        !guild.bannedTravelers.includes(UserData._id)
      ).map((guild) => (
        <div 
          className="findable-guild-item" 
          key={guild.id || guild._id} 
          style={{ background: getGuildColors(guild.guildColor), display: 'flex', justifyContent: 'space-between' }}
        >
          <div className="findable-guild-item-left" style={{ flex: '1', maxWidth: '73%' }}>
            {expandedGuild !== guild.id && (
              <>
                <h2>{guild.guildName}</h2>
                <p style={{ overflowWrap: 'break-word' }}>Guild Moto: {guild.guildMoto}</p>
                <p>{guild.RequestToJoin ? (requestedGuilds.includes(guild.id) ? 'Requested To Join' : 'Request to Join') : 'Open For All To Join'}</p>
              </>
            )}
            {expandedGuild === guild.id && (
              <>
                <h3>Guild Bio</h3>
                <p style={{ overflowWrap: 'break-word' }}>{guild.bio}</p>
              </>
            )}
          </div>
          <div className="findable-guild-item-right" style={{ flex: '0 0 20%', minWidth: '20%', textAlign: 'right', maxWidth: '20%', }}>
            <p style={{paddingBottom: '10px', cursor: "pointer"}} onClick={() => handleGuildBioClick(guild.id)}>
              {expandedGuild === guild.id ? 'Hide Guild Bio' : 'Read Guilds Bio'}
            </p>
            <p style={{paddingBottom: '10px'}}>Guild Members: {guild.joinedTravelers.length}</p>
            {guild.RequestToJoin && (
              <p style={{paddingBottom: '10px', cursor: requestedGuilds.includes(guild.id) ? "default" : "pointer", color: requestedGuilds.includes(guild.id) ? "#999" : "inherit"}} onClick={() => !requestedGuilds.includes(guild.id) && handleRequestToJoinClick(guild.id || guild._id)}>
                {requestedGuilds.includes(guild.id) ? 'Requested To Join' : 'Request to Join'}
              </p>
            )}
            {!guild.RequestToJoin && (
              <p style={{paddingBottom: '10px', cursor: "pointer"}} onClick={() => handleJoinGuildClick(guild.id || guild._id)}>
                {joinedGuilds.includes(guild.id) ? 'Joined' : 'Join Guild'}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JoinAGuild;