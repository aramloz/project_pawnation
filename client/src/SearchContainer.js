import React from 'react';
import './SearchContainer.css';

function SearchContainer() {
  return (
    <div className="search-container">
      <div className="line">
        <div className="text">Line 1 Text</div>
      </div>
      <div className="line">
        <div className="text">Line 2 Text</div>
      </div>
      <div className="line">
        <input type="text" placeholder="Search..." className="search-input" />
        <button className="search-button">Search</button>
      </div>
    </div>
  );
}

export default SearchContainer;
