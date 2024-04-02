import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpPage({onSignupSuccess}) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthdate: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Username length validation
    if (formData.username.length < 4 || formData.username.length > 16) {
      setErrors({ username: 'Must be between 4 and 16 characters' });
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

    // Email validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors({ email: 'Invalid email address' });
      return;
    }

    // Additional validation logic can be added here

    // If all validations pass, you can submit the form data
    console.log('Form submitted:', formData);
    onSignupSuccess()
    navigate('/HomePage')
  };

  return (
    <div className='main-login-page-div'>
      <div className="signup-square">
        <h2 className='medievalsharp-regular'>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className='signup-labels' htmlFor="username">Username:</label><br />
            <input placeholder='4-16 Characters' className='signup-inputs' type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          <div>
            <label className='signup-labels' htmlFor="email">Email:</label><br />
            <input placeholder='CoolApp@123.com' className='signup-inputs' type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div>
            <label className='signup-labels' htmlFor="password">Password:</label><br />
            <input placeholder='*********' className='signup-inputs' type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div>
            <label className='signup-labels' htmlFor="confirmPassword">Confirm Password:</label><br />
            <input placeholder='*********' className='signup-inputs' type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label className='signup-labels' htmlFor="birthdate">Date of Birth:</label><br />
            <input className='signup-inputs' type="date" id="birthdate" name="birthdate" value={formData.birthdate} onChange={handleChange} required />
          </div>

          <button className='signup-submit-btn medievalsharp-regular' type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;