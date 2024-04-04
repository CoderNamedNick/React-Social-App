import React, { useState } from "react";


const ProfileBook = () => {
 // Use Prop from app to disply User data
 //if on other persons profile ur id params to get there info and with a fetch method

 // when edit pfp is clicked firsrt make input boxes for bio, daily, and maybe UserName then make a patch request with new info

  // if id of person is eqaul top user id then give option to edit 

  //loop through persons guild array to use for persons entered guilds

  return( 
    <div>
      <div>
        <div className="travelors-info-div">
          <div className="Traveler-Pic">PROFILE PIC</div>
          <div className="Traveler-Info">
            <h1>UserName</h1>
            <h2>Daily Obj</h2>
            <div className="Traveler-Bio">
              Bio
            </div>
            <p>Traveler Since: adadadad</p>
          </div>
          <h4 className="Edit-PB">Edit ProfileBook</h4>
        </div>
        <br></br>
        <br></br>
        <div className="ProfileBook-guilds-div">
          <h2>Guilds Traveler is part of</h2>
          {/*loop through user.Guilds array and then display guilds in this format */}
          <div className="PB-guilds-div">
            <div style={{paddingLeft: '20px',}}>
              <h1 className="PB-guilds-name">GuildName</h1>
              <h5># of guild Members</h5>
            </div>
            <p>Guild Bio</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileBook;