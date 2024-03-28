import React, { useState, useEffect } from "react";
//import { Link } from "react-router-dom";

const SignUpPage = () => {
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
      <div className="Login-square">
        <h2>SUPER COOL NAME OF SITE</h2>
        <br></br>
        <input type="text" placeholder="Email"></input>
        <input type="password"placeholder="Pasword"></input>
        <h2>LOG IN</h2>
        <p>or</p>
        <h3>Sign Up</h3>
      </div>
      <button>Click to see db</button>
      <p>{message}</p> {/* Display the message from backend */}
    </div>
  )
}

export default SignUpPage;