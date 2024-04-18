import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const JoinAGuild = ({ UserData, setUserData }) => {
  const [AllGuilds, setAllGuilds] = useState([]);
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
        console.log(allGuildsData)
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
      <div>
        {AllGuilds.filter(guild => 
          !UserData.guildsJoined.includes(guild.id || guild._id) && 
          guild.Findable &&
          !guild.bannedTravelers.includes(UserData.id) &&
          !guild.bannedTravelers.includes(UserData._id)
        ).map((guild) => (
          <div style={{ background: getGuildColors(guild.guildColor) }} className="findable-guild-item" key={guild.id || guild._id}>
            <p>{guild.guildName}</p>
            <p>Guild Moto: {guild.guildMoto}</p>
            <p style={{overflowWrap: 'break-word'}}>Guild bio: {guild.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoinAGuild;