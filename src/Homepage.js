import React, { useState, useEffect } from "react";

const HomePage = () => {
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch data here
    const fetchData = async () => {
      try {
        // Simulate fetching data
        const data = await fetchFriendsData(); // Assuming fetchFriendsData is a function to fetch friends data
        setFriends(data);
        setFilteredFriends(data); // Initialize filtered friends with all friends
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle errors
      }
    };

    fetchData();
  }, []);

  // Function to simulate fetching friends data
  const fetchFriendsData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulated data
        const friendsData = [
          { name: "Friend 1", dailyObjectives: "Objective 1" },
          { name: "Friend 2", dailyObjectives: "Objective 2" },
          { name: "Friend 3", dailyObjectives: "Objective 3" },
          { name: "Friend 4", dailyObjectives: "Objective 4" },
          { name: "Friend 5", dailyObjectives: "Objective 5" },
          // Add more data as needed
        ];
        resolve(friendsData);
      }, 1000); // Simulating delay of 1 second
    });
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    filterFriends(event.target.value);
  };

  // Filter friends based on search term
  const filterFriends = (searchTerm) => {
    const filtered = friends.filter((friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFriends(filtered);
  };

  return (
    <div className='Homepage-main-div'>
      <div className="Travelers-homepage-div">
        <h3>Search known Travelers</h3>
        <input 
          type="text" 
          value={searchTerm} 
          onChange={handleSearchChange} 
          placeholder="Search by name" 
        />
        <h2>Known Travelers</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          filteredFriends.map((friend, index) => (
            <div key={index} className="Travelers-hompage-info">
              <p>{friend.name}</p>
              <p>{friend.dailyObjectives}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;