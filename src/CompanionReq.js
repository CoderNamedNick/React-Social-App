import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Travelers from "./Travelers";

const CompanionReq = ({ UserData, setUserData }) => {
  const [CompanionReqs, setCompanionReqs] = useState([]);
  const [NoRequest, setNoRequest] = useState(false);

  useEffect(() => {
    const fetchCompanionData = async () => {
      if (UserData.CompanionRequest) {
        if(UserData.CompanionRequest.length < 1) {
          setNoRequest(true)
        }
        const companionDataPromises = UserData.CompanionRequest.map(async (id) => {
          const userData = await fetchUserDataById(id);
          return userData;
        });
        const companionData = await Promise.all(companionDataPromises);
        setCompanionReqs(companionData);
      }
    };
    fetchCompanionData();
  }, [UserData.CompanionRequest]);

  const fetchUserDataById = async (id) => {
    const response = await fetch(`https://tavern-backend-8tu5.onrender.com/Users/id/${id}`);
    const userData = await response.json();
    return userData;
  };

  return (
    <div className='CompReq-main-div'>
      <div className="Travelelers-homepage-div">
        <Travelers UserData={UserData} setUserData={setUserData}/>
      </div>
      {NoRequest && (<div style={{position: 'absolute', top: '130px', left: '25%', right: '25%'}} className="No-request">You Have No Companion New Requests</div>)}
    {!NoRequest && (
      <div style={{marginTop: '10px'}} className="CompReq-content-div">
        {CompanionReqs.map((traveler) => (
          <Link key={traveler._id || traveler.id} to={`/user/${traveler.username}`}>
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

export default CompanionReq;