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
            res.json({ success: true, veterinaireId: veterinaireId });
        });
    });
});

// Route to handle saving additional information from Veterinary Dashboard
app.post('/save-veterinary-info', (req, res) => {
    const { id, description, tarif, duree } = req.body;
  
    // Check if the required properties are defined
    if (!id || !description || !tarif || !duree) {
        return res.status(400).json({ error: 'Missing required data' });
    }

    // Perform database update or insertion
    const sqlUpdate = `
        UPDATE veterinaire
        SET veterinaire_description = ?, veterinaire_tarif = ?, veterinaire_duree = ?
        WHERE veterinaire_id = ?
    `;
    // Execute the update query
    db.query(sqlUpdate, [description, tarif, duree, id], (err, result) => {
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
  

app.listen(5000, () => { console.log("Server started on port 5000") })