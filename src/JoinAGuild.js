import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const JoinAGuild = ({ UserData, setUserData }) => {
  const [AllGuilds, setAllGuilds] = useState([]);
  const [expandedGuild, setExpandedGuild] = useState(null);
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

  const getGuildColors = (guildColor) => {
    const selectedColorData = colors.find(color => color.name === guildColor);
    return selectedColorData ? `linear-gradient(to top, ${selectedColorData.color1}, ${selectedColorData.color2})` : '';
  };

  const handleGuildBioClick = (guildId) => {
    setExpandedGuild(expandedGuild === guildId ? null : guildId);
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
        !UserData.guildsJoined.includes(guild.id || guild._id) && 
        guild.Findable &&
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
                <p>{guild.RequestToJoin ? 'Request to Join' : 'Open For All To Join'}</p>
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
            <p style={{paddingBottom: '10px', cursor: "pointer"}}>Join Guild</p>
            <p style={{paddingBottom: '10px'}}>Guild Members: {guild.joinedTravelers.length}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JoinAGuild;