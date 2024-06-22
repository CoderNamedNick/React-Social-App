import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpPage({ onSignupSuccess, UserData, setUserData }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthdate: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const acceptedDomains = [
    'gmail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in', 'outlook.com', 
    'hotmail.com', 'live.com', 'msn.com', 'aol.com', 'icloud.com', 'me.com', 
    'mac.com', 'zoho.com', 'mail.com', 'yandex.com', 'protonmail.com', 
    'gmx.com', 'mail.ru', 'comcast.net', 'att.net', 'verizon.net', 
    'yahoo.co.jp', 'lycos.com', 'fastmail.com', 'hushmail.com', '123.com'
  ];

  const inappropriateWords = [
    "asshole","assh0le", "assh01e","assho1e", "a55hole", "a55h0le", "a55h01e",
    "a55ho1e", "ba5tard", "b1tch", "bullsh1t", "bu11shit", "bu11sh1t", "bu1lsh1t",
    "d1ck", "d0uche", "m0therfucker", "vigger", "nigga", "n1gger", "ni99er", "ni9ger",
    "nig9er", "n199er", "n1g9er", "n19ger", "p1ss", "p155", "p15s", "p1s5", "pi55", "pi5s",
    "pis5", "pr1ck", "pu5sy", "pu55y", "pus5y", "pus5", "pu55", "pu5s", "sh1t", "s1ut",
    "wh0re", "bastard", "bitch", "bullshit", "cunt", "cum", "cummer", "cun7",
    "damn", "dick", "douche", "fuck", "fucker", "motherfucker", "nigger", "piss", 
    "prick", "puss", "pussy","retard", "shit", "slut", "twat", "whore", "wanker", "jerker",
    "faggot", "fagg0t", "fag", "queer",  "dyke", "killyourself", 
    "k1llyourself", "k1lly0urself", "k1lly0urse1f", "killy0urself", "killy0urse1f", "k1llyourse1f",
    "a5shole", "a5sh0le", "a5sh01e", "a5sho1e", "4sshole", "4ssh0le", "4ssh01e", "4ssho1e",
    "blowjob", "b10wjob", "bl0wjob", "bl0wj0b", "b10wj0b", "blowj0b", "bl0wj0b",
    "cocksucker", "c0cksucker", "c0cksuck3r", "c0cksuckr", "c0cksuck", "cocksuck3r", "c0cksucker",
    "c0cksuck", "f4ggot", "f4g", "qu33r", "d1ckhead", "d1ckh3ad", "d1ckhed", "dickhead", "dickh3ad", 
    "dickhed", "jackass", "jack@ss", "j@ckass", "j@ck@ss", "jerkoff", "jerk0ff", "j3rkoff", "j3rk0ff", 
    "masturbate", "m@sturbate", "m@stur8", "m@sturb8", "masturb8", "mastur8", "motherfucker", 
    "moth3rfucker", "m0therfucker", "m0th3rfucker", "phuck", "phucker", "phuk", "p00p", "p0rn", 
    "porn", "pr0n", "rap3", "r@pe", "r@p3", "suck", "sh1thead", "sh1th3ad", "sh1thad", "shithe@d", 
    "shith3ad", "shithad", "t1t", "t1ts", "tit", "tits", "vagina", "vaj1na", "vajina", "vag1na", 
    "vajayjay", "va-jay-jay", "vaj@yjay", "wh0r3", "whore", "wh0r", "whor", "wank3r", "wank", 
    "w4nk", "wanker", "w4nker"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateEmail = (email) => {
    const emailParts = email.toLowerCase().split('@');
    if (emailParts.length !== 2) return false;

    const domain = emailParts[1];
    return acceptedDomains.includes(domain);
  };

  const validateUsername = (username) => {
    const specialCharsRegex = /[^a-zA-Z0-9]/;
    const containsInappropriateWords = inappropriateWords.some(word => username.toLowerCase().includes(word));
    const containsSpecialChars = specialCharsRegex.test(username);
    
    if (containsInappropriateWords) {
      return 'Username contains inappropriate content';
    }
    if (containsSpecialChars) {
      return 'Username should not contain special characters';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Username length validation
    if (formData.username.length < 4 || formData.username.length > 16) {
      setErrors({ username: 'Must be between 4 and 16 characters' });
      return;
    }

    // Username appropriateness validation
    const usernameValidationError = validateUsername(formData.username);
    if (usernameValidationError) {
      setErrors({ username: usernameValidationError });
      return;
    }

    // Password length validation
    if (formData.password.length < 6) {
      setErrors({ password: 'Password must be more than 6 characters' });
      return;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    // Email validation using regular expression and domain validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email) || !validateEmail(formData.email)) {
      setErrors({ email: 'Invalid email address' });
      return;
    }

    // If all validations pass, you can submit the form data
    try {
      const response = await fetch('http://localhost:5000/Users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email.toLowerCase(),
          password: formData.password,
          birthDate: formData.birthdate,
          bio: "",
          dailyObj: ""
        })
      });

      if (!response.ok) {
        // Handle error response
        throw new Error('Sign up request failed');
      }

      // Assuming successful sign up
      const newUser = await response.json(); // Assuming server returns the created user data
      console.log('Sign up successful');

      // Update UserData state with the new user
      setUserData(newUser);
      onSignupSuccess();
      navigate('/HomePage');
    } catch (error) {
      console.error('Error during sign up:', error);
      // Handle error, maybe display a message to the user
    }
  };

  return (
    <div className='main-login-page-div'>
      <div className="signup-square">
        <h2 className='medievalsharp-regular'>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className='signup-labels' htmlFor="username">Username:</label><br />
            <input 
              placeholder='4-16 Characters' 
              className='signup-inputs' 
              type="text" 
              id="username" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              required 
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          <div>
            <label className='signup-labels' htmlFor="email">Email:</label><br />
            <input 
              placeholder='CoolApp@123.com' 
              className='signup-inputs' 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div>
            <label className='signup-labels' htmlFor="password">Password:</label><br />
            <input 
              placeholder='*********' 
              className='signup-inputs' 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div>
            <label className='signup-labels' htmlFor="confirmPassword">Confirm Password:</label><br />
            <input 
              placeholder='*********' 
              className='signup-inputs' 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
            />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label className='signup-labels' htmlFor="birthdate">Date of Birth:</label><br />
            <input 
              className='signup-inputs' 
              type="date" 
              id="birthdate" 
              name="birthdate" 
              value={formData.birthdate} 
              onChange={handleChange} 
              required 
            />
          </div>

          <button className='signup-submit-btn medievalsharp-regular' type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;