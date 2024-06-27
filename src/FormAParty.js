import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const FormAParty = ({ UserData, setUserData }) => {
  const [companionsData, setCompanionsData] = useState([]);
  const [NewPartyList, setNewPartyList] = useState([]);
  const [NewPartyListIds, setNewPartyListIds] = useState([]);
  const [NewPartyName, setNewPartyName] = useState('');
  const [NewPartyListUsernames, setNewPartyListUsernames] = useState([]);
  const [socket, setSocket] = useState(null);
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

    socket.emit('Create-Party', {
      creatorId: UserData.id,
      messengers: NewPartyList.map(companion => ({
        userId: companion.id,
        userName: companion.userData.username
      })),
      partyname: NewPartyName 
    });
    setErrorMessage('');
  };

  return (
    <div className='Conversations-main-div'>
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
    </div>
  );
};

export default FormAParty;