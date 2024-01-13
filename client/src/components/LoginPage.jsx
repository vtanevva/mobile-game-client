import React, { useState } from 'react';
import { loginUser } from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

const Login = () => {
  const navigate = useNavigate(); // Get the navigate function from react-router-dom
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const result = await loginUser(username, password);
      console.log('Login successful:', result);
      // Redirect to the '/game' route upon successful login
      navigate('/game');
    } catch (error) {
      console.error('Login failed:', error.message);
      setError('Invalid, please try again.'); // Set error message for display
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <div class="overlay overlay-color">
      <div className="back-button"> <Link className="back-button-a" to="/">back </Link> </div>
      <h2 className="login-img"></h2>
      

      <form className="form form-login" onSubmit={handleLogin}>
      <label className="label">Username</label>
        <input
          className="form-username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />{' '}
        <br />
        <div className="password-input">
          <label className="label">Password</label>
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
        <div className="login-buttons">
          <button
            className=" login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>{' '}
          <br />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="group-down">
            <div className="or">
                Or
            </div>
            <div className="networks">
              <div className="network Google">

              </div>
              <div className="network Apple">

              </div>
              <div className="network Facebook">

              </div>
            </div>
          </div>
          <button className="button skip">
            <Link to="/register" className="grey-link">
              Don't have an acoount? <span className="span-login">Sign Up</span>
            </Link>
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default Login;
