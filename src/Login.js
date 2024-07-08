import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from './images/Tavern-logo.png';

const LoginPage = ({ onSignupClick, onLogin, UserData, setUserData }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const acceptedDomains = [
    'gmail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in', 'outlook.com', 
    'hotmail.com', 'live.com', 'msn.com', 'aol.com', 'icloud.com', 'me.com', 
    'mac.com', 'zoho.com', 'mail.com', 'yandex.com', 'protonmail.com', 
    'gmx.com', 'mail.ru', 'comcast.net', 'att.net', 'verizon.net', 
    'yahoo.co.jp', 'lycos.com', 'fastmail.com', 'hushmail.com', '123.com'
  ];

  const handleEmailChange = (e) => {
    const lowerCaseEmail = e.target.value.toLowerCase();
    setEmail(lowerCaseEmail);
  };

  const validateEmail = (email) => {
    const emailParts = email.split('@');
    if (emailParts.length !== 2) return false;

    const domain = emailParts[1];
    return acceptedDomains.includes(domain);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address from accepted domains');
      return;
    }

    try {
      const response = await fetch('https://tavern-backend-8tu5.onrender.com/Users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setMessage('Login successful');
        const userData = await response.json();
        setUserData(userData.user);

        onLogin();

        navigate('/HomePage');
      } else {
        setMessage('Incorrect email or password');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred, please try again later');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="main-login-page-div">
      <img src={Logo} alt="TAVERN"></img>
      <div className="Login-square">
        <br/>
        <input 
          className="LoginBars" 
          type="text" 
          placeholder="Email" 
          value={email} 
          onChange={handleEmailChange} 
          onKeyDown={handleKeyDown}
        />
        <input 
          className="LoginBars" 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          onKeyDown={handleKeyDown}
        />
        <h2 className="loginlink medievalsharp-regular" onClick={handleLogin}>LOG IN!</h2>
        <p className="new-p-login medievalsharp-regular">New? <Link to="/SignUp"><span className="signuplink" onClick={onSignupClick}>Sign Up</span></Link></p>
      </div>
      <p>{message}</p> 
    </div>
  )
}

export default LoginPage;