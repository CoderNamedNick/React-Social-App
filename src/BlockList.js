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
          const userData = await fetchUserDataById(id);
          return userData;
        });

        const companionData = await Promise.all(companionDataPromises);
        setBlockedTravs(companionData);
      }
    };

    fetchCompanionData();
  }, [UserData.BlockedTravelers]);

  const fetchUserDataById = async (id) => {
    const response = await fetch(`http://localhost:5000/Users/id/${id}`);
    const userData = await response.json();
    return userData;
  };

  const UnBlockTraveler = async (userId, travelerId) => {
    try {
      const response = await fetch(`http://localhost:5000/Users/${userId}/Unblock-List`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          travelerId: travelerId,
        }),
      });
    
      if (!response.ok) {
        throw new Error('Failed to unblock traveler');
      }
    
      const data = await response.json();
      console.log('Traveler unblocked successfully:', data);
      setUserData(data.user);
      // Remove the unblocked traveler from BlockedTravs
      setBlockedTravs(BlockedTravs.filter(trav => trav._id !== travelerId));
    } catch (error) {
      console.error('Error unblocking traveler:', error);
    }
  };

  return (
    <div className='CompReq-main-div'>
      <div className="Travelelers-homepage-div">
        <Travelers UserData={UserData} setUserData={setUserData}/>
      </div>
      {NoBlocked && (<div style={{position: 'absolute', top: '130px', left: '25%', right: '25%'}} className="No-request">You Have No One Blocked</div>)}
      {!NoBlocked && (
        <div style={{marginTop: '10px'}} className="CompReq-content-div">
          {BlockedTravs.map((traveler) => (
              <div key={traveler._id || traveler.id} className="blocked-div">
                <div>
                  <p>{traveler.username}</p>
                  <p>Daily Objective: {traveler.dailyObj}</p>
                  <p>Traveler Since: {traveler.AccDate ? traveler.AccDate.substring(0, 10) : ''}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <Link to={`/user/${traveler.username}`}>
                    <p style={{paddingTop: '10px'}}>View Profile</p>
                  </Link>
                  <p onClick={() => UnBlockTraveler(UserData.id || UserData._id, traveler._id || traveler.id)} style={{color: 'black', paddingTop: '10px', cursor: 'pointer'}}>Unblock</p>
                </div>
              </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockList;