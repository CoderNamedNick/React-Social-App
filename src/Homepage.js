import React, { useState, useEffect } from "react";
import Travelers from "./Travelers";

const HomePage = () => {
  // State variables and functions for managing data
  const [dailyObjective, setDailyObjective] = useState('');
  const [guildNotifications, setGuildNotifications] = useState([]);
  const [partyNotifications, setPartyNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tavernNews, setTavernNews] = useState([]);

  // Function to handle submitting the daily objective
  /*const handleSubmitObjective = (e) => {
    e.preventDefault();
    // Fake PATCH request (replace with actual code to send data to the server)
    fetch('https://example.com/api/daily-objective', {
      method: 'PATCH',
      body: JSON.stringify({ objective: dailyObjective }),
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
    })
    .catch(error => {
      // Handle error (if needed)
      console.error('Error updating daily objective:', error);
    });
  };*/

  // useEffect to fetch initial data and update state

  return (
    <div className='Homepage-main-div'>
      <div className="Travelelers-homepage-div">
        <Travelers />
      </div>
      <div className="Homepage-content-div">
        {/* Div for setting daily objective */}
        <div className="Homepage-contents-divs"> 
          <h2>Set your daily objective</h2>
          <form //</div>onSubmit={handleSubmitObjective}>
          >
            <input
              type="text"
              value={dailyObjective}
              onChange={(e) => setDailyObjective(e.target.value)}
              placeholder="Enter your daily objective"
              className="Hompage-daily-input"
            />
            <button className="Hompage-daily-submit" type="submit">Confirm</button>
          </form>
        </div>

        {/* Div for Guild content */}
        <div className="Homepage-contents-divs">
          <h2>Guild Content</h2>
          {/* Display guild notifications or "WANT TO JOIN A GUILD?" */}
        </div>

        {/* Div for Party content */}
        <div className="Homepage-contents-divs">
          <h2>Party Content</h2>
          {/* Display party notifications or "Make a party with travelers" */}
        </div>

        {/* Div for finding travelers */}
        <div className="Homepage-contents-divs">
          <h2>Find Travelers</h2>
          {/* Search bar to find travelers */}
        </div>

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