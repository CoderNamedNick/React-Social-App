import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const FindTravelers = ({UserData, setUserData}) => {
  const [companions, setCompanions] = useState([]);
  const [filteredCompanions, setFilteredCompanions] = useState([]);
  const [Nocompanions, setNocompanions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    // Function to fetch all users
    const fetchAllUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/Users'); // Assuming you have an endpoint to fetch all users
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const AllusersData = await response.json();
        console.log(AllusersData)
        setAllUsers(AllusersData);
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    };
    // Call the fetchAllUsers function when the component mounts
    fetchAllUsers();
  }, []);

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
          return { id, userData }; // Store ID along with user data
        });
        const companionData = await Promise.all(companionDataPromises);
        setCompanions(companionData);
        setFilteredCompanions(companionData); // Initialize filteredCompanions with all companions
      }
    };

    fetchCompanionData();
  }, [UserData.companions]);

  const fetchUserDataById = async (id) => {
    const response = await fetch(`http://localhost:5000/Users/id/${id}`);
    const userData = await response.json();
    return userData;
  };

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

  const handleAccPrivChange = (newValue) => {
    const updatedUserData = { ...UserData, AccPrivate: newValue };
  
    fetch(`http://localhost:5000/Users/id/${UserData.id || UserData._id}`, {
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
        // Handle successful response (if needed)
        console.log('Privacy updated successfully');
  
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
        console.error('Error updating Privacy:', error);
      });
  };

  return (
    <div className="Find-travelers-main-div">
      <h1 style={{paddingTop: '118px'}}>Current Companions</h1>
      <input
        style={{ marginBottom: '5px' }}
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by name"
        className="Travelers-hompage-search"
      />
      <div>
        <div className="Current-Companions-grid">
          {filteredCompanions.map((companion, index) => (
            <Link key={companion._id || companion.id} to={`/user/${companion.userData.username}`}>
              <div key={companion._id || companion.id} className="companion-item">
                <p>{companion.userData.username}</p>
                <p style={{wordWrap: 'break-word'}}>Daily Objective: {companion.userData.dailyObj}</p>
                <p>Traveler Since: {companion.userData.AccDate ? companion.userData.AccDate.substring(0, 10) : ''}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
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
        <div style={{marginTop: '50px'}} className="Current-Companions-grid"> {/*Get all and then filter with findable accounts Also A grid*/}
        {allUsers
          .map((traveler) => {
            // Check if the traveler's id matches UserData id or if their account is private
            if (traveler.username === UserData.username || traveler.AccPrivate) {
              // Skip rendering this traveler
              return null;
            }
            if (UserData.BlockedTravelers.includes(traveler.id || traveler._id)) {
              // Skip rendering this traveler
              return null;
            }
            if (UserData.companions.includes(traveler.id || traveler._id)) {
              // Skip rendering this traveler
              return null;
            }
            return traveler;
          })
          .filter((traveler) => traveler !== null)
          .sort((a, b) => {
            // Sort based on age difference with UserData
            const ageDifferenceA = calculateAgeDifference(a.birthdate, UserData.birthdate);
            const ageDifferenceB = calculateAgeDifference(b.birthdate, UserData.birthdate);
            return ageDifferenceA - ageDifferenceB;
          })
          .map((traveler) => (
            <Link key={traveler._id || traveler.id} to={`/user/${traveler.username}`}>
              {/* Link to another page with the username as a parameter */}
              <div className="companion-item">
                <p>{traveler.username}</p>
                <p style={{wordWrap: 'break-word'}}>Daily Objective: {traveler.dailyObj}</p>
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
