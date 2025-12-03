# 🏫 School Administration System

A comprehensive web-based application for managing schools and students (alumni). This system provides an intuitive interface for administrators to efficiently manage educational institutions and their student records.

## Features

### School Management
- ✅ Create, read, update, and delete schools
- 📝 Track school information including:
  - School name
  - Address
  - Contact details (phone, email)
  - Principal name
- 📊 View all schools in an organized dashboard

### Student Management (Alumni)
- ✅ Complete student record management (CRUD operations)
- 👤 Comprehensive student profiles including:
  - Personal information (name, date of birth, grade)
  - Contact details (email, phone, address)
  - School enrollment information
  - Parent/guardian information
  - Student status (active, inactive, graduated)
- 🔍 Filter students by school
- 📋 View all students with their associated school information

### Dashboard & Statistics
- 📈 Real-time statistics showing:
  - Total number of schools
  - Total number of students
  - Number of active students
- 🎨 Modern, responsive user interface
- 📱 Mobile-friendly design

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: SQLite3 (lightweight, serverless)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Architecture**: RESTful API

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/Skamina/.github.git
cd .github
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## API Documentation

### Schools Endpoints

#### Get All Schools
```
GET /api/schools
Response: { schools: [...] }
```

#### Get Single School
```
GET /api/schools/:id
Response: { school: {...} }
```

#### Create School
```
POST /api/schools
Body: { name, address, phone, email, principal }
Response: { id, message }
```

#### Update School
```
PUT /api/schools/:id
Body: { name, address, phone, email, principal }
Response: { message }
```

#### Delete School
```
DELETE /api/schools/:id
Response: { message }
```

### Students Endpoints

#### Get All Students
```
GET /api/students
Query params: ?school_id=<id> (optional)
Response: { students: [...] }
```

#### Get Single Student
```
GET /api/students/:id
Response: { student: {...} }
```

#### Create Student
```
POST /api/students
Body: {
  school_id, first_name, last_name, date_of_birth, grade,
  enrollment_date, email, phone, address, parent_name,
  parent_phone, parent_email, status
}
Response: { id, message }
```

#### Update Student
```
PUT /api/students/:id
Body: { <same as create> }
Response: { message }
```

#### Delete Student
```
DELETE /api/students/:id
Response: { message }
```

### Statistics Endpoint

#### Get Dashboard Statistics
```
GET /api/stats
Response: {
  schools: <count>,
  students: <count>,
  active_students: <count>
}
```

## Database Schema

### Schools Table
- id (PRIMARY KEY)
- name (TEXT, NOT NULL)
- address (TEXT)
- phone (TEXT)
- email (TEXT)
- principal (TEXT)
- created_at (DATETIME)
- updated_at (DATETIME)

### Students Table
- id (PRIMARY KEY)
- school_id (FOREIGN KEY)
- first_name (TEXT, NOT NULL)
- last_name (TEXT, NOT NULL)
- date_of_birth (DATE)
- grade (TEXT)
- enrollment_date (DATE)
- email (TEXT)
- phone (TEXT)
- address (TEXT)
- parent_name (TEXT)
- parent_phone (TEXT)
- parent_email (TEXT)
- status (TEXT, DEFAULT 'active')
- created_at (DATETIME)
- updated_at (DATETIME)

## Usage Guide

### Managing Schools

1. Navigate to the **Schools** tab
2. Click **"+ Add School"** to create a new school
3. Fill in the school details and click **Save**
4. Use **Edit** to modify school information
5. Use **Delete** to remove a school (with confirmation)

### Managing Students

1. Navigate to the **Students** tab
2. Click **"+ Add Student"** to enroll a new student
3. Fill in the student details including:
   - Basic information (name, date of birth, grade)
   - Contact information
   - Parent/guardian information
   - Select the associated school
4. Use the **Filter by School** dropdown to view students from a specific school
5. Use **Edit** to update student records
6. Use **Delete** to remove student records (with confirmation)

## Project Structure

```
.github/
├── public/
│   ├── index.html      # Main HTML interface
│   ├── styles.css      # Styling and responsive design
│   └── app.js          # Frontend JavaScript logic
├── database.js         # Database setup and schema
├── server.js           # Express server and API endpoints
├── package.json        # Project dependencies
├── .gitignore          # Git ignore rules
└── README.md           # Documentation
```

## Security Considerations

- **Rate Limiting**: API endpoints are protected with rate limiting (100 requests per 15 minutes per IP)
- **Input Validation**: Both client and server-side validation of user inputs
- **SQL Injection Prevention**: Parameterized queries used for all database operations
- **XSS Protection**: HTML escaping in frontend to prevent cross-site scripting
- **CORS**: Cross-Origin Resource Sharing enabled for controlled API access

## Future Enhancements

Potential features for future versions:
- User authentication and authorization
- Role-based access control (admin, teacher, student)
- Attendance tracking
- Grade management
- Report generation
- Email notifications
- File upload for student documents
- Advanced search and filtering
- Data export (CSV, PDF)
- Multi-language support

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.