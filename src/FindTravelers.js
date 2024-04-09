import React from "react";

const FindTravelers = ({UserData, setUserData}) => {
  // make a grid of already make friends 
  //make a grid of findable poeple with the get all but priotise people with age closest to user
  // have grid items show Username, Daliy, and accdate for now
  // make other component for other travelers profiles books

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
    <div>
      <div>
        <h1>Current Companions</h1>
        <div> {/*this will be a grid of companions */}
        {UserData.travelers.map(Traveler => (
          <div key={Traveler._id || Traveler.id}>
            <p>{Traveler.username}</p>
            <p>{Traveler.dailyObj}</p>
            <p>{Traveler.AccDate}</p>
          </div>
        ))}
        </div>
      </div>
      <div>
        {UserData.AccPrivate ? (
          <div>
            Your Account is Currently Private.{" "}
            <span onClick={() => handleAccPrivChange(false)}>Make Account Findable</span>
          </div>
        ) : (
          <div>
            Your Account is Currently Findable.{" "}
            <span onClick={() => handleAccPrivChange(true)}>Make Account Private</span>
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
