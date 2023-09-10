import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function CalendarColumn({ horaires, veterinaire_duree }) {
  // Check if the veterinarian is available today (horaires[0].horaire_etat === 1)
  const isAvailable = horaires[0].horaire_etat === 1;

  // Create an array to store time slots
  const timeSlots = [];

  const dureeParts = veterinaire_duree.split(':');
  const duree = new Date();
  duree.setMinutes(dureeParts[1]);

  if (isAvailable) {
    // Create a Date object for today's date
    const startTime = new Date();

    // Extract the time portion (e.g., "HH:MM") from horaires[0].horaire_debut
    const startTimeParts = horaires[0].horaire_debut.split(':');

    // Set the time portion to today's date
    startTime.setHours(Number(startTimeParts[0])); // Set the hours
    startTime.setMinutes(Number(startTimeParts[1])); // Set the minutes
    
    const endTime = new Date();

    // Extract the time portion (e.g., "HH:MM") from horaires[0].horaire_fin
    const endTimeParts = horaires[0].horaire_fin.split(':');

    // Set the time portion to today's date
    endTime.setHours(Number(endTimeParts[0])); // Set the hours
    endTime.setMinutes(Number(endTimeParts[1])); // Set the minutes

    // Initialize the current time as the start time
    let currentTime = new Date(startTime);

    // Generate time slots based on the duration
    while (currentTime < endTime) {
      // Format the current time as a string
      const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Add the time slot to the array
      timeSlots.push(formattedTime);

      // Increment the current time by the duration
      currentTime.setMinutes(currentTime.getMinutes() + duree.getMinutes());
    }
  }

  return (
    <div className="calendar-column">
      {isAvailable ? (
        <ul>
          {timeSlots.map((timeSlot, index) => (
            <li key={index}>{timeSlot}</li>
          ))}
        </ul>
      ) : (
        <p>Veterinarian is not available today.</p>
      )}
    </div>
  );
}

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

  // Helper function to format time slots
  const formatTimeSlot = (start, end, duration) => {
    // Logic to format time slots based on start, end, and duration
    // You can implement this according to your desired format
    // For example: 9:00 AM - 10:30 AM
    // You may need to handle edge cases for AM/PM and time format
    return `${start} - ${end}`;
  };

  // Helper function to determine if a day is today, tomorrow, or the day after tomorrow
  const getDayLabel = (index) => {
    switch (index) {
      case 0:
        return 'Today';
      case 1:
        return 'Tomorrow';
      case 2:
        return 'Day After Tomorrow';
      default:
        return '';
    }
  };

  return (
    <div>
      <h2>Search Results for "{searchQuery}"</h2>
      <ul>
        {searchResults.map((veterinaire) => (
          <li key={veterinaire.veterinaire_id}>
            <div className="veterinaire-details">
              <p>Email: {veterinaire.compte_email}</p>
              <p>Description: {veterinaire.veterinaire_description}</p>
              <p>Tarif: {veterinaire.veterinaire_tarif}</p>
              <p>Code postal: {veterinaire.veterinaire_code_postal}</p>
            </div>
            <div className="calendar">
              {Array.from({ length: 3 }).map((_, index) => {
                const dayLabel = getDayLabel(index);
                return (
                  <CalendarColumn
                    key={index}
                    horaires={veterinaire.horaires}
                    veterinaire_duree={veterinaire.veterinaire_duree}
                  />
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResults;
