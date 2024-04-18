import React, { useState } from "react";

const MakeGuild = ({ UserData, setUserData }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [GuildMade, setGuildMade] = useState(false);
  const [formData, setFormData] = useState({
    guildName: "",
    guildMoto: "",
    bio: "",
    guildColor: "blue",
    RequestToJoin: false,
    Findable: true,
  });

  const handleChange = (e) => {
    const { name, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : e.target.value;
    // Convert 'true' and 'false' strings to actual boolean values
    const finalValue = newValue === 'true' ? true : newValue === 'false' ? false : newValue;
    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSubmit = async (e) => {
    if (UserData.guildsOwned.length === 3) {
      setErrorMessage('Sorry you already own 3 Guilds')
      return
    }
    console.log(formData)
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/Guilds/${UserData.id || UserData._id}/Make-Guild`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
  
      const data = await response.json(); // assuming the response includes both user and guild data
      console.log('Guild created:', data.guild);
  
      // Update UserData with the user data from the response
      setUserData(data.user);
      setGuildMade(true)
    } catch (error) {
      console.error('Error creating guild:', error.message);
      setErrorMessage(`${error.message}`)
      // Handle error, display message to the user, etc.
    }
  };

  return (
    <div className="Guild-reg-main-div">
      <h1 style={{ paddingTop: '108px' }}>What Is A Guild</h1>
      <p className="make-guild-p" style={{ width: '80%', textAlign: 'center' }}>
        A guild is a place you and others around the world can join together to
        communicate and share the stories of your travels. Upon making a guild, you become the "Guild Master" responsible for your cohorts and your community.
        You have the power to shape your guild however you choose. 
        <br/>
        <br/>
        You can only be a "Guild Master" of up to 3 guilds.
      </p>
      {!GuildMade && (
      <div>
        <h1 style={{ textAlign: 'center' }}>Guild Registry</h1>
        <form onSubmit={handleSubmit} className="Guild-form">
          <h2 style={{color: 'red'}}>{errorMessage}</h2>

          <label htmlFor="guildName">Guild Name:</label>
          <input
            style={{ textAlign: 'center', width: '40%' }}
            maxLength={22}
            className="Guild-inputs"
            type="text"
            id="guildName"
            name="guildName"
            value={formData.guildName}
            onChange={handleChange}
            required
          />

          <label htmlFor="guildMoto">Guild Moto "What Is Your Guilds Purpose": 50 char. max</label>
          <input
            maxLength={45}
            className="Guild-inputs"
            type="text"
            id="guildMoto"
            name="guildMoto"
            value={formData.guildMoto}
            onChange={handleChange}
            required
          />

          <label htmlFor="bio">Bio:</label>
          <textarea
            style={{ width: '210px', height: '100px', resize: 'none' }}
            id="bio"
            name="bio"
            maxLength={115}
            value={formData.bio}
            onChange={handleChange}
            required
          ></textarea>

          <label htmlFor="guildColor">Guild Color:</label>
          <select
            id="guildColor"
            name="guildColor"
            value={formData.guildColor}
            onChange={handleChange}
          >
            <option value="blue">Blue</option>
            <option value="red">Red</option>
            <option value="orange">Orange</option>
            <option value="yellow">Yellow</option>
            <option value="grey">Grey</option>
            <option value="purple">Purple</option>
            <option value="green">Green</option>
          </select>

          {/* I want this to send a true if request to join and false if open to all  */}
          <label htmlFor="RequestToJoin">Send Request To Join:</label>
          <input
          type="checkbox"
            id="RequestToJoin"
            name="RequestToJoin"
            value={formData.RequestToJoin}
            onChange={handleChange}
          />

          <label htmlFor="Findable">Findable:</label>
          <input
            type="checkbox"
            id="Findable"
            name="Findable"
            checked={formData.Findable}
            onChange={handleChange}
          />

          <button className="Make-guild-btn" type="submit">Create Guild</button>
        </form>
      </div>
      )}
      {GuildMade && (
        <div>
          <h1>{formData.guildName} Has Been Made</h1>
          <br/>
          <br/>
          <br/>
          <h3 style={{textAlign: 'center', cursor: 'pointer'}}> Go To Guild Page </h3> 
        </div>
      )}
    </div>
  )
}

export default MakeGuild;