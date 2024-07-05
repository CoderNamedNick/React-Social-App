import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Travelers from "./Travelers";
import { io } from "socket.io-client";

const AllGuilds = ({ UserData, setUserData, setclickedGuild }) => {
  const [OwnedGuilds, setOwnedGuilds] = useState([]);
  const [JoinedGuilds, setJoinedGuilds] = useState([]);
  const [RequestedGuilds, setRequestedGuilds] = useState([]);
  const [NoGuild, setNoGuild] = useState(false);
  const [socket, setSocket] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io('http://localhost:5000');
    setSocket(socket)
    socket.on('connect', () => {
      
    });
   return () => {
     socket.disconnect();
   };
  }, []);

  useEffect(() => {
    const fetchGuildData = async () => {
      if (UserData.guildsOwned) {
        const ownedGuildsPromises = UserData.guildsOwned.map(async (id) => {
          const guildData = await fetchGuildDataById(id);
          return guildData;
        });
        const ownedGuildsData = await Promise.all(ownedGuildsPromises);
        setOwnedGuilds(ownedGuildsData);
      }

      if (UserData.guildsJoined) {
        const joinedGuildsPromises = UserData.guildsJoined.map(async (id) => {
          const guildData = await fetchGuildDataById(id);
          return guildData;
        });
        const joinedGuildsData = await Promise.all(joinedGuildsPromises);
        setJoinedGuilds(joinedGuildsData);
      }

      if (UserData.requestedGuilds) {
        const requestedGuildsPromises = UserData.requestedGuilds.map(async (id) => {
          const guildData = await fetchGuildDataById(id);
          return guildData;
        });
        const requestedGuildsData = await Promise.all(requestedGuildsPromises);
        setRequestedGuilds(requestedGuildsData);
      }
    };
    fetchGuildData();
  }, [UserData.guildsOwned, UserData.guildsJoined, UserData.requestedGuilds ]);

  useEffect(() => {
    let isMounted = true;
    const fetchGuildData = async () => {
      if (isMounted && UserData.guildsOwned.length === 0 && UserData.guildsJoined.length === 0 && UserData.requestedGuilds.length === 0) {
        setNoGuild(true);
      }
    };
    fetchGuildData();

    return () => {
      isMounted = false;
    };
  }, [UserData.guildsOwned, UserData.guildsJoined, UserData.requestedGuilds, OwnedGuilds, JoinedGuilds, RequestedGuilds]);

  const fetchGuildDataById = async (id) => {
    const response = await fetch(`http://localhost:5000/Guilds/id/${id}`);
    const guildData = await response.json();
    return guildData;
  };

  const CancelGuildRequest = async (guildId) => {
    try {
      const response = await fetch(`http://localhost:5000/Guilds/${guildId}/Cancel-Join-Request`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          TravelerId: UserData.id || UserData._id, 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to Cancel Request');
      }
      //if response is okay!
      const data = await response.json(); 
      setUserData(data.user);
      const updatedRequestedGuilds = RequestedGuilds.filter(guild => guild._id !== guildId);
      setRequestedGuilds(updatedRequestedGuilds);
      if (socket) {
        socket.emit('request-join-guild', guildId);
      }
    } catch (error) {
      console.error('Error sending Cancel:', error);
      alert('Error sending Cancel:', error)
    }
  }

  const GuildClick = (Guild) => {
    setclickedGuild(Guild)
    navigate('/GuildPages')
  }

  return (
  <div className='All-Guilds-main-div'>
    <div className="Travelelers-homepage-div">
      <Travelers UserData={UserData} setUserData={setUserData}/>
    </div>
    {NoGuild && (<div style={{position: 'absolute', top: '130px', left: '25%', right: '25%'}} className="No-request">You Currently Have No Guild Connections</div>)}
    {!NoGuild && (
      <div style={{width: '100vw'}}>
        <div className="All-Guilds-content-div">
          <h1>Owned Guilds</h1>
          <div className="guild-container">
            {OwnedGuilds.map((Guild) => (
              <div className="guild-item" key={Guild._id || Guild.id} onClick={() => {GuildClick(Guild)}}>
                <p>{Guild.guildName}</p>
                <p>Guild Moto: {Guild.guildMoto}</p>
                {Guild.joinedTravelers && (<p>Guild Members: {Guild.joinedTravelers.length + Guild.guildElders.length}</p>)}
                {Guild.guildPost && (<p>Guild Post: {Guild.guildPost.length}</p>)}
              </div>
            ))}
          </div>
        </div>
        <div style={{marginTop: '10px'}} className="All-Guilds-content-div">
          <h1 style={{marginTop: '-60px'}}>Joined Guilds</h1>
          <div className="guild-container">
            {JoinedGuilds.filter((Guild) => !UserData.guildsOwned.includes(Guild.id || Guild._id)).map((FilteredGuild) => (
              <div className="guild-item" onClick={() => {GuildClick(FilteredGuild)}}>
                <p>{FilteredGuild.guildName}</p>
                <p>Guild Moto: {FilteredGuild.guildMoto}</p>
                {FilteredGuild.joinedTravelers && (<p>Guild Members: {FilteredGuild.joinedTravelers.length + FilteredGuild.guildElders.length}</p>)}
                {FilteredGuild.guildPost && (<p>Guild Post: {FilteredGuild.guildPost.length}</p>)}
              </div>
            ))}
          </div>
        </div>
        <div style={{marginTop: '10px'}} className="All-Guilds-content-div">
          <h1 style={{marginTop: '-60px'}}>Requested To Join Guilds</h1>
          <div className="guild-container">
            {RequestedGuilds.map((Guild) => (
              <div className="guild-item">
                <p>{Guild.guildName}</p>
                <p>Guild Moto: {Guild.guildMoto}</p>
                {Guild.joinedTravelers && (<p>Guild Members: {Guild.joinedTravelers.length + Guild.guildElders.length}</p>)}
                <p onClick={() => CancelGuildRequest(Guild.id || Guild._id)} style={{cursor: 'pointer'}}>Cancel Request</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default AllGuilds;