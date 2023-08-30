import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchContainer.css';

function SearchContainer() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    // Navigate to the search results page with the search query as a parameter
    navigate(`/search-results?q=${searchQuery}`);
  };

  const handleKeyDown = (e) => {
    // Allow only digits (0-9) and prevent any other keypress
    const key = e.key;
    if (key !== 'Backspace' && (key < '0' || key > '9')) {
      e.preventDefault();
    }
  };

  return (
    <div className="search-container">
      <div className="line">
        <div className="text">Trouvez un vétérinaire !</div>
      </div>
      <div className="line">
        <div className="text">Prenez RDV en ligne</div>
      </div>
      <div className="line">
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          maxLength={5} // Limit input to 5 characters
          onKeyDown={handleKeyDown} // Only allow digits
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
}

export default SearchContainer;
