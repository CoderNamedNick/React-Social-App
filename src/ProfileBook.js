import React, { useState } from "react";

const ProfileBook = ({ UserData, setUserData }) => {
  const [EditProfile, setEditProfile] = useState(false);
  const [editedUserData, setEditedUserData] = useState({
    username: UserData?.username || '', // Using optional chaining for safety
    dailyObj: UserData?.dailyObj || '',
    bio: UserData?.bio || ''
  });
  const Editprofile = () => {
    setEditProfile(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedUserData({
      ...editedUserData,
      [name]: value
    });
  };

  const saveProfile = () => {
    console.log(UserData.id)
    fetch(`http://localhost:5000/Users/id/${UserData.id || UserData._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editedUserData)
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Updated user data:', data);
      // Perform another fetch request to get the updated data from the database
      fetch(`http://localhost:5000/Users/id/${UserData.id || UserData._id}`)
      .then((response) => response.json())
      .then((updatedUserData) => {
        console.log('Fetched updated user data:', updatedUserData);
        setEditProfile(false);
        setUserData(updatedUserData);
      })
      .catch((error) => {
        console.error("Error fetching updated user data:", error);
      });
    })
    .catch((error) => {
      console.error("Error updating profile:", error);
    });
  };

  return (
    <div>
      <div>
        {!EditProfile && (
          <div className="travelors-info-div">
            <div className="Traveler-Pic">PROFILE PIC</div>
            <div className="Traveler-Info">
              <h1>{UserData.username}</h1>
              <h2>Daily Objective: <span>{UserData.dailyObj}</span></h2>
              <p>Bio:</p>
              <div style={{marginTop: '-12px'}} className="Traveler-Bio">
                {UserData.bio}
              </div>
              <p>Traveler Since: {UserData.AccDate ? UserData.AccDate.substring(0, 10) : ''}</p>
            </div>
            <h4 onClick={Editprofile} className="Edit-PB">
              Edit ProfileBook
            </h4>
          </div>
        )}
        {EditProfile && (
          <div className="travelors-info-div">
            <div className="Traveler-Pic">PROFILE PIC</div>
            <div className="Traveler-Info">
              <h1>
                UserName:{" "}
                <input
                  type="text"
                  name="username"
                  value={editedUserData.username}
                  onChange={handleInputChange}
                />
              </h1>
              <h2>
                Daily Objective:
                <input
                  type="text"
                  name="dailyObj"
                  value={editedUserData.dailyObj}
                  onChange={handleInputChange}
                />
              </h2>
              <div>
                Bio:
                <br />
                <input
                  type="text"
                  name="bio"
                  value={editedUserData.bio}
                  onChange={handleInputChange}
                />
              </div>
              <p>Traveler Since: {UserData.AccDate.substring(0, 10)}</p>
            </div>
            <h4 onClick={saveProfile} className="Edit-PB">
              Finish Edit
            </h4>
          </div>
        )}
        <br />
        <br />
        <div className="ProfileBook-guilds-div">
          <h2>Guilds Traveler is part of</h2>
          {/*loop through user.Guilds array and then display guilds in this format */}
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

export default ProfileBook;