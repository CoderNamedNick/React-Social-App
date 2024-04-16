import React from "react";

const MakeGuild = ({ UserData, setUserData }) => {

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
      <div>
        <h1 style={{ textAlign: 'center' }}>Guild Registry</h1>
        <form action="/create-guild" method="POST" className="Guild-form">
          <label htmlFor="guildName">Guild Name:</label>
          <input style={{textAlign: 'center', width: '40%'}} maxLength={22} className="Guild-inputs" type="text" id="guildName" name="guildName" required />

          <label htmlFor="guildMoto">Guild Moto "What Is Your Guilds Purpose": 50 char. max</label>
          <input maxLength={45} className="Guild-inputs" type="text" id="guildOwner" name="guildOwner" required />

          <label htmlFor="bio">Bio:</label>
          <textarea style={{width: '210px', height: '100px', resize: 'none' }} id="bio" name="bio" required></textarea>

          <label htmlFor="guildColor">Guild Color:</label>
          <select id="guildColor" name="guildColor">
            <option value="blue">Blue</option>
            <option value="red">Red</option>
            <option value="orange">Orange</option>
            <option value="yellow">Yellow</option>
            <option value="grey">Grey</option>
            <option value="purple">Purple</option>
            <option value="green">Green</option>
          </select>

          <label htmlFor="requestToJoin">How To Join:</label>
          <select id="requestToJoin" name="requestToJoin">
            <option value="open">Open To All</option>
            <option value="request">Request To Join</option>
          </select>

          <label htmlFor="findable">Findable:</label>
          <input type="checkbox" id="findable" name="findable" defaultChecked />

          <button className="Make-guild-btn" type="submit">Create Guild</button>
        </form>
      </div>
    </div>
  )
}

export default MakeGuild;