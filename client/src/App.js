import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import SignUpAsVeterinary from './SignUpAsVeterinary';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/signup">Sign up as veterinary</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route exact path="/signup" element={<SignUpAsVeterinary />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App