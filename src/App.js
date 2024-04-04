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
                element={<LoginPage onSignupClick={handleSignupClick} onLogin={handleLogin} />}
                exact
              />
            </Routes>
          )}
          {signup && !loggedIn && (
            <Routes>
              <Route
                path="/SignUp"
                element={<SignUpPage onSignupSuccess={handleLogin} />}
              />
              <Route
                path="/Login"
                element={<LoginPage onSignupClick={handleSignupClick} onLogin={handleLogin} />}
                exact
              />
            </Routes>
          )}
          {loggedIn && (
            <Routes>
              <Route path="/HomePage" element={<HomePage />} />
              <Route path="/ProfileBook" element={<ProfileBook />} />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;