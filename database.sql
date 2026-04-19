-- Create Database
CREATE DATABASE IF NOT EXISTS university_db;
USE university_db;

-- 1. College
CREATE TABLE IF NOT EXISTS College (
    college_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL
);

-- 2. College_Contact
CREATE TABLE IF NOT EXISTS College_Contact (
    college_id INT,
    contact_no VARCHAR(20),
    PRIMARY KEY (college_id, contact_no)
);

-- 3. Department
CREATE TABLE IF NOT EXISTS Department (
    dept_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    contact_no VARCHAR(20),
    head_of_department VARCHAR(100),
    college_id INT
);

-- 4. Course
CREATE TABLE IF NOT EXISTS Course (
    course_no INT PRIMARY KEY AUTO_INCREMENT,
    course_title VARCHAR(150) NOT NULL,
    year INT NOT NULL,
    dept_id INT
);

-- 5. Faculty
CREATE TABLE IF NOT EXISTS Faculty (
    faculty_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(50),
    qualification VARCHAR(100),
    address VARCHAR(255),
    contact_no VARCHAR(20),
    college_id INT
);

-- 6. Student
CREATE TABLE IF NOT EXISTS Student (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    contact_no VARCHAR(20),
    address VARCHAR(255),
    dept_id INT
);

-- 7. Progress_Report
CREATE TABLE IF NOT EXISTS Progress_Report (
    report_id INT PRIMARY KEY,
    year INT NOT NULL,
    grade VARCHAR(5),
    rank INT,
    student_id INT
);

-- 8. Faculty_Course
CREATE TABLE IF NOT EXISTS Faculty_Course (
    faculty_id INT,
    course_no INT,
    PRIMARY KEY (faculty_id, course_no)
);

-- ====== MOCK DATA INSERTION ====== --

-- Insert Colleges
INSERT INTO College (name, address) VALUES
('Indian Institute of Technology', 'Powai, Mumbai'),
('Delhi University', 'North Campus, New Delhi');

-- Insert College Contacts
INSERT INTO College_Contact (college_id, contact_no) VALUES
(1, '+91-98765-43210'),
(1, '+91-98765-43211'),
(2, '+91-87654-32100');

-- Insert Departments
INSERT INTO Department (department_name, contact_no, head_of_department, college_id) VALUES
('Computer Science', '+91-99887-76655', 'Dr. APJ Abdul Kalam', 1),
('Electronics', '+91-99887-76656', 'Dr. Homi Bhabha', 1),
('Commerce', '+91-88776-65544', 'Dr. Amartya Sen', 2);

-- Insert Courses
INSERT INTO Course (course_title, year, dept_id) VALUES
('Data Structures and Algorithms', 2, 1),
('Database Management Systems', 3, 1),
('Digital Logic Design', 1, 2),
('Financial Accounting', 1, 3);

-- Insert Faculties
INSERT INTO Faculty (name, designation, qualification, address, contact_no, college_id) VALUES
('Dr. CV Raman', 'Professor', 'Ph.D. in Computer Science', 'Block A, IIT Powai', '+91-77665-54433', 1),
('Prof. Satyendra Nath Bose', 'Associate Professor', 'M.Tech in Electronics', 'Block B, IIT Powai', '+91-77665-54434', 1),
('Dr. Rajendra Prasad', 'Professor', 'Ph.D. in Economics', 'Staff Quarters, DU', '+91-66554-43322', 2);

-- Insert Students
INSERT INTO Student (name, year, contact_no, address, dept_id) VALUES
('Aarav Patel', 3, '+91-91234-56780', 'Hostel 4, Powai', 1),
('Rahul Sharma', 2, '+91-91234-56781', 'Hostel 2, Powai', 1),
('Priya Gupta', 1, '+91-91234-56782', 'PG Block, Mumbai', 2),
('Ananya Singh', 2, '+91-91234-56783', 'Girls Hostel, New Delhi', 3);

-- Insert Progress Reports (Only for passed years -> e.g., 3rd year student has 1st and 2nd year reports)
INSERT INTO Progress_Report (year, grade, rank, student_id) VALUES
(1, 'A', 2, 1),
(2, 'A+', 1, 1),
(1, 'B+', 15, 2),
(1, 'A', 5, 4);

-- Insert Faculty_Course Mapping
INSERT INTO Faculty_Course (faculty_id, course_no) VALUES
(1, 1), -- CV Raman teaches DSA
(1, 2), -- CV Raman teaches DBMS
(2, 3), -- Satyendra Nath Bose teaches DLD
(3, 4); -- Rajendra Prasad teaches Financial Accounting
