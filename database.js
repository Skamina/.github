const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'school_admin.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Schools table
  db.run(`
    CREATE TABLE IF NOT EXISTS schools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      email TEXT,
      principal TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Students table (alumns)
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      school_id INTEGER,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      date_of_birth DATE,
      grade TEXT,
      enrollment_date DATE,
      email TEXT,
      phone TEXT,
      address TEXT,
      parent_name TEXT,
      parent_phone TEXT,
      parent_email TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (school_id) REFERENCES schools(id)
    )
  `);

  // Insert sample data for testing
  db.run(`
    INSERT OR IGNORE INTO schools (id, name, address, phone, email, principal)
    VALUES (1, 'Lincoln High School', '123 Main St, Springfield', '555-0100', 'info@lincolnhs.edu', 'Dr. Sarah Johnson')
  `);

  db.run(`
    INSERT OR IGNORE INTO students (id, school_id, first_name, last_name, date_of_birth, grade, enrollment_date, email, phone, status)
    VALUES (1, 1, 'John', 'Doe', '2008-05-15', '10th Grade', '2023-09-01', 'john.doe@student.edu', '555-0101', 'active')
  `);

  console.log('Database initialized successfully');
});

module.exports = db;
