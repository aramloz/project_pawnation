import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function VeterinaryDashboard() {
  const [description, setDescription] = useState('');
  const [tarif, setTarif] = useState('');
  const [duree, setDuree] = useState('');
  const [selectedAbonnement, setSelectedAbonnement] = useState('');
  const [veterinaireCodePostal, setVeterinaireCodePostal] = useState('');
  const [abonnements, setAbonnements] = useState([]);

  const navigate = useNavigate()

  const location = useLocation();
  const { username, veterinaireId } = location.state;
  const handleSubscribe = () => {
    // Redirect to the subscription confirmation page
    navigate('/subscription-confirmation');
  };

  useEffect(() => {
    // Fetch existing abonnements from the server
    fetch('/abonnements')
      .then((response) => response.json())
      .then((data) => {
        setAbonnements(data);
      })
      .catch((error) => {
        console.error('Error fetching existing abonnements:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch saved veterinary information from the server
    fetch(`/fetch-veterinary-info/${veterinaireId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Set the fetched data to state variables
          setDescription(data.description);
          setTarif(data.tarif);
          setDuree(data.duree);
          setVeterinaireCodePostal(data.veterinaireCodePostal);
          setSelectedAbonnement(data.selectedAbonnement);
        } else {
          console.error('Failed to fetch veterinary information');
        }
      })
      .catch((error) => {
        console.error('Error fetching veterinary information:', error);
      });
  }, [veterinaireId]); // Run the effect whenever veterinaireId changes
  

  // Handler for profile form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Submit the form data to the server for further processing
    const formData = {
        id: veterinaireId,
        description: description,
        tarif: tarif,
        duree: duree,
        veterinaireCodePostal: veterinaireCodePostal,
    };

    // Send the form data to the server (you can use fetch or any HTTP client library)
    fetch('/save-veterinary-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the server response (if needed)
        console.log(data);
      })
      .catch((error) => {
        console.error('Error occurred during form submission:', error);
      });
  };

    // Handler for submitting the selectedAbonnement form
    const handleSelectedAbonnementSubmit = (event) => {
        event.preventDefault();
    
        // Submit the selectedAbonnement form data to the server for further processing
        const formData = {
          id: veterinaireId,
          selectedAbonnement: selectedAbonnement,
        };
    
        // Send the form data to the server (you can use fetch or any HTTP client library)
        fetch('/save-selected-abonnement', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle the server response (if needed)
            if (data.success) {
              navigate('/subscription-confirmation');
            } else {
              console.error('Error occurred during selectedAbonnement form submission');
            }
          })
          .catch((error) => {
            console.error('Error occurred during selectedAbonnement form submission:', error);
          });
      };

  return (
    <div>
      <h2>Hello {username}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4" // Set the number of rows to display
            cols="50" // Set the number of columns to display
          />
        </div>
        <div>
          <label htmlFor="tarif">Tarif:</label>
          <input
            type="number"
            id="tarif"
            value={tarif}
            onChange={(e) => setTarif(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="duree">Duree:</label>
          <input
            type="time"
            id="duree"
            value={duree}
            onChange={(e) => setDuree(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="veterinaireCodePostal">Veterinaire Code Postal:</label>
          <input
            type="text"
            id="veterinaireCodePostal"
            value={veterinaireCodePostal}
            onChange={(e) => setVeterinaireCodePostal(e.target.value)}
          />
        </div>
        <button type="submit">Save Information</button>
      </form>
      {abonnements.length > 0 && (
        <form onSubmit={handleSelectedAbonnementSubmit}>
          <div>
            <label>Select Abonnement:</label>
            <div>
                <input
                  type="radio"
                  id="noSubscription"
                  value=""
                  checked={selectedAbonnement === ''}
                  onChange={() => setSelectedAbonnement('')}
                />
                <label htmlFor="noSubscription">No subscription</label>
            </div>
            {abonnements.map((abonnement) => (
              <div key={abonnement.abonnement_id}>
                <input
                  type="radio"
                  id={abonnement.abonnement_id}
                  value={abonnement.abonnement_id}
                  checked={selectedAbonnement === abonnement.abonnement_id}
                  onChange={() => setSelectedAbonnement(abonnement.abonnement_id)}
                />
                <label htmlFor={abonnement.abonnement_id}>
                  {abonnement.abonnement_name} - {abonnement.abonnement_tarif}
                </label>
              </div>
            ))}
          </div>
          <button type="submit">Subscribe</button>
        </form>
      )}
    </div>
  );
}

export default VeterinaryDashboard;
