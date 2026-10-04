# Student Grade & Result Management System

A full-stack web application for managing student details, subjects, marks, grades, and examination results.

The system provides an easy-to-use dashboard where administrators or faculty can add students, manage subjects, enter marks, automatically calculate grades, and generate student performance reports.

## 🚀 Features

* Add new students
* Update student details
* Delete students
* Manage subjects
* Enter student marks
* Automatic grade calculation
* Automatic Pass/Fail status
* View all student results
* Search and manage student records
* Dashboard statistics
* Calculate pass percentage
* Generate individual student reports
* Responsive frontend
* MySQL database
* REST API using Node.js and Express

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API

### Backend

* Node.js
* Express.js
* REST API
* CORS

### Database

* MySQL

## 📁 Project Structure

```text
student-grade-management-system/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── server.js
│   ├── db.js
│   └── package.json
│
├── database/
│   └── database.sql
│
├── .gitignore
└── README.md
```

## 📊 Grade Calculation

The system automatically calculates grades according to the marks obtained.

|    Marks | Grade | Status |
| -------: | :---: | :----- |
| 90 - 100 |   A+  | Pass   |
|  80 - 89 |   A   | Pass   |
|  70 - 79 |   B+  | Pass   |
|  60 - 69 |   B   | Pass   |
|  50 - 59 |   C   | Pass   |
|  40 - 49 |   D   | Pass   |
| Below 40 |   F   | Fail   |

## 🗄️ Database Setup

### Step 1: Create the database

Open MySQL Workbench or MySQL Command Line and run:

```sql
CREATE DATABASE student_grade_db;
```

Select the database:

```sql
USE student_grade_db;
```

### Step 2: Create Students table

```sql
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    course VARCHAR(100) NOT NULL,
    year VARCHAR(20) NOT NULL
);
```

### Step 3: Create Subjects table

```sql
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);
```

### Step 4: Create Results table

```sql
CREATE TABLE results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    marks DECIMAL(5,2) NOT NULL,
    grade VARCHAR(5) NOT NULL,
    status VARCHAR(10) NOT NULL,

    UNIQUE(student_id, subject_id),

    FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE,

    FOREIGN KEY (subject_id)
        REFERENCES subjects(id)
        ON DELETE CASCADE
);
```

## ⚙️ Backend Installation

Open the backend folder in the terminal:

```bash
cd backend
```

Install the required packages:

```bash
npm install
```

The following packages are used:

* Express
* CORS
* MySQL2

## 🔐 Database Configuration

Open:

```text
backend/db.js
```

Configure your MySQL connection:

```js
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "YOUR_MYSQL_PASSWORD",
    database: "student_grade_db",
    port: 3306
});
```

Replace `YOUR_MYSQL_PASSWORD` with your MySQL password.

## ▶️ Run the Backend

Inside the backend folder, run:

```bash
npm start
```

You should see:

```text
Server running on http://localhost:5000
```

The API is now available at:

```text
http://localhost:5000
```

## 🌐 Run the Frontend

Open:

```text
frontend/index.html
```

in your browser.

The frontend communicates with the backend through the REST API.

## 🔗 API Endpoints

### Students

Get all students:

```http
GET /api/students
```

Add student:

```http
POST /api/students
```

Update student:

```http
PUT /api/students/:id
```

Delete student:

```http
DELETE /api/students/:id
```

### Subjects

Get all subjects:

```http
GET /api/subjects
```

Add subject:

```http
POST /api/subjects
```

### Results

Get all results:

```http
GET /api/results
```

Add/update result:

```http
POST /api/results
```

Delete result:

```http
DELETE /api/results/:id
```

### Dashboard

```http
GET /api/dashboard
```

### Student Report

```http
GET /api/report/:studentId
```

## 📌 Example Student

```text
Roll Number: 101
Name: Rahul Kumar
Email: rahul@example.com
Course: B.Tech CSE
Year: 3
```

## 📌 Example Subject

```text
Code: CS101
Name: Database Management Systems
```

## 📌 Example Result

```text
Student: Rahul Kumar
Subject: Database Management Systems
Marks: 85
Grade: A
Status: Pass
```

## 🔄 Application Flow

```text
User
  ↓
Frontend
  ↓
REST API
  ↓
Node.js + Express
  ↓
MySQL Database
  ↓
Student / Subject / Result Data
```

## 🔒 Security

For a production deployment:

* Use environment variables for database credentials
* Never upload passwords to GitHub
* Add authentication and authorization
* Validate all user inputs
* Use HTTPS
* Restrict database access
* Use secure production database credentials

## 🚀 Future Enhancements

The project can be extended with:

* Admin login
* Faculty login
* Student login
* Role-based access
* GPA/CGPA calculation
* Semester-wise results
* PDF mark-sheet generation
* Excel report export
* Email result notification
* Student attendance management
* Charts and performance analytics
* Search and advanced filtering
* Cloud database
* Online deployment

## 🎯 Purpose

This project demonstrates practical full-stack development skills including:

* Frontend development
* Backend development
* REST API development
* Database management
* CRUD operations
* SQL
* JavaScript
* Node.js
* Express.js
* MySQL

## 👨‍💻 Author

**Roopsai Pavuluri**

## 📄 License

This project is licensed under the MIT License.
