// // App.jsx

// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import LoginPage from './components/LoginPage';
// import RegisterPage from './components/RegisterPage';
// import HomePage from './components/HomePage';
// import Game from './components/Game';
// function App() {
//   return (
// //     <Router>
// //       <Routes>
// //       {/* Registration Page */}
// //       <Route path="/register" component={RegisterPage} />

// //       {/* Login Page */}
// //       <Route path="/login" component={LoginPage} />

// //       {/* Home Page (Protected Route) */}
// //       <Route path="/home">
// //         {/* Only allow access to home page if user is authenticated */}
// //         <PrivateRoute />
// //       </Route>

// //       {/* Default Redirect to Login */}
// //       <Route path="/">
// //         <LoginPage />
// //       </Route>
// //       </Routes>
// //     </Router>
// //   );
// // }

// // // PrivateRoute Component - Renders HomePage if authenticated, otherwise renders LoginPage
// // const PrivateRoute = () => {
// //   // Check if user is authenticated (you can implement your logic here)
// //   const isAuthenticated = true; // Replace with your authentication logic

// //   return isAuthenticated ? <HomePage /> : <LoginPage />;
// // };

//   <Router>
//     <Routes>
//       <Route path="/" element={<HomePage />} />
//       <Route path="/login" element={<LoginPage />} />      
//       <Route path="/register" element={<RegisterPage />} />
//       <Route path="/game" element={<Game />} />
//     </Routes>
//   </Router>
// );
// };
// const GameCanvas = () => {
//   // ... (your existing code for the game canvas)

//   return (
//     <div id="app" className="canvas-container">
//       {/* Your canvas will be rendered here */}
//     </div>
//   );
// };

//  export default App;

// App.jsx

// App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import Game from './components/Game';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/game" element={<Game/>} />
      </Routes>
    </Router>
  );
}

export default App;
