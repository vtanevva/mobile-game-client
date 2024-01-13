// HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';


function HomePage() {
  return (
    <div class="homepage">
       <div className="home-image"></div>
       <h2 className='homepage-title'>Let's Get Started</h2>

       <div className="buttons">
       <Link to="/register" className=" sign-up-home">Sign Up</Link>
       <button className=" skip">
            <Link to="/login" className="grey-link grey-link-home">
              Aready have an account? <span className="span-login"> Log in</span>            </Link>
          </button>
 
       </div>
    </div>
    
  );
}

export default HomePage;