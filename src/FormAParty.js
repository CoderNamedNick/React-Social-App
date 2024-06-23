import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const FormAParty = ({ UserData, setUserData }) => {
  const [companionsData, setCompanionsData] = useState([]);
  const [NewPartyList, setNewPartyList] = useState([]);
  const [NewPartyListIds, setNewPartyListIds] = useState([]);
  const [NewPartyListUsernames, setNewPartyListUsernames] = useState([]);
  const [socket, setSocket] = useState(null);
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
    socket.emit('Create-Party', {
      creatorId: UserData.id,
      messengers: NewPartyList.map(companion => ({
        userId: companion.id,
        userName: companion.userData.username
      })),
      partyname: "My New Party" 
    });
  };

  return (
    <div className='Conversations-main-div'>
      <div className='Convos-div'>
        <h2>Make a Party with companions</h2>
        <div>
          <h2>New Party</h2>
          {NewPartyList.length === 0 ? (
            <div>Empty</div>
          ) : (
            <div>
              {NewPartyList.map(companion => (
                <div key={companion.id}>
                  <p>{companion.userData.username}</p>
                  <p style={{ cursor: 'pointer', color: 'red' }} onClick={() => removeFromPartyList(companion)}>Remove</p>
                </div>
              ))}
            </div>
          )}
          {NewPartyList.length > 1 && (
            <div style={{ cursor: 'pointer', color: 'green' }} onClick={formParty}>
              Form Party
            </div>
          )}
        </div>
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