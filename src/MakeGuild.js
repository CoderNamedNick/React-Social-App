import React from "react";

const MakeGuild = ({UserData, setUserData}) => {

  return(
    <div>
      <h1>What Is A Guild</h1>
      <p>
        A guild is a place you and others around the world can join together to
        communicate and share the stories of your travels. Upon making a guild, you become the "Guild Master" responsible for your cohorts and your community. You have the power to shape your guild however you choose.
      </p>
      <div>
        <h1>Guild Registry</h1>
        <form action="/create-guild" method="POST">
          <label htmlFor="guildName">Guild Name:</label>
          <input type="text" id="guildName" name="guildName" required />

          <label htmlFor="guildOwner">Guild Owner:</label>
          <input type="text" id="guildOwner" name="guildOwner" required />

          <label htmlFor="guildElders">Guild Elders:</label>
          <input type="text" id="guildElders" name="guildElders" />

          <label htmlFor="bio">Bio:</label>
          <textarea id="bio" name="bio" required></textarea>

          <label htmlFor="guildColor">Guild Color:</label>
          <input type="text" id="guildColor" name="guildColor" />

          <label htmlFor="requestToJoin">Allow Request to Join:</label>
          <input type="checkbox" id="requestToJoin" name="requestToJoin" defaultChecked />

          <label htmlFor="findable">Findable:</label>
          <input type="checkbox" id="findable" name="findable" defaultChecked />

          <button type="submit">Create Guild</button>
        </form>
      </div>
    </div>
  )
}

export default MakeGuild;