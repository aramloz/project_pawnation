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

app.get("/", (req, res) => {
    const sqlInsert = "INSERT INTO abonnement (abonnement_tarif, abonnement_date_prelevement, abonnement_paye) VALUES ('100', '01/01/2023', '0');"
    db.query(sqlInsert, (err, result) => {
        res.send("hello");
    })
})

app.get("/api", (req, res) => {
    res.json({ "users": ["userOne", "userTwo", "userThree", "userFour"] })
})

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
            INSERT INTO veterinaire (id_compte, veterinaire_description, veterinaire_tarif, veterinaire_duree, id_abonnement)
            VALUES (?, '', 0, 0, (SELECT abonnement_id FROM abonnement WHERE abonnement_tarif = 0 LIMIT 1))
        `;
        // Replace 'other_field' with the actual name of the field you want to insert in the "veterinaire" table
        db.query(sqlInsertVeterinaire, [compteId,], (err, result) => {
            if (err) {
                console.error('Error inserting data into the "veterinaire" table:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            // Database insertion into the "veterinaire" table successful
            console.log('Data inserted into the "veterinaire" table.');
            res.json({ success: true });
        });
    });
});

app.listen(5000, () => { console.log("Server started on port 5000") })