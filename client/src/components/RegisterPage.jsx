import React, { useState } from 'react';
import { registerUser } from '../api/api';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Set initial state to false
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleRegister = async (event) => {
    event.preventDefault()
    try {
      setLoading(true);
      setError(null);

      const result = await registerUser(username, password);
      console.log('User registered:', result);

      // Optionally, you can redirect the user to another page after successful registration
      // history.push('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error.message);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <div className="overlay overlay-color">
           <div className="back-button"> <Link className="back-button-a" to="/">back </Link> </div>
      <h2 className=" register-img"></h2>
      
    
      <form className="form form-register" onSubmit={handleRegister}>
      <label className="label">Email</label><input
        className="form-email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}

        />
            <label className="label">Username</label>

        <input
          className="form-username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />{' '}
        <br />
        <label className="label">Password</label>

        <div className="password-input">
          <input
            className="form-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
  className="toggle-password"
  type="button"
  onClick={handleTogglePassword}
>
  <i className={showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'}></i>
</button>

        </div>
        <br />
        <h5 className="reset"></h5>
        
        <button
          className="button register-button"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <div className="button skip">
       
        <div className="group-down group-down-r">
            <div className="or ">
                Or
            </div>
            <div className="networks networks-r">
              <div className="network Google">

              </div>
              <div className="network Apple">

              </div>
              <div className="network Facebook">

              </div>
            </div>
          </div>
          <button className="button sign-up-register">
            <Link to="/login" className="grey-link">
              Already have an acoount? <span className="span-login">Sign In</span>
            </Link>
          </button>
        
      </div>
      
      </div>
      
    </div>
  );
};

export default Register;
