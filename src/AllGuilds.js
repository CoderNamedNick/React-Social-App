import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Travelers from "./Travelers";

const AllGuilds = ({ UserData, setUserData }) => {
  const [OwnedGuilds, setOwnedGuilds] = useState([]);
  const [JoinedGuilds, setJoinedGuilds] = useState([]);
  const [RequestedGuilds, setRequestedGuilds] = useState([]);
  const [NoGuild, setNoGuild] = useState(false);

  useEffect(() => {
    const fetchGuildData = async () => {
      if (UserData.guildsOwned) {
        const ownedGuildsPromises = UserData.guildsOwned.map(async (id) => {
          // Assuming you have a function to fetch guild data by ID, replace `fetchGuildDataById` with that function
          const guildData = await fetchGuildDataById(id);
          return guildData;
        });

        const ownedGuildsData = await Promise.all(ownedGuildsPromises);
        setOwnedGuilds(ownedGuildsData);
      }

      if (UserData.guildsJoined) {
        
        const joinedGuildsPromises = UserData.guildsJoined.map(async (id) => {
          // Assuming you have a function to fetch guild data by ID, replace `fetchGuildDataById` with that function
          const guildData = await fetchGuildDataById(id);
          return guildData;
        });

        const joinedGuildsData = await Promise.all(joinedGuildsPromises);
        setJoinedGuilds(joinedGuildsData);
      }

      if (UserData.requestedGuilds) {
        
        const requestedGuildsPromises = UserData.requestedGuilds.map(async (id) => {
          // Assuming you have a function to fetch guild data by ID, replace `fetchGuildDataById` with that function
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
      // Your existing code to fetch guild data goes here...
  
      // Check if all guild arrays are empty and set NoGuild accordingly
      if (isMounted && UserData.guildsOwned.length === 0 && UserData.guildsJoined.length === 0 && UserData.requestedGuilds.length === 0) {
        setNoGuild(true);
      }
    };
  
    fetchGuildData();
  
    // Cleanup function
    return () => {
      isMounted = false; // Set isMounted to false when component unmounts
    };
  }, [UserData.guildsOwned, UserData.guildsJoined, UserData.requestedGuilds, OwnedGuilds, JoinedGuilds, RequestedGuilds]);

  // Function to fetch guild data by ID (replace this with your actual implementation)
  const fetchGuildDataById = async (id) => {
    // Example fetch call
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
          TravelerId: UserData.id || UserData._id, // Assuming UserData has the traveler's ID
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to Cancel Request');
      }
      const data = await response.json(); // assuming the response includes both user and guild data
  
      // Update UserData with the user data from the response
      setUserData(data.user);
      
      // Remove canceled guild ID from requestedGuilds array
      const updatedRequestedGuilds = RequestedGuilds.filter(guild => guild._id !== guildId);
      setRequestedGuilds(updatedRequestedGuilds);
  
      console.log('Request Canceled successfully');
    } catch (error) {
      console.error('Error sending Cancel:', error);
      // Handle error: display error message to user or retry request
    }
  }

  return (
  <div className='All-Guilds-main-div'>
    <div className="Travelelers-homepage-div">
      <Travelers UserData={UserData} setUserData={setUserData}/>
    </div>
    {NoGuild && (<div style={{marginLeft: '180px', marginTop: '120px'}} className="No-request">You Currently Have No Guild Connections</div>)}
    {!NoGuild && (
      <div style={{width: '100vw'}}>
        <div className="All-Guilds-content-div">
          <h1>Owned Guilds</h1>
          <div className="guild-container">
            {OwnedGuilds.map((Guild) => (
              <Link key={Guild._id || Guild.id} to={`/Guild/${Guild.guildName}`}>
                {/* Link to another page with the guild name as a parameter */}
                <div className="guild-item">
                  <p>{Guild.guildName}</p>
                  <p>Guild Moto: {Guild.guildMoto}</p>
                  <p>Guild Members: {Guild.joinedTravelers.length}</p>
                  <p>Guild Post: {Guild.guildPost.length}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div style={{marginTop: '10px'}} className="All-Guilds-content-div">
          <h1 style={{marginTop: '-60px'}}>Joined Guilds</h1>
          <div className="guild-container">
            {JoinedGuilds.filter((Guild) => !UserData.guildsOwned.includes(Guild.id || Guild._id)).map((FilteredGuild) => (
              <Link key={FilteredGuild._id || FilteredGuild.id} to={`/Guild/${FilteredGuild.guildName}`}>
                {/* Link to another page with the guild name as a parameter */}
                <div className="guild-item">
                  <p>{FilteredGuild.guildName}</p>
                  <p>Guild Moto: {FilteredGuild.guildMoto}</p>
                  <p>Guild bio: {FilteredGuild.bio}</p>
                  <p>Guild Members: {FilteredGuild.joinedTravelers.length}</p>
                </div>
              </Link>
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
                <p>Guild Members: {Guild.joinedTravelers.length}</p>
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