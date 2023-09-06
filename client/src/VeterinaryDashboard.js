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

  // State variables for days of the week
  const [monday, setMonday] = useState(false);
  const [tuesday, setTuesday] = useState(false);
  const [wednesday, setWednesday] = useState(false);
  const [thursday, setThursday] = useState(false);
  const [friday, setFriday] = useState(false);
  const [saturday, setSaturday] = useState(false);
  const [sunday, setSunday] = useState(false);

  // State variables for begin and end times
  const [mondayStartTime, setMondayStartTime] = useState('');
  const [mondayEndTime, setMondayEndTime] = useState('');
  const [tuesdayStartTime, setTuesdayStartTime] = useState('');
  const [tuesdayEndTime, setTuesdayEndTime] = useState('');
  const [wednesdayStartTime, setWednesdayStartTime] = useState('');
  const [wednesdayEndTime, setWednesdayEndTime] = useState('');
  const [thursdayStartTime, setThursdayStartTime] = useState('');
  const [thursdayEndTime, setThursdayEndTime] = useState('');
  const [fridayStartTime, setFridayStartTime] = useState('');
  const [fridayEndTime, setFridayEndTime] = useState('');
  const [saturdayStartTime, setSaturdayStartTime] = useState('');
  const [saturdayEndTime, setSaturdayEndTime] = useState('');
  const [sundayStartTime, setSundayStartTime] = useState('');
  const [sundayEndTime, setSundayEndTime] = useState('');

  // Handler for day checkboxes
  const handleDayCheckboxChange = (day, value) => {
    switch (day) {
      case 'monday':
        setMonday(value);
        break;
      case 'tuesday':
        setTuesday(value);
        break;
      case 'wednesday':
        setWednesday(value);
        break;
      case 'thursday':
        setThursday(value);
        break;
      case 'friday':
        setFriday(value);
        break;
      case 'saturday':
        setSaturday(value);
        break;
      case 'sunday':
        setSunday(value);
        break;
      default:
        break;
    }
  }

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

    const formDataHoraire = {
      id: veterinaireId,
      monday: monday,
      tuesday: tuesday,
      wednesday: wednesday,
      thursday: thursday,
      friday: friday,
      saturday: saturday,
      sunday: sunday,
      mondayStartTime: mondayStartTime,
      mondayEndTime: mondayEndTime,
      tuesdayStartTime: tuesdayStartTime,
      tuesdayEndTime: tuesdayEndTime,
      wednesdayStartTime: wednesdayStartTime,
      wednesdayEndTime: wednesdayEndTime,
      thursdayStartTime: thursdayStartTime,
      thursdayEndTime: thursdayEndTime,
      fridayStartTime: fridayStartTime,
      fridayEndTime: fridayEndTime,
      saturdayStartTime: saturdayStartTime,
      saturdayEndTime: saturdayEndTime,
      sundayStartTime: sundayStartTime,
      sundayEndTime: sundayEndTime,
    };

    fetch('/save-veterinary-horaire', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataHoraire),
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
        <div>
          <label>Working Hours:</label>
          <div>
            <input
              type="checkbox"
              id="monday"
              checked={monday}
              onChange={(e) => handleDayCheckboxChange('monday', e.target.checked)}
            />
            <label htmlFor="monday">Lundi</label>
            {monday && (
              <>
                <input
                  type="time"
                  value={mondayStartTime}
                  onChange={(e) => setMondayStartTime(e.target.value)}
                />
                <input
                  type="time"
                  value={mondayEndTime}
                  onChange={(e) => setMondayEndTime(e.target.value)}
                />
              </>
            )}
          </div>
          <div>
            <input
              type="checkbox"
              id="tuesday"
              checked={tuesday}
              onChange={(e) => handleDayCheckboxChange('tuesday', e.target.checked)}
            />
            <label htmlFor="tuesday">Mardi</label>
            {tuesday && (
              <>
                <input
                  type="time"
                  value={tuesdayStartTime}
                  onChange={(e) => setTuesdayStartTime(e.target.value)}
                />
                <input
                  type="time"
                  value={tuesdayEndTime}
                  onChange={(e) => setTuesdayEndTime(e.target.value)}
                />
              </>
            )}
          </div>
          <div>
            <input
              type="checkbox"
              id="wednesday"
              checked={wednesday}
              onChange={(e) => handleDayCheckboxChange('wednesday', e.target.checked)}
            />
            <label htmlFor="wednesday">Mercredi</label>
            {wednesday && (
              <>
                <input
                  type="time"
                  value={wednesdayStartTime}
                  onChange={(e) => setWednesdayStartTime(e.target.value)}
                />
                <input
                  type="time"
                  value={wednesdayEndTime}
                  onChange={(e) => setWednesdayEndTime(e.target.value)}
                />
              </>
            )}
          </div>
          <div>
            <input
              type="checkbox"
              id="thursday"
              checked={thursday}
              onChange={(e) => handleDayCheckboxChange('thursday', e.target.checked)}
            />
            <label htmlFor="thursday">Jeudi</label>
            {thursday && (
              <>
                <input
                  type="time"
                  value={thursdayStartTime}
                  onChange={(e) => setThursdayStartTime(e.target.value)}
                />
                <input
                  type="time"
                  value={thursdayEndTime}
                  onChange={(e) => setThursdayEndTime(e.target.value)}
                />
              </>
            )}
          </div>
          <div>
            <input
              type="checkbox"
              id="friday"
              checked={friday}
              onChange={(e) => handleDayCheckboxChange('friday', e.target.checked)}
            />
            <label htmlFor="friday">Vendredi</label>
            {friday && (
              <>
                <input
                  type="time"
                  value={fridayStartTime}
                  onChange={(e) => setFridayStartTime(e.target.value)}
                />
                <input
                  type="time"
                  value={fridayEndTime}
                  onChange={(e) => setFridayEndTime(e.target.value)}
                />
              </>
            )}
          </div>
          <div>
            <input
              type="checkbox"
              id="saturday"
              checked={saturday}
              onChange={(e) => handleDayCheckboxChange('saturday', e.target.checked)}
            />
            <label htmlFor="saturday">Samedi</label>
            {saturday && (
              <>
                <input
                  type="time"
                  value={saturdayStartTime}
                  onChange={(e) => setSaturdayStartTime(e.target.value)}
                />
                <input
                  type="time"
                  value={saturdayEndTime}
                  onChange={(e) => setSaturdayEndTime(e.target.value)}
                />
              </>
            )}
          </div>
          <div>
            <input
              type="checkbox"
              id="sunday"
              checked={sunday}
              onChange={(e) => handleDayCheckboxChange('sunday', e.target.checked)}
            />
            <label htmlFor="sunday">Dimanche</label>
            {sunday && (
              <>
                <input
                  type="time"
                  value={sundayStartTime}
                  onChange={(e) => setSundayStartTime(e.target.value)}
                />
                <input
                  type="time"
                  value={sundayEndTime}
                  onChange={(e) => setSundayEndTime(e.target.value)}
                />
              </>
            )}
          </div>
          {/* Repeat for the other days of the week... */}
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
