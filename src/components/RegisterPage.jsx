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
  const [showPassword, setShowPassword] = useState(false); 
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
           <Link to="/game"><h2 className=" register-img"></h2></Link>
      
    
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

        {error && <p style={{ color: 'red', position: 'absolute', top:'47vh', left:'7.3vh' }}>{error}</p>}
      </form>

      <div className="button skip">
       
        <div className="group-down group-down-register">
            <div className="or-register">
                Or
            </div>
            <div className="networks networks-register">
              <div className="network Google">

              </div>
              <div className="network Apple">

              </div>
              <div className="network Facebook">

              </div>
            </div>
          </div>
          <button className="button sign-up-register">
            <div className="grey-link grey-link-register">
              Already have an acoount? <Link to="/login"> <span className="span-login">Sign In </span></Link>
            </div>
          </button>
        
      </div>
      
      </div>
      
    </div>
  );
};

export default Register;
