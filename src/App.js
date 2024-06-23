import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Login";
import SignUpPage from "./Signup";
import HomePage from "./Homepage";
import Header from "./Header";
import ProfileBook from './ProfileBook'
import FindTravelers from "./FindTravelers";
import TravelersBooks from "./TravelerBooks";
import BlockList from "./BlockList";
import CompanionReq from "./CompanionReq";
import MakeGuild from "./MakeGuild";
import AllGuilds from "./AllGuilds";
import JoinAGuild from "./JoinAGuild";
import Conversations from "./Conversations";
import Messages from "./Messages";
import GuildPages from "./GuildPages"
import TavernNews from "./TavernNews";
import FormAParty from "./FormAParty";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [signup, setSignup] = useState(false);
  const [UserData, setUserData] = useState({});
  const [ClickedConvo, setClickedConvo] = useState(null);
  const [clickedGuild, setclickedGuild] = useState(null);

  const handleSignupClick = () => {
    setSignup(true);
  };

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const LogOut = () => {
    setLoggedIn(false);
    setSignup(true);
  };

  return (
    <BrowserRouter>
      <div className="App">
        {loggedIn &&   (
          <Header
            UserData={UserData}
            setUserData={setUserData}
            LogOut={LogOut}
            clickedGuild={clickedGuild}
            setclickedGuild={setclickedGuild}
          />
        )}
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
              <Route path="/HomePage" element={<HomePage UserData={UserData} setUserData={setUserData} />} />
              <Route path="/ProfileBook" element={<ProfileBook UserData={UserData} setUserData={setUserData} />} />
              <Route path="/FindCompanions" element={<FindTravelers UserData={UserData} setUserData={setUserData} />} />
              <Route path="/Companion-Request" element={<CompanionReq UserData={UserData} setUserData={setUserData} />} />
              <Route path="/Block-List" element={<BlockList UserData={UserData} setUserData={setUserData} />} />
              <Route path="/user/:username" element={<TravelersBooks UserData={UserData} setUserData={setUserData} />} />
              <Route path="/Guild-Registry" element={<MakeGuild UserData={UserData} setUserData={setUserData} />} />
              <Route path="/All-Guilds" element={<AllGuilds UserData={UserData} setUserData={setUserData} clickedGuild={clickedGuild} setclickedGuild={setclickedGuild} />} />
              <Route path="/Join-Guild" element={<JoinAGuild UserData={UserData} setUserData={setUserData} />} />
              <Route path="/Conversations" element={<Conversations UserData={UserData} setUserData={setUserData} ClickedConvo={ClickedConvo} setClickedConvo={setClickedConvo} />} />
              <Route path="/Messages" element={<Messages UserData={UserData} setUserData={setUserData} ClickedConvo={ClickedConvo} setClickedConvo={setClickedConvo} />} />
              <Route path="/Form-A-Party" element={<FormAParty UserData={UserData} setUserData={setUserData}/>} />
              <Route path="/GuildPages" element={<GuildPages UserData={UserData} setUserData={setUserData} clickedGuild={clickedGuild} setclickedGuild={setclickedGuild} />} />
              <Route path="/Tavern-News" element={<TavernNews UserData={UserData} setUserData={setUserData} />} />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;