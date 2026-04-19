-- 1. College
CREATE TABLE College (
    college_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    address VARCHAR2(255) NOT NULL
);

-- 2. College_Contact
CREATE TABLE College_Contact (
    college_id NUMBER,
    contact_no VARCHAR2(20),
    PRIMARY KEY (college_id, contact_no)
);

-- 3. Department
CREATE TABLE Department (
    dept_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    department_name VARCHAR2(100) NOT NULL,
    contact_no VARCHAR2(20),
    head_of_department VARCHAR2(100),
    college_id NUMBER
);

-- 4. Course
CREATE TABLE Course (
    course_no NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    course_title VARCHAR2(150) NOT NULL,
    year NUMBER NOT NULL,
    dept_id NUMBER
);

-- 5. Faculty
CREATE TABLE Faculty (
    faculty_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    designation VARCHAR2(50),
    qualification VARCHAR2(100),
    address VARCHAR2(255),
    contact_no VARCHAR2(20),
    college_id NUMBER
);

-- 6. Student
CREATE TABLE Student (
    student_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    year NUMBER NOT NULL,
    contact_no VARCHAR2(20),
    address VARCHAR2(255),
    dept_id NUMBER
);

-- 7. Progress_Report
CREATE TABLE Progress_Report (
    report_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year NUMBER NOT NULL,
    grade VARCHAR2(5),
    rank NUMBER,
    student_id NUMBER
);

-- 8. Faculty_Course
CREATE TABLE Faculty_Course (
    faculty_id NUMBER,
    course_no NUMBER,
    PRIMARY KEY (faculty_id, course_no)
);

-- ====== MOCK DATA INSERTION ====== --

-- Insert Colleges
INSERT INTO College (name, address) VALUES ('BPIT', 'Rohini, New Delhi');
INSERT INTO College (name, address) VALUES ('MSIT', 'Rohini, New Delhi');

-- Insert College Contacts
INSERT INTO College_Contact (college_id, contact_no) VALUES (1, '+91-98765-43210');
INSERT INTO College_Contact (college_id, contact_no) VALUES (1, '+91-98765-43211');
INSERT INTO College_Contact (college_id, contact_no) VALUES (2, '+91-87654-32100');

-- Insert Departments
INSERT INTO Department (department_name, contact_no, head_of_department, college_id) VALUES ('Computer Science', '+91-99887-76655', 'Dr. Rohan', 1);
INSERT INTO Department (department_name, contact_no, head_of_department, college_id) VALUES ('Electronics', '+91-99887-76656', 'Dr. Sandeep', 1);
INSERT INTO Department (department_name, contact_no, head_of_department, college_id) VALUES ('Commerce', '+91-88776-65544', 'Dr. Pooja', 2);

-- Insert Courses
INSERT INTO Course (course_title, year, dept_id) VALUES ('Data Structures and Algorithms', 2, 1);
INSERT INTO Course (course_title, year, dept_id) VALUES ('Database Management Systems', 3, 1);
INSERT INTO Course (course_title, year, dept_id) VALUES ('Digital Logic Design', 1, 2);
INSERT INTO Course (course_title, year, dept_id) VALUES ('Financial Accounting', 1, 3);

-- Insert Faculties
INSERT INTO Faculty (name, designation, qualification, address, contact_no, college_id) VALUES ('Dr. Rajan Kumar', 'Professor', 'Ph.D. in Computer Science', 'Block A, BPIT Hostel', '+91-77665-54433', 1);
INSERT INTO Faculty (name, designation, qualification, address, contact_no, college_id) VALUES ('Prof. Satyendra ', 'Associate Professor', 'M.Tech in Electronics', 'Block B, Rohini', '+91-77665-54434', 1);
INSERT INTO Faculty (name, designation, qualification, address, contact_no, college_id) VALUES ('Dr. Rajan', 'Professor', 'Ph.D. in Economics', 'Staff Quarters, IPU', '+91-66554-43322', 2);

-- Insert Students
INSERT INTO Student (name, year, contact_no, address, dept_id) VALUES ('Aarav Patel', 3, '+91-91234-56780', 'Hostel 4, BPIT', 1);
INSERT INTO Student (name, year, contact_no, address, dept_id) VALUES ('Rahul Sharma', 2, '+91-91234-56781', 'Hostel 2, BPIT', 1);
INSERT INTO Student (name, year, contact_no, address, dept_id) VALUES ('Priya Gupta', 1, '+91-91234-56782', 'Hostel 1, MSIT', 2);
INSERT INTO Student (name, year, contact_no, address, dept_id) VALUES ('Ananya Singh', 2, '+91-91234-56783', 'Hostel 3, MSIT', 3);

-- Insert Progress Reports
INSERT INTO Progress_Report (year, grade, rank, student_id) VALUES (1, 'A', 2, 1);
INSERT INTO Progress_Report (year, grade, rank, student_id) VALUES (2, 'A+', 1, 1);
INSERT INTO Progress_Report (year, grade, rank, student_id) VALUES (1, 'B+', 15, 2);
INSERT INTO Progress_Report (year, grade, rank, student_id) VALUES (1, 'A', 5, 4);

-- Insert Faculty_Course Mapping
INSERT INTO Faculty_Course (faculty_id, course_no) VALUES (1, 1);
INSERT INTO Faculty_Course (faculty_id, course_no) VALUES (1, 2);
INSERT INTO Faculty_Course (faculty_id, course_no) VALUES (2, 3);
INSERT INTO Faculty_Course (faculty_id, course_no) VALUES (3, 4);
