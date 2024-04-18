import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Travelers from "./Travelers";

const HomePage = ({UserData, setUserData}) => {
  // State variables and functions for managing data
  const [dailyObj, setdailyObj] = useState('');
  const [guildNotifications, setGuildNotifications] = useState([]);
  const [partyNotifications, setPartyNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tavernNews, setTavernNews] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);

  console.log(UserData)

  // Function to handle submitting the daily objective
  const handleSubmitObjective = (e) => {
    e.preventDefault();
    // Fake PATCH request (replace with actual code to send data to the server)
    fetch(`http://localhost:5000/Users/id/${UserData.id || UserData._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ dailyObj: dailyObj }),
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

    // Reset daily objective input and set the message
    setdailyObj('');
    setIsUpdated(true);
    setTimeout(() => {
      setIsUpdated(false);
    }, 3000); // Clear message after 3 seconds
  };


  return (
    <div className='Homepage-main-div'>
      <div className="Travelelers-homepage-div">
        <Travelers UserData={UserData} setUserData={setUserData}/>
      </div>
      <div style={{marginTop: '10px'}} className="Homepage-content-div">
        {/* Div for setting daily objective */}
        <div className="Homepage-contents-divs"> 
          <h2>Set your daily objective</h2>
          <form onSubmit={handleSubmitObjective}>
            <input
              type="text"
              value={dailyObj}
              onChange={(e) => setdailyObj(e.target.value)}
              placeholder="Enter your daily objective"
              maxLength={40}
              className="Hompage-daily-input"
            />
            <button type="submit" className="Hompage-daily-submit">Confirm</button>
            </form>
          {isUpdated && <p>Daily objective updated</p>} {/* Display message if daily objective is updated */}
        </div>

        {/* Div for Guild content */}
        <Link to="/All-Guilds">
          <div className="Homepage-contents-divs">
            <h2>Guild Content</h2>
            {/* Display guild notifications or "WANT TO JOIN A GUILD?" */}
          </div>
        </Link>

        {/* Div for Party content */}
        <div className="Homepage-contents-divs">
          <h2>Party Content</h2>
          {/* Display party notifications or "Make a party with travelers" */}
        </div>

        {/* Div for finding travelers */}
        <Link to="/FindCompanions"><div className="Homepage-contents-divs">
          <h2>Find Travelers</h2>
          {/* Search bar to find travelers */}
        </div></Link>

        {/* Div for Tavern News */}
        <div className="Homepage-contents-divs">
          <h2>Tavern News</h2>
          {/* Display Tavern news */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;