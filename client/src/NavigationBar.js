import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';

function NavigationBar() {
  return (
    <div className="navigation">
      <div className="logo">PawNation</div>
      <nav className="nav-links">
        <Link to="/search">Home</Link>
        <Link to="/signup">Sign Up As Veterinary</Link>
        <Link to="/login">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
    </div>
  );
}

export default NavigationBar;
