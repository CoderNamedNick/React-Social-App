import React, { useState, useEffect } from "react";
import wine from "./images/wine-glass.png.png";
import beer from './images/Jug-Of-Beer.png.png';
import axes from './images/axes.png.png';
import bow from './images/bow-and-arrow.png.png';
import mouse from './images/mouse.webp';
import cat from './images/cat.png.png';

const imageMap = {
  bow: bow,
  axes: axes,
  beer: beer,
  wine: wine,
  mouse: mouse,
  cat: cat,
};
const inappropriateWords = [
  "asshole","assh0le", "assh01e","assho1e", "a55hole", "a55h0le", "a55h01e",
  "a55ho1e", "ba5tard", "b1tch", "bullsh1t", "bu11shit", "bu11sh1t", "bu1lsh1t",
  "d1ck", "d0uche", "m0therfucker", "vigger", "nigga", "n1gger", "ni99er", "ni9ger",
  "nig9er", "n199er", "n1g9er", "n19ger", "p1ss", "p155", "p15s", "p1s5", "pi55", "pi5s",
  "pis5", "pr1ck", "pu5sy", "pu55y", "pus5y", "pus5", "pu55", "pu5s", "sh1t", "s1ut",
  "wh0re", "bastard", "bitch", "bullshit", "cunt", "cum", "cummer", "cun7",
  "damn", "dick", "douche", "fuck", "fucker", "motherfucker", "nigger", "piss", 
  "prick", "puss", "pussy","retard", "shit", "slut", "twat", "whore", "wanker", "jerker",
  "faggot", "fagg0t", "fag", "queer",  "dyke", "killyourself", 
  "k1llyourself", "k1lly0urself", "k1lly0urse1f", "killy0urself", "killy0urse1f", "k1llyourse1f",
  "a5shole", "a5sh0le", "a5sh01e", "a5sho1e", "4sshole", "4ssh0le", "4ssh01e", "4ssho1e",
  "blowjob", "b10wjob", "bl0wjob", "bl0wj0b", "b10wj0b", "blowj0b", "bl0wj0b",
  "cocksucker", "c0cksucker", "c0cksuck3r", "c0cksuckr", "c0cksuck", "cocksuck3r", "c0cksucker",
  "c0cksuck", "f4ggot", "f4g", "qu33r", "d1ckhead", "d1ckh3ad", "d1ckhed", "dickhead", "dickh3ad", 
  "dickhed", "jackass", "jack@ss", "j@ckass", "j@ck@ss", "jerkoff", "jerk0ff", "j3rkoff", "j3rk0ff", 
  "masturbate", "m@sturbate", "m@stur8", "m@sturb8", "masturb8", "mastur8", "motherfucker", 
  "moth3rfucker", "m0therfucker", "m0th3rfucker", "phuck", "phucker", "phuk", "p00p", "p0rn", 
  "porn", "pr0n", "rap3", "r@pe", "r@p3", "suck", "sh1thead", "sh1th3ad", "sh1thad", "shithe@d", 
  "shith3ad", "shithad", "t1t", "t1ts", "tit", "tits", "vagina", "vaj1na", "vajina", "vag1na", 
  "vajayjay", "va-jay-jay", "vaj@yjay", "wh0r3", "whore", "wh0r", "whor", "wank3r", "wank", 
  "w4nk", "wanker", "w4nker"
];

const ProfileBook = ({ UserData, setUserData }) => {
  const [EditProfile, setEditProfile] = useState(false);
  const [ShowColors, setShowColors] = useState(false);
  const [JoinedGuilds, setJoinedGuilds] = useState([]);
  const [ProfileImage, setProfileImage] = useState(UserData.ProfileImg || '');
  const [ProfileImageBgColor, setProfileImageBgColor] = useState(UserData.ProfileImgBgColor || '');
  const [color, setcolor] = useState('');
  const [errors, setErrors] = useState({});
  const [selectedProfileImage, setSelectedProfileImage] = useState(UserData.ProfileImg || '');
  const [selectedBgColor, setSelectedBgColor] = useState(UserData.ProfileImgBgColor || '');

  const colors = [
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
    bio: UserData?.bio || '',
    ProfileImg: UserData?.ProfileImg || '',
    ProfileImgBgColor: UserData?.ProfileImgBgColor || '',
  });

  const [selectedColor, setSelectedColor] = useState(() => {
    if (
      UserData.ProfileColor &&
      ["Blue", "Green", "Red", "Purple", "Yellow", "Orange", "Gray"].includes(UserData.ProfileColor)
    ) {
      const selectedColorData = colors.find(color => color.name === UserData.ProfileColor);
      return `${selectedColorData.color1}, ${selectedColorData.color2}`;
    }
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

  useEffect(() => {
    const fetchGuildData = async () => {
      if (UserData.guildsJoined) {
        const joinedGuildsPromises = UserData.guildsJoined.map(async (id) => {
          const guildData = await fetchGuildDataById(id);
          return guildData;
        });

        const joinedGuildsData = await Promise.all(joinedGuildsPromises);
        setJoinedGuilds(joinedGuildsData);
      }
    };
    fetchGuildData();
  }, [UserData.guildsJoined]);

  const fetchGuildDataById = async (id) => {
    const response = await fetch(`http://localhost:5000/Guilds/id/${id}`);
    const guildData = await response.json();
    return guildData;
  };

  const saveProfile = () => {
    // Check for inappropriate words
    const containsInappropriateWords = inappropriateWords.some(word => 
      Object.values(editedUserData).some(input => String(input).toLowerCase().includes(word))
    );
  
    if (containsInappropriateWords) {
      alert('Input contains inappropriate content');
      return;
    }
  
    fetch(`http://localhost:5000/Users/id/${UserData.id || UserData._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editedUserData)
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(errorData.message || 'Error updating profile');
        });
      }
      return response.json();
    })
    .then((data) => {
      return fetch(`http://localhost:5000/Users/id/${UserData.id || UserData._id}`);
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          setErrors(errorData.message || 'Error From server');
          return
        });
      }
      return response.json();
    })
    .then((updatedUserData) => {
      setEditProfile(false);
      setUserData(updatedUserData);
    })
    .catch((error) => {
      console.error(error.message);
      alert(error.message);
    });
  };
  const changeBackgroundColor = (colorname, color1, color2) => {
    setSelectedColor(`${color1}, ${color2}`);
    setcolor(colorname);
  };

  const SaveColor = () => {
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
        return response.json();
      })
      .then(data => {
        setUserData(data);
      })
      .catch(error => {
        console.error('Error updating daily objective:', error);
      });
    setShowColors(false);
  };

  const handleProfileImageChange = (imageName) => {
    setSelectedProfileImage(imageName);
    setProfileImage(imageName);
    setEditedUserData({
      ...editedUserData,
      ProfileImg: imageName
    });
  };

  const handleBgColorChange = (color) => {
    setSelectedBgColor(color);
    setProfileImageBgColor(color);
    setEditedUserData({
      ...editedUserData,
      ProfileImgBgColor: color
    });
  };

  return (
    <div className="PB-main-div" style={{ background: `linear-gradient(to bottom, ${selectedColor})` }}>
      <div>
        {!EditProfile && (
          <div style={{ border: 'Solid Black 3px' }}>
            <div className="travelors-info-div">
              {UserData.ProfileImg !== '' && (
                <img
                  style={{backgroundColor: ProfileImageBgColor}}
                  src={imageMap[UserData.ProfileImg]}
                  className="Traveler-Pic"
                  alt="Profile"
                />
              )}
              {UserData.ProfileImg === '' && (<div className="Traveler-Pic"></div>)}
              <div className="Traveler-Info">
                <h2>{UserData.username}</h2>
                <h3>Daily Objective: </h3>
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
              <h4 style={{ bottom: 0 }} onClick={Editprofile} className="Edit-PB">
                Edit ProfileBook
              </h4>
              <h4 onClick={EditColor} className="Edit-PB">
                Edit ProfileBook Color
              </h4>
            </div>
            {ShowColors && (
              <div className="Color-Div">
                {colors.map((color, index) => (
                  <div 
                    key={index} 
                    onClick={() => changeBackgroundColor(color.name, color.color1, color.color2)}
                    style={{
                      cursor: "pointer",
                      border: selectedBgColor === color.name ? '2px solid black' : 'none',
                      padding: '5px',
                      borderRadius: '5px',
                    }}
                  >
                    {color.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {EditProfile && (
          <div className="travelors-info-div">
            <div className="Traveler-Pic-edit">
              <div style={{marginLeft: '30%'}}>Pick A User Icon</div>
              <div>
                {Object.keys(imageMap).map((key, index) => (
                  <img
                    key={index}
                    onClick={() => handleProfileImageChange(key)}
                    style={{
                      width: '60px',
                      height: '50px',
                      border: selectedProfileImage === key ? '2px solid black' : 'none',
                      padding: '5px',
                      borderRadius: '5px',
                    }}
                    src={imageMap[key]}
                    alt={key}
                  />
                ))}
              </div>
              <div style={{marginLeft: '30%'}}>Pick A Background Color</div>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}> 
                {['lightblue', 'skyblue', 'lightgrey', 'lightgreen', 'lightpink', 'pink', 'lightyellow', 'violet', 'white'].map((color, index) => (
                  <div
                    key={index}
                    onClick={() => handleBgColorChange(color)}
                    style={{
                      border: selectedBgColor === color ? '2px solid black' : 'solid 1px black',
                      width: '20px',
                      height: '20px',
                      backgroundColor: color,
                    }}
                  ></div>
                ))}
              </div>
            </div>
            <div className="Traveler-Info">
              {errors && (<p>{errors.message}</p>)}
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
        <div style={{marginBottom: '120px'}} className="ProfileBook-guilds-div">
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
    </div>
  );
};

export default ProfileBook;