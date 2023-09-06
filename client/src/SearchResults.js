import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function SearchResults() {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Fetch search results based on the searchQuery
    fetch(`/search-veterinaires?q=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data);
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
      });
  }, [searchQuery]);

  return (
    <div>
      <h2>Search Results for "{searchQuery}"</h2>
      <ul>
        {searchResults.map((veterinaire) => (
          <li key={veterinaire.veterinaire_id}>
            <p>Email: {veterinaire.compte_email}</p>
            <p>Description: {veterinaire.veterinaire_description}</p>
            <p>Tarif: {veterinaire.veterinaire_tarif}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResults;
