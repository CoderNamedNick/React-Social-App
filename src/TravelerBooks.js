import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TravelersBooks = ({UserData, setUserData}) => {
  const { username } = useParams(); // Get the username parameter from the URL
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
        console.log(userDetails)
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();

    // Cleanup function
    return () => {
      // Any cleanup code if needed
    };
  }, [username]);
  const [userDetails, setUserDetails] = useState(null);
  const [SentRequest, setSentRequest] = useState(false);
  const colors = 
  [
  {name: 'Blue', color1: '#F5F6FC', color2: '#0F2180'},
  {name: 'Green', color1: '#9FE5A6', color2: '#0F6617'},
  {name: 'Red', color1: '#C26D6D', color2: '#A70909'},
  {name: 'Purple', color1: '#D8B4D9', color2: '#78096F'},
  {name: 'Yellow', color1: '#FFFF03', color2: '#E3E322'},
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


  const SendCompanionRequest = () => {
    const { id, username } = UserData;

    // Create a new object containing only the required fields
    const requestData = { id, username };

    fetch(`http://localhost:5000/Users/id/${userDetails.id || userDetails._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ CompanionRequest: requestData  }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update daily objective');
        }
        // Handle successful response (if needed)
        console.log('Daily objective updated successfully');

        // Fetch updated user data after successful patch
        fetch(`http://localhost:5000/Users/id/${userDetails.id || userDetails._id}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch updated user data');
            }
            return response.json();
          })
          .then(data => {
            // Update UserData with fetched data
            setUserDetails(data);
          })
          .catch(error => {
            // Handle error (if needed)
            console.error('Error fetching updated user data:', error);
          });
      })
      .catch(error => {
        // Handle error (if needed)
        console.error('Error updating daily objective:', error);
      });
      setSentRequest(true)
  };


  // Render loading state while user details are being fetched
  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ background: `linear-gradient(to bottom, ${selectedColor})` }} className="TB-main-div">
      <div>
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
          {!SentRequest && (<h2 onClick={SendCompanionRequest} className="Edit-PB">Send Companion request</h2>)}
          {SentRequest && (<h2 className="Edit-PB">Companion request Sent</h2>)}
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