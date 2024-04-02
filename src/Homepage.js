import React, { useState, useEffect } from "react";
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

const HomePage = () => {
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [width, setWidth] = useState(250); // Initial width

  useEffect(() => {
    // Fetch data here
    const fetchData = async () => {
      try {
        // Simulate fetching data
        const data = await fetchFriendsData(); // Assuming fetchFriendsData is a function to fetch friends data
        setFriends(data);
        setFilteredFriends(data.slice(0, 5)); // Initially show only the first 5 friends
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
          { name: "Friend 6", dailyObjectives: "Objective 6" },
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
    setFilteredFriends(filtered.slice(0, 5)); // Update filtered friends, but only show first 5
  };

  // Function to handle showing more friends
  const handleShowMore = () => {
    setFilteredFriends(friends.slice(0, filteredFriends.length + 5));
    setShowMore(filteredFriends.length + 5 < friends.length);
  };

  // Function to handle resizing
  const handleResize = (event, { size }) => {
    setWidth(size.width);
  };

  return (
    <div className='Homepage-main-div'>
      <Resizable 
        width={width}
        height={100} 
        onResize={handleResize} 
        minConstraints={[100, 1000]} // Minimum width and height
        maxConstraints={[600, 10000]} // Maximum width and height
        resizeHandles={['ne']}
        style={{ position: 'absolute', top: 108, left: 0, bottom: 0 }}
      >
        <div className="Travelers-homepage-div" style={{ width }}>
          <div className="Travelers-hompage-search-h2">Search known Travelers</div>
          <input 
            type="text" 
            value={searchTerm} 
            onChange={handleSearchChange} 
            placeholder="Search by name"
            className="Travelers-hompage-search" 
          />
          <div className="Travelers-hompage-h2">Known Travelers</div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {filteredFriends.map((friend, index) => (
                <div key={index} className="Travelers-hompage-info">
                  <p>{friend.name}</p>
                  <p>{friend.dailyObjectives}</p>
                </div>
              ))}
              {showMore && <button onClick={handleShowMore}>Show More</button>}
            </>
          )}
        </div>
      </Resizable>
    </div>
  );
};

export default HomePage;