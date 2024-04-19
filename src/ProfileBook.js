import React, { useState } from "react";

const ProfileBook = ({ UserData, setUserData }) => {
  const [EditProfile, setEditProfile] = useState(false);
  const [ShowColors, setShowColors] = useState(false);
  const [color, setcolor] = useState('');
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
  const [editedUserData, setEditedUserData] = useState({
    username: UserData?.username || '',
    dailyObj: UserData?.dailyObj || '',
    bio: UserData?.bio || ''
  });
  const [selectedColor, setSelectedColor] = useState(() => {
    // If UserData.ProfileColor exists and is a valid color option, return its corresponding color1 and color2
    if (
      UserData.ProfileColor &&
      ["Blue", "Green", "Red", "Purple", "Yellow", "Orange", "Gray"].includes(UserData.ProfileColor)
    ) {
      const selectedColorData = colors.find(color => color.name === UserData.ProfileColor);
      return `${selectedColorData.color1}, ${selectedColorData.color2}`;
    }
    // Default to an empty string if UserData.ProfileColor is null or invalid
    return '';
  });

  const Editprofile = () => {
    setEditProfile(true);
  };

  const EditColor = () => {
    setShowColors(!ShowColors);
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
  const changeBackgroundColor = (colorname, color1, color2) => {
    setSelectedColor(`${color1}, ${color2}`);
    // You can add additional logic here if needed, such as saving the colors to the database
    setcolor(colorname)
  };

  const SaveColor = () => {
    console.log(color)
    //Make a post theat saves color  in ProfileColor: colorName
    fetch(`http://localhost:5000/Users/id/${UserData.id || UserData._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ ProfileColor: color }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update Profile Color');
        }
        // Handle successful response (if needed)
        console.log('Profile Color updated successfully');

        // Fetch updated user data after successful patch
        fetch(`http://localhost:5000/Users/id/${UserData.id || UserData._id}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch updated user data');
            }
            return response.json();
          })
          .then(data => {
            // Update UserData with fetched data
            setUserData(data);
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
    setShowColors(false)
  }

  return (
    <div className="PB-main-div" style={{ background: `linear-gradient(to bottom, ${selectedColor})` }}>
      <div>
        {!EditProfile && (
          <div style={{border: 'Solid Black 3px'}}>
            <div className="travelors-info-div">
              <div className="Traveler-Pic">PROFILE PIC</div>
              <div className="Traveler-Info">
                <h1>{UserData.username}</h1>
                <h2>Daily Objective: </h2>
                <div className="PB-dailyObj" style={{ maxWidth: '200px', wordWrap: 'break-word' }}>{UserData.dailyObj}</div>
                <div>
                  <p>Bio:</p>
                  <div className="Traveler-Bio" style={{ maxWidth: '300px', wordWrap: 'break-word', marginTop: '-10px' }}>
                    {UserData.bio}
                  </div>
                </div>
                <p>Traveler Since: {UserData.AccDate ? UserData.AccDate.substring(0, 10) : ''}</p>
                {ShowColors && (<div className="Save-color-btn" onClick={SaveColor}>Save color</div>)}
              </div>
              <h4 style={{bottom: 0}} onClick={Editprofile} className="Edit-PB">
                Edit ProfileBook
              </h4>
              <h4 onClick={EditColor} className="Edit-PB">
                Edit ProfileBook Color
              </h4>
            </div>
            {ShowColors && (
              <div className="Color-Div">
                {colors.map((color, index) => (
                  <div style={{cursor: "pointer"}} key={index} onClick={() => changeBackgroundColor(color.name, color.color1, color.color2)}>
                    {color.name}
                  </div>
                ))}
              </div>
            )}
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
                  minLength={4}
                  maxLength={16}
                  className="edit-inputs"
                />
              </h1>
              <h2>
                Daily Objective:
                <input
                  type="text"
                  name="dailyObj"
                  value={editedUserData.dailyObj}
                  onChange={handleInputChange}
                  maxLength={40}
                  className="edit-inputs"
                />
              </h2>
              <div>
                Bio:
                <br />
                <textarea
                    name="bio"
                    value={editedUserData.bio}
                    onChange={handleInputChange}
                    className="Bio-input"
                    maxLength={120}
                ></textarea>
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