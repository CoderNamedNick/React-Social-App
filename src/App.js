import React, { useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./Login";
import SignUpPage from "./Signup";
import HomePage from "./Homepage";
import Header from "./Header";
import ProfileBook from './ProfileBook'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [signup, setSignup] = useState(false);
  const [UserData, setUserData] = useState({})
  //Make usestate to handle fecth and save in state variable to then pass it down

  const handleSignupClick = () => {
    setSignup(true);
  };

  const handleLogin = () => {
    setLoggedIn(true);
    //USE FETCH HOOK HERE
  };
  const LogOut = () => {
    setLoggedIn(false);
  }

  return (
    <BrowserRouter>
      <div className="App">
        {loggedIn && <Header LogOut={LogOut}/>}
        <div>
          {!signup && !loggedIn && (
            <Routes>
              <Route
                path="/"
                element={<LoginPage onSignupClick={handleSignupClick} onLogin={handleLogin} UserData={UserData} setUserData={setUserData} />}
                exact
              />
            </Routes>
          )}
          {signup && !loggedIn && (
            <Routes>
              <Route
                path="/SignUp"
                element={<SignUpPage onSignupSuccess={handleLogin} UserData={UserData} setUserData={setUserData} />}
              />
              <Route
                path="/Login"
                element={<LoginPage onSignupClick={handleSignupClick} onLogin={handleLogin} UserData={UserData} setUserData={setUserData} />}
                exact
              />
            </Routes>
          )}
          {loggedIn && (
            <Routes>
              <Route path="/HomePage" element={<HomePage UserData={UserData} setUserData={setUserData}/>} />
              <Route path="/ProfileBook" element={<ProfileBook UserData={UserData} setUserData={setUserData}/>} />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;