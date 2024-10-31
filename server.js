const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Create a connection to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected to the database as id ' + db.threadId);
});

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
  const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
  const sql = 'SELECT first_name, last_name, provider_speciality FROM providers';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// 3. Filter patients by First Name
app.get('/patients/:first_name', (req, res) => {
  const firstName = req.params.first_name;
  const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  db.query(sql, [firstName], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
  const specialty = req.params.specialty;
  const sql = 'SELECT first_name, last_name, provider_speciality FROM providers WHERE provider_speciality = ?';
  db.query(sql, [specialty], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// listen to the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
