const express = require('express')
const app = express()
const mysql = require('mysql')

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

app.listen(5000, () => { console.log("Server started on port 5000") })