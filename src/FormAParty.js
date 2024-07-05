import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

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

//START HERE 
 
const FormAParty = ({ UserData, setUserData }) => {
  const [companionsData, setCompanionsData] = useState([]);
  const [NewPartyList, setNewPartyList] = useState([]);
  const [NewPartyListIds, setNewPartyListIds] = useState([]);
  const [NewPartyName, setNewPartyName] = useState('');
  const [NewPartyListUsernames, setNewPartyListUsernames] = useState([]);
  const [socket, setSocket] = useState(null);
  const [PartyFormed, setPartyFormed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Establish Socket connection
    const socket = io('http://localhost:5000');
    setSocket(socket);
  
    socket.on('connect', () => {
      console.log('connected');
    });
    // Clean up socket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  
  }, []);

  useEffect(() => {
    // Fetch companion data when UserData.companions change
    const fetchCompanionData = async () => {
      if (UserData.companions.length > 0) {
        const companionDataPromises = UserData.companions.map(async id => {
          const userData = await fetchUserDataById(id);
          return { id, userData };
        });
        const companionData = await Promise.all(companionDataPromises);
        setCompanionsData(companionData);
      }
    };

    fetchCompanionData();
  }, [UserData.companions]);

  const fetchUserDataById = async id => {
    const response = await fetch(`http://localhost:5000/Users/id/${id}`);
    const userData = await response.json();
    return userData;
  };

  const addToPartyList = userData => {
    if (!NewPartyList.some(companion => companion.id === userData.id)) {
      setNewPartyList([...NewPartyList, userData]);
      setNewPartyListIds([...NewPartyListIds, userData.id]);
      setNewPartyListUsernames([...NewPartyListUsernames, userData.userData.username]);
    }
  };

  const removeFromPartyList = userData => {
    setNewPartyList(NewPartyList.filter(companion => companion.id !== userData.id));
    setNewPartyListIds(NewPartyListIds.filter(id => id !== userData.id));
    setNewPartyListUsernames(NewPartyListUsernames.filter(username => username !== userData.userData.username));
  };

  const isUserInPartyList = userId => {
    return NewPartyListIds.includes(userId);
  };

  const formParty = () => {
    if (NewPartyName.trim() === '') {
      setErrorMessage('Party name cannot be empty');
      return;
    }
    const containsInappropriateWords = inappropriateWords.some(word => NewPartyName.toLowerCase().includes(word));
    
    if (containsInappropriateWords) {
      setErrorMessage('Party name contains inappropriate content');
      return;
    }

    socket.emit('Create-Party', {
      creatorId: UserData.id || UserData._id,
      messengers: NewPartyList.map(companion => ({
        userId: companion.id,
        userName: companion.userData.username
      })),
      partyname: NewPartyName 
    });
    setErrorMessage('');
    setPartyFormed(true)
  };

  return (
    <div className='Conversations-main-div'>
      {!PartyFormed && (
        <div className='Convos-div'>
          <h2>Make a Party with companions</h2>
          <input 
            placeholder="new party's name"
            style={{ fontSize: '20px', padding: '5px', marginBottom: '40px', height: '40px'}}
            value={NewPartyName} 
            maxLength={16}
            onChange={e => setNewPartyName(e.target.value)} // Update state on change
          />
          {errorMessage && (
            <p style={{ color: 'red' }}>{errorMessage}</p>
          )}
          <div style={{width: '90%', marginLeft: '5%'}}>
            {NewPartyList.length === 0 ? (
              <div style={{marginBottom: "40px", marginLeft: '40%'}}>Empty</div>
            ) : (
              <div style={{marginBottom: "40px"}} className='Make-A-convo-grid'>
                {NewPartyList.map(companion => (
                  <div className='Convo-companion-map-div' key={companion.id}>
                    <p>{companion.userData.username}</p>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '15px', justifyContent: 'space-between' }}>
                      <Link to={`/user/${companion.userData.username}`}><div>View Profile</div></Link>
                    </div>
                    <p style={{ cursor: 'pointer', color: 'red' }} onClick={() => removeFromPartyList(companion)}>Remove</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {NewPartyList.length > 1 && (
              <button 
                style={{ cursor: 'pointer', marginBottom: '30px', fontSize: '34px', background: 'rgba(0, 0, 0, 0.138)', borderRadius: '10px' }}
                
                onClick={formParty}
              >
                Form Party
              </button>
            )}
          <div className='Make-A-convo-grid'>
            {companionsData.map(({ userData }, index) => (
              <div className='Convo-companion-map-div' key={userData._id || userData.id}>
                <h3>{userData.username}</h3>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '15px', justifyContent: 'space-between' }}>
                  <Link to={`/user/${userData.username}`}><div>View Profile</div></Link>
                  {!isUserInPartyList(userData._id || userData.id) ? (
                    <div style={{ cursor: 'pointer' }} onClick={() => addToPartyList({ id: userData._id || userData.id, userData })}>Add To Party List</div>
                  ) : (
                    <div style={{ cursor: 'pointer' }}>Added To Party List</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {PartyFormed && (
        <div className='Convos-div'>
          <h2>Party Made!!</h2>
          <Link to="/Messages">
            <div style={{background: 'linear-gradient(to bottom, #c5daee4b, #266bc5)'}} className="Homepage-contents-divs">
              <h2>Messages & Party Content</h2>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default FormAParty;