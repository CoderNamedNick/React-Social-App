import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { io } from 'socket.io-client'
import wine from "./images/wine-glass.png.png"
import beer from './images/Jug-Of-Beer.png.png'
import axes from './images/axes.png.png'
import bow from './images/bow-and-arrow.png.png'
import mouse from './images/mouse.webp'
import cat from './images/cat.png.png'
const imageMap = {
  bow: bow,
  axes: axes,
  beer: beer,
  wine: wine,
  mouse: mouse,
  cat: cat,
};

const TravelersBooks = ({UserData, setUserData}) => {
  const { username } = useParams(); // Get the username parameter from the URL
  const [userDetails, setUserDetails] = useState(null);
  const [JoinedGuilds, setJoinedGuilds] = useState([]);
  const [SentRequest, setSentRequest] = useState(false);
  const [AcceptRequest, setAcceptRequest] = useState(false)
  const [isCompanion, setisCompanion] = useState(false);
  const [isBlocked, setisBlocked] = useState(false);
  const [ProfileImageBgColor, setProfileImageBgColor] = useState('');
  const [ShowReportWindow, setShowReportWindow] = useState(false);
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const socket = io('https://tavern-backend-8tu5.onrender.com');
    setSocket(socket)
    socket.on('connect', () => {
      const userId = UserData.id || UserData._id;
      socket.emit('storeUserIdForInTheMessages', userId);
    });
   
    return () => {
      socket.disconnect();
    };
  }, []);
  const colors = 
  [
    {name: 'Blue', color1: '#F5F6FC', color2: '#0F2180'},
    {name: 'Green', color1: '#9FE5A6', color2: '#0F6617'},
    {name: 'Red', color1: '#C26D6D', color2: '#A70909'},
    {name: 'Purple', color1: '#D8B4D9', color2: '#78096F'},
    {name: 'Yellow', color1: '#F9F1C7', color2: '#F6D936'},
    {name: 'Orange', color1: '#F6AF75', color2: '#EA6A00'},
    {name: 'Gray', color1: '#D3D3D3', color2: '#4D4545'},
  ];
  const [reportData, setReportData] = useState({
    TravelerUserName: '',
    ReasonForReport: '',
    ReportDetails: ''
  });

  const handleReportChange = (e) => {
    setReportData({ ...reportData, [e.target.name]: e.target.value });
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://tavern-backend-8tu5.onrender.com/Reports/user/${UserData.id || UserData._id}/${userDetails.id || userDetails._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
      });

      const data = await response.json();
      if (response.ok) {
        alert('User report submitted successfully!');
        setShowReportWindow(false)
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error submitting user report:', error);
    }
  };
  const [selectedColor, setSelectedColor] = useState(() => {
    if (!userDetails) {
      return '';
    }
    if (
      userDetails.ProfileColor &&
      ["Blue", "Green", "Red", "Purple", "Yellow", "Orange", "Gray"].includes(userDetails.ProfileColor)
    ) {
      const selectedColorData = colors.find(color => color.name === userDetails.ProfileColor);
      return `${selectedColorData.color1}, ${selectedColorData.color2}`;
    }
    return '';
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`https://tavern-backend-8tu5.onrender.com/Users/username/${username}`); 
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const userData = await response.json();
        setUserDetails(userData);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();

  }, [username]);
  useEffect(() => {
    if (userDetails && userDetails.ProfileColor &&
      ["Blue", "Green", "Red", "Purple", "Yellow", "Orange", "Gray"].includes(userDetails.ProfileColor)) {
      const selectedColorData = colors.find(color => color.name === userDetails.ProfileColor);
      setSelectedColor(`${selectedColorData.color1}, ${selectedColorData.color2}`);
    }
    if(userDetails && userDetails.CompanionRequest.includes(UserData.id || UserData._id)){
      setSentRequest(true)
    }
    if(userDetails && userDetails.companions.includes(UserData.id || UserData._id)){
      setisCompanion(true)
    }
    if(userDetails && UserData.BlockedTravelers.includes(userDetails.id || userDetails._id)){
      setisBlocked(true)
    }
    if(userDetails && UserData.CompanionRequest.includes(userDetails.id || userDetails._id)){
      setAcceptRequest(true)
    }
    if(userDetails) {
      setProfileImageBgColor(userDetails.ProfileImgBgColor)
    }
  }, [userDetails]);
  
  useEffect(() => {
    const fetchGuildData = async () => {
      if (userDetails && userDetails.guildsJoined) { 
        const joinedGuildsPromises = userDetails.guildsJoined.map(async (id) => {
          const guildData = await fetchGuildDataById(id);
          return guildData;
        });
        const joinedGuildsData = await Promise.all(joinedGuildsPromises);
        setJoinedGuilds(joinedGuildsData);
      }
    };

    if (userDetails) {
      fetchGuildData();
    }
  }, [userDetails]);

  const fetchGuildDataById = async (id) => {
    const response = await fetch(`https://tavern-backend-8tu5.onrender.com/Guilds/id/${id}`);
    const guildData = await response.json();
    return guildData;
  };

  const SendCompanionRequest = () => {
    sendCompanionRequest(UserData.id || UserData._id, userDetails.id || userDetails._id)
  }

  const sendCompanionRequest = async (senderUserId, receiverUserId) => {
    if(userDetails.CompanionRequest.includes(senderUserId)){
      return alert('request already sent')
    }
    try {
      const response = await fetch(`https://tavern-backend-8tu5.onrender.com/Users/${receiverUserId}/companion-request`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ companionId: senderUserId })
      });
      const data = await response.json();
      if (response.ok) {
        if (socket) {
          socket.emit('update-user', receiverUserId)
        }
        setSentRequest(true); 
      } else {
        console.error('Failed to send companion request:', data.message);
      }
    } catch (error) {
      console.error('Error sending companion request:', error); // Handle fetch errors
    }
  };

  const AccCompanionRequest = () => {
    AcceptCompanionRequest(UserData.id || UserData._id, userDetails.id || userDetails._id)
  }

  const AcceptCompanionRequest = async (accepterId, acceptieId) => {
    try {
      if (userDetails.companions.includes(accepterId)) {
        return alert('You are already a companion');
      }
  
      const response = await fetch(`https://tavern-backend-8tu5.onrender.com/Users/${acceptieId}/companions`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ companionId: accepterId }) 
      });
      const data = await response.json();
      if (response.ok) {
        const userDataResponse = await fetch(`https://tavern-backend-8tu5.onrender.com/Users/id/${accepterId}`);
        const userData = await userDataResponse.json();
        setUserData(userData);
        setisCompanion(true); 
        setAcceptRequest(false);
        DeclCompanionRequest();
        if (socket) {
          socket.emit('update-user', acceptieId)
        }
      } else {
        console.error('Failed to send companion request:', data.message);
      }
    } catch (error) {
      console.error('Error sending companion request:', error); // Handle fetch errors
    }
  }

  const DeclCompanionRequest = () => {
    DeclineCompanionRequest(UserData.id || UserData._id, userDetails.id || userDetails._id)
  }

  const DeclineCompanionRequest = async (accepterId, acceptieId) => {
    try {
      const response = await fetch(`https://tavern-backend-8tu5.onrender.com/Users/${acceptieId}/companions/${accepterId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) 
      });
      const data = await response.json();
      if (response.ok) {
        const userDataResponse = await fetch(`https://tavern-backend-8tu5.onrender.com/Users/id/${accepterId}`);
        const userData = await userDataResponse.json();
        setUserData(userData);
        setAcceptRequest(false);
        setSentRequest(false);
      } else {
        console.error('Failed to decline companion request:', data.message);
      }
    } catch (error) {
      console.error('Error declining companion request:', error); 
    }
  }

  const RemCompanion = () => {
    RemoveCompanion(UserData.id || UserData._id, userDetails.id || userDetails._id)
  }

  const RemoveCompanion = async (userId, companionId) => {
    try {
      const response = await fetch(`https://tavern-backend-8tu5.onrender.com/Users/${userId}/companions/${companionId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
      });
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message);
      }

      const userDataResponse = await fetch(`https://tavern-backend-8tu5.onrender.com/Users/id/${userId}`);
      const userData = await userDataResponse.json();
      setUserData(userData);
      setAcceptRequest(false);
      setSentRequest(false);
      setisCompanion(false);
    } catch (error) {
      console.error('Error removing companion:', error.message);
    }
  }

  const BlockTrav = () => {
    if (UserData.CompanionRequest.includes(userDetails.id || userDetails._id)){
      DeclCompanionRequest()
      BlockTraveler(UserData.id || UserData._id, userDetails.id || userDetails._id)
    } else{
      BlockTraveler(UserData.id || UserData._id, userDetails.id || userDetails._id)
    }
  }
  const BlockTraveler = async (userId, travelerId) => {
    try {
      const response = await fetch(`https://tavern-backend-8tu5.onrender.com/Users/${userId}/Block-List`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          travelerId: travelerId,
        }),
      });
    
      if (!response.ok) {
        throw new Error('Failed to block traveler');
      }
      const data = await response.json();
      setUserData(data.user)
      setisBlocked(true);
    } catch (error) {
      console.error('Error blocking traveler:', error);
    }
  }

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  const handleShowReportWindow = () => {
    setShowReportWindow(!ShowReportWindow)
  }

  return (
    <div style={{ background: `linear-gradient(to bottom, ${selectedColor})` }} className="TB-main-div">
      <div>
        <div className='Trav-div'>
          <div className="travelors-info-div">
            {userDetails.ProfileImg !== '' && (<img style={{backgroundColor: ProfileImageBgColor}} src={imageMap[userDetails.ProfileImg]} className="Traveler-Pic" alt="Profile" />)}
            {userDetails.ProfileImg === '' && (<div className="Traveler-Pic"></div>)}
            <div className="Traveler-Info">
              <h2>{userDetails.username}</h2>
              <h3>Daily Objective: </h3>
              <div className="PB-dailyObj" style={{ maxWidth: '200px', wordWrap: 'break-word' }}>{userDetails.dailyObj}</div>
              <div>
                <p style={{display: 'inline-block'}}>Bio:</p>
                <div className="Traveler-Bio" style={{ maxWidth: '300px', wordWrap: 'break-word', marginTop: '-10px' }}>
                  {userDetails.bio}
                </div>
              </div>
              <p style={{marginBottom: '40px'}}>Traveler Since: {userDetails.AccDate ? userDetails.AccDate.substring(0, 10) : ''}</p>
            </div>
            {!isBlocked && !isCompanion && !AcceptRequest && !SentRequest && (<h2 onClick={SendCompanionRequest} className="Edit-PB">Send Companion request</h2>)}
            <h2 onClick={handleShowReportWindow} className="Report-PB">Report</h2>
            {!isBlocked && !AcceptRequest && SentRequest && (<h2 className="Edit-PB">Companion request Sent</h2>)}
            {!isBlocked && AcceptRequest && (<h2 onClick={AccCompanionRequest} className="Edit-PB">Accept Companion Request</h2>)}
            {!isBlocked && AcceptRequest && (<h2 onClick={DeclCompanionRequest} style={{bottom: 0}} className="Edit-PB">Decline Companion Request</h2>)}
            {!isBlocked && isCompanion && (<Link to="/Conversations"><h2 style={{bottom: 0}} className="Edit-PB">Start A Convo</h2></Link>)}
          </div> 
          <div className='Trav-negatives'>
            {!isBlocked && !isCompanion && (<div onClick={BlockTrav} style={{cursor: 'pointer'}}>Block Traveler</div>)}
            {isCompanion && (<div onClick={RemCompanion} style={{cursor: 'pointer'}}>Remove as Companion</div>)}
            {isBlocked &&(<h2 style={{paddingLeft: '30%',bottom: 0}}>This Traveler is Blocked</h2>)}
          </div>
        </div>
        <br />
        <br />
        <div className="ProfileBook-guilds-div">
          <h2>Guilds Traveler is part of</h2>
          {JoinedGuilds
          .filter(guild => guild.Findable === true) 
          .map((Guild) => (
            <div className="PB-guilds-div" style={{ display: 'flex', marginBottom: '20px' }}>
              <div style={{ flex: '0 0 30%', paddingLeft: "20px" }}>
                <h1 className="PB-guilds-name">{Guild.guildName}</h1>
                <h4># of guild Members: {Guild.joinedTravelers.length}</h4>
                <h5>Guild Since: {Guild.guildDate ? Guild.guildDate.substring(0, 10) : ''}</h5>
              </div>
              <div style={{ flex: '1', marginLeft: '50px', paddingRight: '10px', maxWidth: '50%' }}>
                <p style={{ fontSize: '20px', display: 'inline' }}>Guild Bio:</p>
                <div style={{ fontSize: '20px', width: '100%', overflowWrap: 'break-word', maxWidth: '100%' }}>{Guild.bio}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {ShowReportWindow && (
        <div className="Report-A-User-popup-main">
        <h2 style={{marginBottom: '100px', textAlign: 'center'}}>Reporting User</h2>
        <form style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10%', height: '65%'}} onSubmit={handleReportSubmit}>
          <input style={{padding: '10px',  width: '30%', fontSize:'20px',}} type="text" name="TravelerUserName" value={reportData.TravelerUserName} onChange={handleReportChange} placeholder="Reporting User's Name" required />
          <select
            name="ReasonForReport"
            value={reportData.ReasonForReport}
            onChange={handleReportChange}
            style={{padding: '10px',  width: '30%', fontSize:'20px',}}
          >
            <option value="Harassment">Harassment</option>
            <option value="Sexual Misconduct">Sexual Misconduct</option>
            <option value="Racial Misconduct">Racial Misconduct</option>
            <option value="Discriminatory">Discriminatory</option>
            <option value="Threats">Threats</option>
            <option value="Other">Other</option>
          </select>
          <textarea style={{resize: 'none', width: '50%', height: '30%', fontSize: '20px'}} name="ReportDetails" value={reportData.ReportDetails} onChange={handleReportChange} placeholder="Report Details" required></textarea>
          <button type="submit">Submit Report</button>
        </form>
        <h3 style={{ position: 'absolute', bottom: '0', left: '10px', cursor: 'pointer' }} onClick={handleShowReportWindow}>Cancel</h3>
      </div>
      )}
    </div>
  );
};

export default TravelersBooks;