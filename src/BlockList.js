import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Travelers from "./Travelers";

const BlockList = ({ UserData, setUserData }) => {
  const [BlockedTravs, setBlockedTravs] = useState([]);
  const [NoBlocked, setNoBlocked] = useState(false);

  useEffect(() => {
    const fetchCompanionData = async () => {
      if (UserData.BlockedTravelers) {
        if(UserData.BlockedTravelers.length < 1) {
          setNoBlocked(true)
        }
        const companionDataPromises = UserData.BlockedTravelers.map(async (id) => {
          // Assuming you have a function to fetch user data by ID, replace `fetchUserDataById` with that function
          const userData = await fetchUserDataById(id);
          return userData;
        });

        const companionData = await Promise.all(companionDataPromises);
        setBlockedTravs(companionData);
      }
    };

    fetchCompanionData();
  }, [UserData.BlockedTravelers]);

  // Function to fetch user data by ID (replace this with your actual implementation)
  const fetchUserDataById = async (id) => {
    // Example fetch call
    const response = await fetch(`http://localhost:5000/Users/id/${id}`);
    const userData = await response.json();
    return userData;
  };

  return (
    <div className='CompReq-main-div'>
      <div className="Travelelers-homepage-div">
        <Travelers UserData={UserData} setUserData={setUserData}/>
      </div>
      {NoBlocked && (<div className="No-request">You Have No One Blocked</div>)}
    {!NoBlocked && (
      <div style={{marginTop: '10px'}} className="CompReq-content-div">
        {BlockedTravs.map((traveler) => (
          <Link key={traveler._id || traveler.id} to={`/user/${traveler.username}`}>
            {/* Link to another page with the username as a parameter */}
            <div className="companion-req-item">
              <p>{traveler.username}</p>
              <p>Daily Objective: {traveler.dailyObj}</p>
              <p>Traveler Since: {traveler.AccDate ? traveler.AccDate.substring(0, 10) : ''}</p>
            </div>
          </Link>
        ))}
      </div>
    )}
    </div>
  );
};

export default BlockList;