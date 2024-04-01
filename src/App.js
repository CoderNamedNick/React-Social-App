import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Login";
import SignUpPage from "./Signup";
import HomePage from "./Homepage";
import Header from "./Header";
//MAKE A FETCH CUSTOM HOOK FOR USER DATA

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [signup, setSignup] = useState(false);

  

  const handleSignupClick = () => {
    setSignup(true);
  };

  const handleLogin = () => {
    setLoggedIn(true);
    //USE FETCH HOOK HERE
  };

  return (
    <BrowserRouter>
      <div className="App">
        {loggedIn && ( <Header/>  )}
          <div>
            {!signup && !loggedIn && (
              <Routes>
                <Route path="/" element={<LoginPage onSignupClick={handleSignupClick} onLogin={handleLogin} />} />
              </Routes>
            )}
            {signup && !loggedIn && (
              <Routes>
                <Route path="/SignUp" element={<SignUpPage onSignupSuccess={handleLogin} />} />
              </Routes>
            )}
            {loggedIn && (
              <Routes>
                <Route path="/HomePage" element={<HomePage />} />
              </Routes>
            )}
          </div>
      </div>
    </BrowserRouter>
  );
}

export default App;