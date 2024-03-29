import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const LoginPage = ({onSignupClick}) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch message from backend when component mounts
    fetch('http://localhost:5000/api/message')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching message:', error));
  }, []);

  return (
    <div className="main-login-page-div">
      <h2>SUPER COOL NAME OF SITE</h2>
      <div className="Login-square">
        <br/>
        <input className="LoginBars" type="text" placeholder="Email"></input>
        <input className="LoginBars" type="password"placeholder="Pasword"></input>
        <h2 className="loginlink">LOG IN!</h2>
        <p className="new-p-login">New? <Link to="/SignUp"><span className="signuplink" onClick={onSignupClick}>Sign Up</span></Link></p>
      </div>
      <p>{message}</p> {/* Display the message from backend */}
    </div>
  )
}

export default LoginPage;