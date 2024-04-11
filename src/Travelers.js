import React, { useState, useEffect } from "react";
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { Link } from "react-router-dom";

//MAKE A COMPANION REQUEST POP UP

const Travelers = ({UserData, setUserData}) => {
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [width, setWidth] = useState(130); // Initial width
  const [maxVisibleFriends, setMaxVisibleFriends] = useState(4); // Initial max visible friends

  useEffect(() => {
    // Fetch data here
    const fetchData = async () => {
      try {
        // Simulate fetching data
        const data = await fetchFriendsData(); // Assuming fetchFriendsData is a function to fetch friends data
        setFriends(data);
        setFilteredFriends(data.slice(0, maxVisibleFriends)); // Initially show only the first maxVisibleFriends friends
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle errors
      }
    };

    fetchData();
  }, [maxVisibleFriends]);

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
    setFilteredFriends(filtered.slice(0, maxVisibleFriends)); // Update filtered friends
  };

  // Function to handle showing more friends
  const handleShowMore = () => {
    setMaxVisibleFriends(maxVisibleFriends + 1); // Increase maxVisibleFriends
  };

  // Function to handle resizing
  const handleResize = (event, { size }) => {
    setWidth(size.width);
  };

  // Calculate maxVisibleFriends based on screen height
  useEffect(() => {
    const updateMaxVisibleFriends = () => {
      const windowHeight = window.innerHeight;
      if (windowHeight < 590) {
        setMaxVisibleFriends(2);
      }else if (windowHeight < 700) {
        setMaxVisibleFriends(3);
      } else if (windowHeight < 800) {
        setMaxVisibleFriends(4);
      } else {
        setMaxVisibleFriends(5);
      }
    };

    updateMaxVisibleFriends();

    // Update maxVisibleFriends when the window is resized
    window.addEventListener('resize', updateMaxVisibleFriends);

    return () => {
      window.removeEventListener('resize', updateMaxVisibleFriends);
    };
  }, []);

  return (
    <div className='Travelers-container'>
      <Resizable 
        width={width}
        height={100} 
        onResize={handleResize} 
        minConstraints={[100, 1000]} // Minimum width and height
        maxConstraints={[600, 10000]} // Maximum width and height
        resizeHandles={['ne']}
        style={{ position: 'relative', height: '85.5vh', top: 0 }}
      >
        <div className="Travelers-homepage-div" style={{ width }}>
          <Link to="/FindCompanions"><div className="Travelers-hompage-search-h2">Find Travelers</div></Link>
          <br></br>
          <div>Companion Requests: {UserData.CompanionRequest ? UserData.CompanionRequest.length : 0}</div>
          <br></br>
          <div className="Travelers-hompage-h2">Companions</div>
          <br></br>
          <input 
            style={{marginBottom: '5px'}}
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

export default Travelers;
