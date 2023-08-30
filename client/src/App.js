import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import SignUpAsVeterinary from './SignUpAsVeterinary';
import VeterinaryDashboard from './VeterinaryDashboard';
import SubscriptionConfirmation from './SubscriptionConfirmation';
import SearchContainer from './SearchContainer';
import Login from './Login';
import SearchResults from './SearchResults';

function App() {
  const [existingAbonnements, setExistingAbonnements] = useState([]);

  // useEffect(() => {
  //   // Fetch existing abonnements from the server
  //   fetch('/api/abonnements') // Replace with the endpoint to fetch existing abonnements
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setExistingAbonnements(data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching existing abonnements:', error);
  //     });
  // }, []);

  return (
    <Router>
       <NavigationBar />
      <div>
        <Routes>
          <Route exact path="/signup" element={<SignUpAsVeterinary />} />
          <Route
            path="/dashboard"
            element={<VeterinaryDashboard username="John" existingAbonnements={existingAbonnements} />}
          />
          <Route path="/subscription-confirmation" element={<SubscriptionConfirmation />} />
          <Route exact path="/search" element={<SearchContainer />} />
          <Route exact path="/login" element={<Login />} />
          <Route path="/search-results" element={<SearchResults />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App