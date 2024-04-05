import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from './images/Tavern-logo.png'

const LoginPage = ({ onSignupClick, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = () => {
    // Send a POST request to your backend server with user credentials
    fetch('http://localhost:5000/Users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    .then(response => {
      if (response.ok) {
        // If response is OK, user is authenticated
        setMessage('Login successful');
        onLogin();
        // Navigate to home page
        navigate('/HomePage');
      } else {
        // If response is not OK, handle error
        setMessage('Incorrect email or password');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setMessage('An error occurred, please try again later');
    });
  };

  return (
    <div className="main-login-page-div">
      <img src={Logo} alt="TAVERN"></img>
      <div className="Login-square">
        <br/>
        <input className="LoginBars" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <input className="LoginBars" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <h2 className="loginlink medievalsharp-regular" onClick={handleLogin}>LOG IN!</h2>
        <p className="new-p-login medievalsharp-regular">New? <Link to="/SignUp"><span className="signuplink" onClick={onSignupClick}>Sign Up</span></Link></p>
      </div>
      <p>{message}</p> {/* Display the message from backend */}
    </div>
  )
}

export default LoginPage;