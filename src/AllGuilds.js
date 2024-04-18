import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Travelers from "./Travelers";

const AllGuilds = ({ UserData, setUserData }) => {
  const [OwnedGuilds, setOwnedGuilds] = useState([]);
  const [JoinedGuilds, setJoinedGuilds] = useState([]);
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
        if (UserData.guildsJoined.length < 1) {
          setNoGuild(true);
        }
        const joinedGuildsPromises = UserData.guildsJoined.map(async (id) => {
          // Assuming you have a function to fetch guild data by ID, replace `fetchGuildDataById` with that function
          const guildData = await fetchGuildDataById(id);
          return guildData;
        });

        const joinedGuildsData = await Promise.all(joinedGuildsPromises);
        setJoinedGuilds(joinedGuildsData);
      }
    };

    fetchGuildData();
  }, [UserData.guildsOwned, UserData.guildsJoined]);

  // Function to fetch guild data by ID (replace this with your actual implementation)
  const fetchGuildDataById = async (id) => {
    // Example fetch call
    const response = await fetch(`http://localhost:5000/Guilds/id/${id}`);
    const guildData = await response.json();
    return guildData;
  };

  return (
    <div className='CompReq-main-div'>
      <div className="Travelelers-homepage-div">
        <Travelers UserData={UserData} setUserData={setUserData}/>
      </div>
      {NoGuild && (<div className="No-request">You Are Not In A Guild</div>)}
      {!NoGuild && (
        <div>
          <div style={{marginTop: '10px'}} className="CompReq-content-div">
            <h1>Owned Guilds</h1>
            {OwnedGuilds.map((Guild) => (
              <Link key={Guild._id || Guild.id} to={`/Guild/${Guild.guildName}`}>
                {/* Link to another page with the guild name as a parameter */}
                <div className="companion-req-item">
                  <p>{Guild.guildName}</p>
                  <p>Guild Moto: {Guild.guildMoto}</p>
                  <p></p>
                </div>
              </Link>
            ))}
          </div>
          <div style={{marginTop: '10px'}} className="CompReq-content-div">
            <h1>Joined Guilds</h1>
            {JoinedGuilds.map((Guild) => (
              <Link key={Guild._id || Guild.id} to={`/Guild/${Guild.guildName}`}>
                {/* Link to another page with the guild name as a parameter */}
                <div className="companion-req-item">
                  <p>{Guild.guildName}</p>
                  <p>Guild Moto: {Guild.guildMoto}</p>
                  <p></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllGuilds;