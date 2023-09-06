const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_pawnation'
});

app.get('/abonnements', (req, res) => {
    // Query to retrieve existing abonnements
    const sqlSelectAbonnements = 'SELECT abonnement_id, abonnement_name, abonnement_tarif FROM abonnement';
  
    // Execute the query
    db.query(sqlSelectAbonnements, (err, results) => {
      if (err) {
        console.error('Error fetching existing abonnements:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      // Send the abonnements data as a JSON response
      res.json(results);
    });
});

// Route for Veterinary Sign Up Page
app.get("/signup", (req, res) => {
    res.send("This is the Veterinary Sign Up Page");
});

// Route to handle Veterinary Sign Up form submission
app.post("/signup", (req, res) => {
    const { username, password, type } = req.body;

    // Check if the required properties are defined
    if (!username || !password || !type) {
        return res.status(400).json({ error: 'Missing required data' });
    }

    // Perform database insertion
    const sqlInsert = 'INSERT INTO compte (compte_email, compte_password, compte_type) VALUES (?, ?, ?)';
    db.query(sqlInsert, [username, password, type], (err, result) => {
        if (err) {
          console.error('Error inserting data into the database:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        // Get the compte_id of the newly inserted row
        const compteId = result.insertId;

        // Database insertion successful
        console.log('Data inserted into the "compte" table with compte_id:', compteId);

        // Proceed to insert data into the "veterinaire" table
        const sqlInsertVeterinaire = `
            INSERT INTO veterinaire (id_compte, veterinaire_description, veterinaire_tarif, veterinaire_duree)
            VALUES (?, '', 0, 0)
        `;
        // Replace 'other_field' with the actual name of the field you want to insert in the "veterinaire" table
        db.query(sqlInsertVeterinaire, [compteId,], (err, result) => {
            if (err) {
                console.error('Error inserting data into the "veterinaire" table:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            const veterinaireId = result.insertId

            // Database insertion into the "veterinaire" table successful
            console.log('Data inserted into the "veterinaire" table.');

            // Define the days for which you want to insert data
            const daysToInsert = [1, 2, 3, 4, 5, 6, 7]; // Replace with the actual days you need

            // Create placeholders for the values to insert
            const placeholders = daysToInsert.map(() => '(?, ?, 0)').join(', ');

            // Create an array of values to insert
            const valuesToInsert = [];
            daysToInsert.forEach((day) => {
              valuesToInsert.push(veterinaireId, day);
            });

            const sqlInsertHoraire = `
              INSERT INTO horaire (id_veterinaire, horaire_jour, horaire_etat)
              VALUES ${placeholders}
            `;

            db.query(sqlInsertHoraire, valuesToInsert, (err, result) => {
              if (err) {
                console.error('Error inserting data into the "horaire" table:', err);
                return res.status(500).json({ error: 'Database error' });
              }
            });

            // Database insertion into the "horaire" table successful
            console.log('Data inserted into the "horaire" table.');

            res.json({ success: true, veterinaireId: veterinaireId });
        });
    });
});

// Route to handle saving additional information from Veterinary Dashboard
app.post('/save-veterinary-info', (req, res) => {
    const { id, description, tarif, duree, veterinaireCodePostal } = req.body;
  
    // Check if the required properties are defined
    if (!id || !description || !tarif || !duree || !veterinaireCodePostal) {
        return res.status(400).json({ error: 'Missing required data' });
    }

    // Perform database update or insertion
    const sqlUpdate = `
        UPDATE veterinaire
        SET veterinaire_description = ?, veterinaire_tarif = ?, veterinaire_duree = ?, veterinaire_code_postal = ?
        WHERE veterinaire_id = ?
    `;
    // Execute the update query
    db.query(sqlUpdate, [description, tarif, duree, veterinaireCodePostal, id], (err, result) => {
        if (err) {
            console.error('Error updating data in the database:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // If no rows were updated, it means the record does not exist, so insert a new row
        if (result.affectedRows === 0) {
            // Database update unsuccessful
            console.log('Data not updated in the "veterinaire" table.');
            res.json({ success: false });
        } else {
            // Database update successful
            console.log('Data updated in the "veterinaire" table.');
            res.json({ success: true });
        }
    });
});

// Route to handle saving veterinaire horaire information from Veterinary Dashboard
app.post('/save-veterinary-horaire', (req, res) => {
  const {
    id,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    mondayStartTime,
    mondayEndTime,
    tuesdayStartTime,
    tuesdayEndTime,
    wednesdayStartTime,
    wednesdayEndTime,
    thursdayStartTime,
    thursdayEndTime,
    fridayStartTime,
    fridayEndTime,
    saturdayStartTime,
    saturdayEndTime,
    sundayStartTime,
    sundayEndTime
  } = req.body;

  // Define an array of days of the week and their corresponding start and end times
  const daysOfWeek = [
    { day: '1', etat: monday, start: mondayStartTime, end: mondayEndTime },
    { day: '2', etat: tuesday, start: tuesdayStartTime, end: tuesdayEndTime },
    { day: '3', etat: wednesday, start: wednesdayStartTime, end: wednesdayEndTime },
    { day: '4', etat: thursday, start: thursdayStartTime, end: thursdayEndTime },
    { day: '5', etat: friday, start: fridayStartTime, end: fridayEndTime },
    { day: '6', etat: saturday, start: saturdayStartTime, end: saturdayEndTime },
    { day: '7', etat: sunday, start: sundayStartTime, end: sundayEndTime },
  ];
  

  // Iterate over each day of the week
  daysOfWeek.forEach((dayInfo) => {
    const { day, etat, start, end } = dayInfo;

    // Perform database update or insertion for the current day
    const sqlUpdate = `
      UPDATE horaire
      SET horaire_etat = ?, horaire_debut = ?, horaire_fin = ?
      WHERE id_veterinaire = ? AND horaire_jour = ?
    `;

    // Execute the update query
    db.query(sqlUpdate, [etat, start, end, id, day], (err, result) => {
      if (err) {
        console.error(`Error updating data for ${day} in the database:`, err);
        return res.status(500).json({ error: 'Database error' });
      }

      // If no rows were updated, it means the record does not exist, so insert a new row
      if (result.affectedRows === 0) {
        // Database update unsuccessful
        console.log(`Data not updated for ${day} in the "veterinaire" table.`);
        // Handle as needed
      } else {
        // Database update successful
        console.log(`Data updated for ${day} in the "veterinaire" table.`);
        // Handle as needed
      }
    });
  });
});

// Route to handle user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Check if the required properties are defined
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing required data' });
    }
  
    // Perform database query to check username and password
    const sqlSelectUser = 'SELECT * FROM compte WHERE compte_email = ? AND compte_password = ?';
    db.query(sqlSelectUser, [username, password], (err, results) => {
      if (err) {
        console.error('Error fetching user data from the database:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (results.length === 0) {
        // No matching user found
        res.json({ success: false, error: 'Invalid username or password' });
      } else {
        // User found, login successful
        const user = results[0];

        if (user.compte_type === 1) {
            const sqlSelectVet = `
                SELECT veterinaire_id FROM veterinaire WHERE id_compte = ?
            `;
            db.query(sqlSelectVet, [user.compte_id,], (err, results) => {
                if (err) {
                    console.error('Error fetching user data from the veterinaire table:', err);
                    return res.status(500).json({ error: 'Database error' });
                }

                if (results.length === 0) {
                    // No matching user found
                    res.json({ success: false, error: 'Veterinaire not found' });
                } else {
                    const veterinaireId = results[0].veterinaire_id;
                    res.json({ success: true, user, veterinaireId });
                }
            });
        }
      }
    });
  });
  
// Route to fetch saved veterinary information
app.get('/fetch-veterinary-info/:veterinaireId', (req, res) => {
    const veterinaireId = req.params.veterinaireId;
  
    // Query to retrieve saved veterinary information based on veterinaireId
    const sqlSelectVeterinaryInfo = `
      SELECT veterinaire_description, veterinaire_tarif, veterinaire_duree, veterinaire_code_postal, id_abonnement
      FROM veterinaire
      WHERE veterinaire_id = ?
    `;
  
    // Execute the query
    db.query(sqlSelectVeterinaryInfo, [veterinaireId], (err, results) => {
      if (err) {
        console.error('Error fetching veterinary information:', err);
        return res.status(500).json({ error: 'Database error' });
      }
  
      if (results.length === 0) {
        // No saved veterinary information found
        return res.json({ success: false });
      }
  
      // Send the fetched veterinary information as a JSON response
      const fetchedInfo = results[0];
      res.json({
        success: true,
        description: fetchedInfo.veterinaire_description,
        tarif: fetchedInfo.veterinaire_tarif,
        duree: fetchedInfo.veterinaire_duree,
        veterinaireCodePostal: fetchedInfo.veterinaire_code_postal,
        selectedAbonnement: fetchedInfo.id_abonnement,
      });
    });
  });
  
// Route to handle saving subscription from Veterinary Dashboard
app.post('/save-selected-abonnement', (req, res) => {
    const { id, selectedAbonnement } = req.body;
  
    // Check if the required properties are defined
    if (!id || !selectedAbonnement) {
        return res.status(400).json({ error: 'Missing id or selectedAbonnement' });
    }

    // Perform database update or insertion
    const sqlUpdate = `
        UPDATE veterinaire
        SET id_abonnement = ?
        WHERE veterinaire_id = ?
    `;
    // Execute the update query
    db.query(sqlUpdate, [selectedAbonnement, id], (err, result) => {
        if (err) {
            console.error('Error updating data in the database:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // If no rows were updated, it means the record does not exist
        if (result.affectedRows === 0) {
            // Database update unsuccessful
            console.log('Data not updated in the "veterinaire" table.');
            res.json({ success: false });
        } else {
            // Database update successful
            console.log('Data updated in the "veterinaire" table.');
            res.json({ success: true });
        }
    });
});

app.get('/search-veterinaires', (req, res) => {
  const searchQuery = req.query.q;

  const sqlSearch = `
    SELECT *
    FROM veterinaire
    WHERE veterinaire_code_postal = ?
  `;

  db.query(sqlSearch, [searchQuery], (err, results) => {
    if (err) {
      console.error('Error fetching search results:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length !== 0) {
      const veterinaireIds = results.map((result) => result.id_compte);
      const sqlFetchCompteEmails = `
        SELECT compte_email
        FROM compte
        WHERE compte_id IN (?)
      `;

      db.query(sqlFetchCompteEmails, [veterinaireIds], (err, emails) => {
        if (err) {
          console.error('Error fetching compte emails:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        // Combine the veterinaire data with compte emails
        const resultsWithCompteEmails = results.map((result, index) => ({
          ...result,
          compte_email: emails[index].compte_email,
        }));

        const sqlOtherSearch = `
          SELECT *
          FROM veterinaire
          WHERE veterinaire_code_postal != ?
        `;

        db.query(sqlOtherSearch, [searchQuery], (err, otherResults) => {
          if (err) {
            console.error('Error fetching search results:', err);
            return res.status(500).json({ error: 'Database error' });
          }

          if (otherResults.length !== 0){
            const otherVeterinaireIds = otherResults.map((result) => result.id_compte);
            const sqlFetchOtherCompteEmails = `
              SELECT compte_email
              FROM compte
              WHERE compte_id IN (?)
            `;

            db.query(sqlFetchOtherCompteEmails, [otherVeterinaireIds], (err, otherEmails) => {
              if (err) {
                console.error('Error fetching compte emails:', err);
                return res.status(500).json({ error: 'Database error' });
              }
    
              const otherResultsWithCompteEmails = otherResults.map((result, index) => ({
                ...result,
                compte_email: otherEmails[index].compte_email,
              }));

              // Combine the two arrays
              const combinedResults = resultsWithCompteEmails.concat(otherResultsWithCompteEmails);

              res.json(combinedResults);
            });
          }
        });     
      });
    } else {
      const sqlOtherSearch = `
          SELECT *
          FROM veterinaire
          WHERE veterinaire_code_postal != ?
        `;

      db.query(sqlOtherSearch, [searchQuery], (err, otherResults) => {
        if (err) {
          console.error('Error fetching search results:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (otherResults.length !== 0){
          const otherVeterinaireIds = otherResults.map((result) => result.id_compte);
          const sqlFetchOtherCompteEmails = `
            SELECT compte_email
            FROM compte
            WHERE compte_id IN (?)
          `;

          db.query(sqlFetchOtherCompteEmails, [otherVeterinaireIds], (err, otherEmails) => {
            if (err) {
              console.error('Error fetching compte emails:', err);
              return res.status(500).json({ error: 'Database error' });
            }
  
            const otherResultsWithCompteEmails = otherResults.map((result, index) => ({
              ...result,
              compte_email: otherEmails[index].compte_email,
            }));

            res.json(otherResultsWithCompteEmails);
          });
        }
      }); 
    }
  });
});

app.listen(5000, () => { console.log("Server started on port 5000") })