import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Login";
import SignUpPage from "./Signup";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [signup, setSignup] = useState(false);

  const handleSignupClick = () => {
    setSignup(true);
  };

  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    <BrowserRouter>
      <div className="App">
        {!signup && !loggedIn && (
          <Routes>
            <Route path="/" element={<LoginPage onSignupClick={handleSignupClick} onLogin={handleLogin} />} />
          </Routes>
        )}
        {signup && !loggedIn && (
          <Routes>
            <Route path="/" element={<SignUpPage onSignupSuccess={handleLogin} />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;