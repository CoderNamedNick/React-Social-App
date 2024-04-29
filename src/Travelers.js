import React, { useState, useEffect } from "react";
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const Travelers = ({ UserData, setUserData }) => {
  const [companionsData, setCompanionsData] = useState([]);
  const [filteredCompanions, setFilteredCompanions] = useState([]);
  const [Nocompanions, setNocompanions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [width, setWidth] = useState(140); // Initial width
  const [socket, setSocket] = useState(null);
  

  // Effect for establishing the socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Clean up the socket connection when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Effect for fetching the initial message count for each companion
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('connected');
        const userId = UserData.id || UserData._id;

        if (userId) {
          companionsData.forEach(companion => {
            socket.emit('message-count', userId, companion.id, (unreadMessageCount) => {
              console.log('got Message count response', unreadMessageCount);
              setCompanionsData(prevData => {
                return prevData.map(companionData => {
                  if (companionData.id === companion.id) {
                    return { ...companionData, messageCount: unreadMessageCount };
                  }
                  return companionData;
                });
              });
            });
          });
        }
      });
    }
  }, [socket, UserData.id, companionsData]);

  useEffect(() => {
    const fetchCompanionData = async () => {
      if (UserData.companions) {
        if (UserData.companions.length < 1) {
          setNocompanions(true);
        }
        const companionDataPromises = UserData.companions.map(async (id) => {
          const userData = await fetchUserDataById(id);
          return { id, userData }; // Store ID and user data
        });
        const companionData = await Promise.all(companionDataPromises);
        setCompanionsData(companionData);
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchCompanionData();
  }, [UserData.companions]);

  useEffect(() => {
    if (companionsData.length > 0) {
      setFilteredCompanions(companionsData.slice(0, 5)); // Show the first five companions
    }
  }, [companionsData]);

  const fetchUserDataById = async (id) => {
    const response = await fetch(`http://localhost:5000/Users/id/${id}`);
    const userData = await response.json();
    return userData;
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    filterCompanions(event.target.value);
  };

  const filterCompanions = (searchTerm) => {
    const filtered = companionsData.filter(({ userData }) =>
      userData.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanions(filtered);
  };

  const handleShowMore = () => {
    setShowMore(true); // This can be used to implement a "Show more" feature if needed
  };

  const handleResize = (event, { size }) => {
    setWidth(size.width);
  };

  return (
    <div className='Travelers-container'>
      <Resizable
        width={width}
        height={100}
        onResize={handleResize}
        minConstraints={[130, 1000]}
        maxConstraints={[600, 10000]}
        resizeHandles={['ne']}
        style={{ position: 'fixed', bottom: '0', top: '108px' }}
      >
        <div className="Travelers-homepage-div" style={{ width }}>
          <Link to="/FindCompanions"><div className="Travelers-hompage-search-h2">Find Travelers</div></Link>
          <br />
          <Link to="/Companion-Request"><div className="Travelers-hompage-search-h2">Companion Requests: {UserData.CompanionRequest ? UserData.CompanionRequest.length : 0}</div></Link>
          <br />
          <div className="Travelers-hompage-h2">Companions</div>
          <br />
          <input
            style={{ marginBottom: '5px' }}
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name"
            className="Travelers-hompage-search"
          />
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {filteredCompanions.map(({ id, userData, messageCount }, index) => (
                <Link key={userData._id || userData.id} to={`/user/${userData.username}`}>
                  <div key={index} className="Travelers-hompage-info">
                    <p style={{paddingTop: '10px'}}>{userData.username}</p>
                    <p style={{wordWrap: 'break-word', marginTop: '-10px'}}>Daily: {userData.dailyObj}</p>
                    <p style={{wordWrap: 'break-word', marginTop: '-10px'}}>New Messages: {messageCount || 0}</p> {/* Display message count */}
                  </div>
                </Link>
              ))}
              {filteredCompanions.length > 5 && !showMore && <button onClick={handleShowMore}>Show More</button>}
            </>
          )}
        </div>
      </Resizable>
    </div>
  );
};

export default Travelers;