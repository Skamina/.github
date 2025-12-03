const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// ===========================
// SCHOOLS API ENDPOINTS
// ===========================

// Get all schools
app.get('/api/schools', (req, res) => {
  db.all('SELECT * FROM schools ORDER BY name', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ schools: rows });
  });
});

// Get a single school
app.get('/api/schools/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM schools WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'School not found' });
      return;
    }
    res.json({ school: row });
  });
});

// Create a new school
app.post('/api/schools', (req, res) => {
  const { name, address, phone, email, principal } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'School name is required' });
    return;
  }

  db.run(
    'INSERT INTO schools (name, address, phone, email, principal) VALUES (?, ?, ?, ?, ?)',
    [name, address, phone, email, principal],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'School created successfully' });
    }
  );
});

// Update a school
app.put('/api/schools/:id', (req, res) => {
  const id = req.params.id;
  const { name, address, phone, email, principal } = req.body;

  db.run(
    'UPDATE schools SET name = ?, address = ?, phone = ?, email = ?, principal = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, address, phone, email, principal, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'School not found' });
        return;
      }
      res.json({ message: 'School updated successfully' });
    }
  );
});

// Delete a school
app.delete('/api/schools/:id', (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM schools WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'School not found' });
      return;
    }
    res.json({ message: 'School deleted successfully' });
  });
});

// ===========================
// STUDENTS API ENDPOINTS
// ===========================

// Get all students (optionally filter by school)
app.get('/api/students', (req, res) => {
  const schoolId = req.query.school_id;
  let query = `
    SELECT s.*, sc.name as school_name 
    FROM students s 
    LEFT JOIN schools sc ON s.school_id = sc.id
  `;
  let params = [];

  if (schoolId) {
    query += ' WHERE s.school_id = ?';
    params.push(schoolId);
  }

  query += ' ORDER BY s.last_name, s.first_name';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ students: rows });
  });
});

// Get a single student
app.get('/api/students/:id', (req, res) => {
  const id = req.params.id;
  db.get(
    `SELECT s.*, sc.name as school_name 
     FROM students s 
     LEFT JOIN schools sc ON s.school_id = sc.id 
     WHERE s.id = ?`,
    [id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: 'Student not found' });
        return;
      }
      res.json({ student: row });
    }
  );
});

// Create a new student
app.post('/api/students', (req, res) => {
  const {
    school_id, first_name, last_name, date_of_birth, grade, enrollment_date,
    email, phone, address, parent_name, parent_phone, parent_email, status
  } = req.body;

  if (!first_name || !last_name) {
    res.status(400).json({ error: 'First name and last name are required' });
    return;
  }

  db.run(
    `INSERT INTO students (
      school_id, first_name, last_name, date_of_birth, grade, enrollment_date,
      email, phone, address, parent_name, parent_phone, parent_email, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      school_id, first_name, last_name, date_of_birth, grade, enrollment_date,
      email, phone, address, parent_name, parent_phone, parent_email, status || 'active'
    ],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Student created successfully' });
    }
  );
});

// Update a student
app.put('/api/students/:id', (req, res) => {
  const id = req.params.id;
  const {
    school_id, first_name, last_name, date_of_birth, grade, enrollment_date,
    email, phone, address, parent_name, parent_phone, parent_email, status
  } = req.body;

  db.run(
    `UPDATE students SET 
      school_id = ?, first_name = ?, last_name = ?, date_of_birth = ?, 
      grade = ?, enrollment_date = ?, email = ?, phone = ?, address = ?,
      parent_name = ?, parent_phone = ?, parent_email = ?, status = ?,
      updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      school_id, first_name, last_name, date_of_birth, grade, enrollment_date,
      email, phone, address, parent_name, parent_phone, parent_email, status, id
    ],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Student not found' });
        return;
      }
      res.json({ message: 'Student updated successfully' });
    }
  );
});

// Delete a student
app.delete('/api/students/:id', (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM students WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    res.json({ message: 'Student deleted successfully' });
  });
});

// ===========================
// STATISTICS ENDPOINT
// ===========================
app.get('/api/stats', (req, res) => {
  const stats = {};
  
  db.get('SELECT COUNT(*) as count FROM schools', [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    stats.schools = row.count;
    
    db.get('SELECT COUNT(*) as count FROM students', [], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      stats.students = row.count;
      
      db.get('SELECT COUNT(*) as count FROM students WHERE status = "active"', [], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        stats.active_students = row.count;
        res.json(stats);
      });
    });
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`School Administration System running on http://localhost:${PORT}`);
});
