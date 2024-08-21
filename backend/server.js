const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// ตั้งค่า CORS
app.use(cors());

// ตั้งค่า body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// เชื่อมต่อฐานข้อมูล MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'reportss' 
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API endpoint สำหรับรับข้อมูลรายงาน
app.post('/api/reports', (req, res) => {
  const { phone, issue } = req.body; 

  if (!phone || !issue) {
    return res.status(400).json({ error: 'Please provide phone and issue.' });
  }

  const sql = 'INSERT INTO reports (phone, issue) VALUES (?, ?)';
  const values = [phone, issue];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Failed to submit report.' });
    }
    console.log('Data inserted successfully!');
    res.json({ message: 'Report submitted successfully!' });
  });
});

// API endpoint สำหรับดึงข้อมูลรายงานทั้งหมด
app.get('/api/reports', (req, res) => {
  const sql = 'SELECT * FROM reports'; 

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching reports:', err);
      return res.status(500).json({ error: 'Failed to fetch reports.' });
    }
    res.json(results); 
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});