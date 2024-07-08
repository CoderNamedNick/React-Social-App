import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const FindTravelers = ({UserData, setUserData}) => {
  const [companions, setCompanions] = useState([]);
  const [filteredCompanions, setFilteredCompanions] = useState([]);
  const [Nocompanions, setNocompanions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [searchTermTravelers, setSearchTermTravelers] = useState("");
  const [filteredTravelers, setFilteredTravelers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch('https://tavern-backend-8tu5.onrender.com/Users'); 
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const AllusersData = await response.json();
        setAllUsers(AllusersData);
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    };
    fetchAllUsers();
  }, []);

  //I stole This code from someone who also stole this code
  const calculateAgeDifference = (birthdate1, birthdate2) => {
    const date1 = new Date(birthdate1);
    const date2 = new Date(birthdate2);
    const diffTime = Math.abs(date1 - date2);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    const fetchCompanionData = async () => {
      if (UserData.companions) {
        if (UserData.companions.length < 1) {
          setNocompanions(true);
        }
        const companionDataPromises = UserData.companions.map(async (id) => {
          const userData = await fetchUserDataById(id);
          return { id, userData }; 
        });
        const companionData = await Promise.all(companionDataPromises);
        setCompanions(companionData);
        setFilteredCompanions(companionData); 
      }
    };
    fetchCompanionData();
  }, [UserData.companions]);

  const fetchUserDataById = async (id) => {
    const response = await fetch(`https://tavern-backend-8tu5.onrender.com/Users/id/${id}`);
    const userData = await response.json();
    return userData;
  };
  // for companions
  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterCompanions(term);
  };

  const filterCompanions = (searchTerm) => {
    const filtered = companions.filter(({ userData }) =>
      userData.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanions(filtered);
  };
  // for Travelers
  const handleSearchTravelersChange = (event) => {
    const term = event.target.value;
    setSearchTermTravelers(term);
    filterTravelers(term);
  };

  const filterTravelers = (searchTerm) => {
    const filtered = allUsers.filter((traveler) =>
      traveler.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTravelers(filtered); 
  };;

  const handleAccPrivChange = (newValue) => {
    const updatedUserData = { ...UserData, AccPrivate: newValue };
  
    fetch(`https://tavern-backend-8tu5.onrender.com/Users/id/${UserData.id || UserData._id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedUserData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update Privacy');
        }
        fetch(`https://tavern-backend-8tu5.onrender.com/Users/id/${UserData.id || UserData._id}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch updated user data');
            }
            return response.json();
          })
          .then(data => {
            setUserData(data);
          })
          .catch(error => {
            console.error('Error fetching updated user data:', error);
          });
      })
      .catch(error => {
        console.error('Error updating Privacy:', error);
      });
  };

  return (
    <div className="Find-travelers-main-div">
      <h1 style={{ paddingTop: '118px' }}>Current Companions</h1>
      {/* Search bar for companions */}
      <input
        style={{ marginBottom: '5px', padding: '5px', width: '200px' }}
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search companions by name"
        className="Travelers-hompage-search"
      />
      <div>
        <div className="Current-Companions-grid">
          {/* filtered companions based on search  */}
          {filteredCompanions.map((companion, index) => (
            <Link key={companion._id || companion.id} to={`/user/${companion.userData.username}`}>
              <div key={companion._id || companion.id} className="companion-item">
                <p>{companion.userData.username}</p>
                <p style={{ wordWrap: 'break-word' }}>Daily Objective: {companion.userData.dailyObj}</p>
                <p>Traveler Since: {companion.userData.AccDate ? companion.userData.AccDate.substring(0, 10) : ''}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Search bar for travelers */}
      <h1>Search Travelers</h1>
      <input
        style={{ marginBottom: '5px', padding: '5px', width: '200px' }}
        type="text"
        value={searchTermTravelers}
        onChange={handleSearchTravelersChange}
        placeholder="Search travelers by name"
        className="Travelers-hompage-search"
      />
      <div>
        {UserData.AccPrivate ? (
          <div className="acc-status-div">
            Your Account is Currently Private.{" "}
            <span className="Find-C-Span" onClick={() => handleAccPrivChange(false)}>Make Account Findable</span>
          </div>
        ) : (
          <div className="acc-status-div">
            Your Account is Currently Findable.{" "}
            <span className="Find-C-Span" onClick={() => handleAccPrivChange(true)}>Make Account Private</span>
          </div>
        )}
        <div style={{ marginTop: '50px', marginBottom: '40px' }} className="Current-Companions-grid"> {/* Get all and then filter with findable accounts Also A grid */}
          {/*  filtered travelers based on filters and search  */}
          {allUsers
            .map((traveler) => {
              if (
                traveler.AccPrivate === true ||
                traveler.username === UserData.username || // Skip user's own profile
                UserData.BlockedTravelers.includes(traveler.id || traveler._id) || // Skip blocked travelers
                UserData.companions.includes(traveler.id || traveler._id) || // Skip user's companions
                (searchTermTravelers && !traveler.username.toLowerCase().includes(searchTermTravelers.toLowerCase())) // Skip if search term doesn't match
              ) {
                return null;
              }
              return traveler;
            })
            .filter((traveler) => traveler !== null)
            .sort((a, b) => {
              const ageDifferenceA = calculateAgeDifference(a.birthdate, UserData.birthdate);
              const ageDifferenceB = calculateAgeDifference(b.birthdate, UserData.birthdate);
              return ageDifferenceA - ageDifferenceB;
            })
            .map((traveler) => (
              <Link key={traveler._id || traveler.id} to={`/user/${traveler.username}`}>
                <div className="companion-item">
                  <p>{traveler.username}</p>
                  <p style={{ wordWrap: 'break-word' }}>Daily Objective: {traveler.dailyObj}</p>
                  <p>Traveler Since: {traveler.AccDate ? traveler.AccDate.substring(0, 10) : ''}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FindTravelers;