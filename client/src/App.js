import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import SignUpAsVeterinary from './SignUpAsVeterinary';
import VeterinaryDashboard from './VeterinaryDashboard';

function App() {
  const [existingAbonnements, setExistingAbonnements] = useState([]);

  useEffect(() => {
    // Fetch existing abonnements from the server
    fetch('/api/abonnements') // Replace with the endpoint to fetch existing abonnements
      .then((response) => response.json())
      .then((data) => {
        setExistingAbonnements(data);
      })
      .catch((error) => {
        console.error('Error fetching existing abonnements:', error);
      });
  }, []);

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
          <Route
            path="/dashboard"
            element={<VeterinaryDashboard username="John" existingAbonnements={existingAbonnements} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App