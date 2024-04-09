import React, { useState, useEffect } from "react";

const FindTravelers = ({UserData, setUserData}) => {
  const [companions, setCompanions] = useState([]);
  const [filteredCompanions, setFilteredCompanions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const fakeTravelers = [
    {
      _id: "1",
      username: "John Doe",
      dailyObj: "Complete tasks",
      AccDate: "2022-04-01T00:00:00.000Z"
    },
    {
      _id: "2",
      username: "Jane Smith",
      dailyObj: "Exercise",
      AccDate: "2022-03-15T00:00:00.000Z"
    },
    {
      _id: "3",
      username: "Alice Johnson",
      dailyObj: "Read a book",
      AccDate: "2022-03-20T00:00:00.000Z"
    },
    {
      _id: "4",
      username: "Bob Anderson",
      dailyObj: "Cook a new recipe",
      AccDate: "2022-03-10T00:00:00.000Z"
    },
    {
      _id: "5",
      username: "Emily Wilson",
      dailyObj: "Learn something new",
      AccDate: "2022-03-25T00:00:00.000Z"
    }
  ];
  // make a grid of already make friends 
  //make a grid of findable poeple with the get all but priotise people with age closest to user
  // have grid items show Username, Daliy, and accdate for now
  // make other component for other travelers profiles books

  useEffect(() => {
    setCompanions(fakeTravelers); // later make this UserData.Travelers
    setFilteredCompanions(fakeTravelers);
  }, []);

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterCompanions(term);
  };

  const filterCompanions = (term) => {
    const filtered = companions.filter((companion) =>
      companion.username.toLowerCase().includes(term.toLowerCase())
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
  console.log(UserData)

  return (
    <div className="Find-travelers-main-div">
      <h1>Current Companions</h1>
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
            <div key={companion._id || companion.id} className="companion-item">
              <p>{companion.username}</p>
              <p>{companion.dailyObj}</p>
              <p>{companion.AccDate ? companion.AccDate.substring(0, 10) : ''}</p>
            </div>
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
        <div> {/*Get all and then filter with findable accounts Also A grid*/}
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default FindTravelers;
