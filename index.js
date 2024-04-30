// index.js (Express server for fetching emails)
const express = require('express');
const mysql = require('mysql');
const moment = require('moment');

const app = express();
const port = 5001;

// Create connection to MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.PORT
  });

// Connect
connection.connect(err => {
  if (err) {
    console.log('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Endpoint to fetch email addresses of students with birthdays today
app.get('/students/birthdays', (req, res) => {
  const today = moment().format('MM-DD');
  const FETCH_STUDENTS_QUERY = `SELECT email FROM students WHERE DATE_FORMAT(dob, '%m-%d') = ?`;
  connection.query(FETCH_STUDENTS_QUERY, [today], (err, results) => {
    if (err) {
      console.log('Error fetching students:', err);
      res.status(500).send('Error fetching students');
      return;
    }
    const emails = results.map(result => result.email);
    res.status(200).json(emails);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
