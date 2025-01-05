// config/db.js
require("dotenv").config(); // Lädt Variablen aus .env
const mysql = require("mysql2/promise");

// Erstelle einen Pool (empfohlen für größere Apps)
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // z.B. 'localhost'
  user: process.env.DB_USER,       // z.B. 'root'
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,    // Anzahl gleichzeitiger Verbindungen
  queueLimit: 0
});

// Optional: Testverbindung
pool.getConnection()
  .then(conn => {
    console.log("MySQL-Pool connected!"); 
    conn.release();
  })
  .catch(err => {
    console.error("MySQL connection error:", err);
  });

module.exports = pool;
