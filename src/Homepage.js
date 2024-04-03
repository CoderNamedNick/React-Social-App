import React, { useState, useEffect } from "react";
import Travelers from "./Travelers";

const HomePage = () => {

  return (
    <div className='Homepage-main-div'>
      <div className="Travelelers-hompage-div">
        <Travelers />
      </div>
      <div className="Homepage-content-div">
        MAIN CONTENT
      </div>
    </div>
  );
};

export default HomePage;