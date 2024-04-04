import React, { useState } from "react";


const ProfileBook = () => {
 // Use Prop from app to disply User data
 //if on other persons profile ur id params to get there info and with a fetch method

  return( 
    <div>
      <div>
        <div className="Traveler-Pic">PROFILE PIC</div>
        <div className="Traveler-Info">
          <h2>UserName</h2>
          <h3>Daily Obj</h3>
          <p>Bio</p>
          <p>Traveler Since: adadadad</p>
        </div>
        <div>
          <h2>Guilds Traveler is part of</h2>
          {/*loop through user.Guilds array and then display guilds in this format */}
          <div>
            <h3>GuildName</h3>
            <h5># of guild Members</h5>
            <p>Guild Bio</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileBook;