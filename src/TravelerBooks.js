import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TravelersBooks = ({UserData, setUserData}) => {
  const { username } = useParams(); // Get the username parameter from the URL
  
  const [userDetails, setUserDetails] = useState(null);
  const [SentRequest, setSentRequest] = useState(false);
  const [AcceptRequest, setAcceptRequest] = useState(false)
  const [isCompanion, setisCompanion] = useState(false);
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
  const [selectedColor, setSelectedColor] = useState(() => {
    // If UserData.ProfileColor exists and is a valid color option, return its corresponding color1 and color2
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
    // Fetch user details based on the username
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/Users/username/${username}`); // Assuming your backend API endpoint for fetching user details is '/api/users/:username'
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
    console.log(userDetails)

    // Cleanup function
    return () => {
      // Any cleanup code if needed
    };
  }, [username]);
  useEffect(() => {
    // If UserDetails exists and is a valid color option, update selectedColor
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
    if(userDetails && UserData.CompanionRequest.includes(userDetails.id || userDetails._id)){
      setAcceptRequest(true)
    }
  }, [userDetails]);

  const SendCompanionRequest = () => {
    sendCompanionRequest(UserData.id || UserData._id, userDetails.id || userDetails._id)
  }
  const sendCompanionRequest = async (senderUserId, receiverUserId) => {
    if(userDetails.CompanionRequest.includes(senderUserId)){
      return alert('request already sent')
    }
    try {
      const response = await fetch(`http://localhost:5000/Users/${receiverUserId}/companion-request`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ companionId: senderUserId }) // Send the sender's user ID as companionId in the request body
      });
      const data = await response.json();
      if (response.ok) {
        // Companion request sent successfully
        setSentRequest(true); // Update state to indicate that the request has been sent
        console.log(data.message); // Log the success message from the server
      } else {
        // Handle error response from the server
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
      // Check if the accepter is already a companion
      if (userDetails.companions.includes(accepterId)) {
        return alert('You are already a companion');
      }
  
      const response = await fetch(`http://localhost:5000/Users/${acceptieId}/companions`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ companionId: accepterId }) // Send the sender's user ID as companionId in the request body
      });
      const data = await response.json();
      if (response.ok) {
        // Companion request sent successfully
        const userDataResponse = await fetch(`http://localhost:5000/Users/id/${accepterId}`);
        const userData = await userDataResponse.json();
        setUserData(userData);
        setisCompanion(true); // Update state to indicate that the request has been sent
        setAcceptRequest(false);
        DeclCompanionRequest();
        console.log(data.message); // Log the success message from the server
      } else {
        // Handle error response from the server
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
      const response = await fetch(`http://localhost:5000/Users/${acceptieId}/companions/${accepterId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) // No need to send any data in the body
      });
      const data = await response.json();
      if (response.ok) {
        // Companion request declined successfully
        // Fetch updated user data and save it as setUserData
        const userDataResponse = await fetch(`http://localhost:5000/Users/id/${accepterId}`);
        const userData = await userDataResponse.json();
        setUserData(userData);
        setAcceptRequest(false);
        setSentRequest(false);
        console.log(data.message); // Log the success message from the server
      } else {
        // Handle error response from the server
        console.error('Failed to decline companion request:', data.message);
      }
    } catch (error) {
      console.error('Error declining companion request:', error); // Handle fetch errors
    }
  }

  const RemCompanion = () => {
    RemoveCompanion(UserData.id || UserData._id, userDetails.id || userDetails._id)
  }
  const RemoveCompanion = async (userId, companionId) => {
    try {
      const response = await fetch(`http://localhost:5000/Users/${userId}/companions/${companionId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message);
      }

      // If the response is okay, companion has been successfully removed
      console.log('Companion removed successfully');

      // Fetch updated user data and update UI
      const userDataResponse = await fetch(`http://localhost:5000/Users/id/${userId}`);
      const userData = await userDataResponse.json();
      setUserData(userData);
      setAcceptRequest(false);
      setSentRequest(false);
      setisCompanion(false);
    } catch (error) {
        console.error('Error removing companion:', error.message);
        // Optionally, update UI to indicate the error to the user
    }
}


  // Render loading state while user details are being fetched
  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ background: `linear-gradient(to bottom, ${selectedColor})` }} className="TB-main-div">
      <div>
        <div className='Trav-div'>
          <div className="travelors-info-div">
            <div className="Traveler-Pic">PROFILE PIC</div>
            <div className="Traveler-Info">
              <h1>{userDetails.username}</h1>
              <h2>Daily Objective: </h2>
              <div className="PB-dailyObj" style={{ maxWidth: '200px', wordWrap: 'break-word' }}>{userDetails.dailyObj}</div>
              <div>
                <p>Bio:</p>
                <div className="Traveler-Bio" style={{ maxWidth: '300px', wordWrap: 'break-word', marginTop: '-10px' }}>
                  {userDetails.bio}
                </div>
              </div>
              <p>Traveler Since: {userDetails.AccDate ? userDetails.AccDate.substring(0, 10) : ''}</p>
            </div>
            {!isCompanion && !AcceptRequest && !SentRequest && (<h2 onClick={SendCompanionRequest} className="Edit-PB">Send Companion request</h2>)}
            {!AcceptRequest && SentRequest && (<h2 className="Edit-PB">Companion request Sent</h2>)}
            {AcceptRequest && (<h2 onClick={AccCompanionRequest} className="Edit-PB">Accept Companion Request</h2>)}
            {AcceptRequest && (<h2 onClick={DeclCompanionRequest} style={{bottom: 0}} className="Edit-PB">Decline Companion Request</h2>)}
            {isCompanion && (<h2 style={{bottom: 0}} className="Edit-PB">Send Message</h2>)}
          </div> 
          <div className='Trav-negatives'>
            <div style={{cursor: 'pointer'}}>Block Traveler</div>
            {isCompanion && (<div onClick={RemCompanion} style={{cursor: 'pointer'}}>Remove as Companion</div>)}
          </div>
        </div>
        <br />
        <br />
        <div className="ProfileBook-guilds-div">
          <h2>Guilds Traveler is part of</h2>
          {/*userDetails.*/}
          <div className="PB-guilds-div">
            <div style={{ paddingLeft: "20px" }}>
              <h1 className="PB-guilds-name">GuildName</h1>
              <h5># of guild Members</h5>
            </div>
            <p>Guild Bio</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelersBooks;