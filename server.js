require('dotenv').config();
const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

// Enable Oracledb Thick mode (Requires Oracle Client libraries)
try {
  oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_23_0' });
  console.log("Oracle Thick Mode Enabled Successfully");
} catch (err) {
  console.error("Error setting up Thick Mode:");
  console.error(err);
}



// Oracle Database Connection Pool Array
let connectionPool;

async function initDb() {
  try {
    connectionPool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION_STRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1
    });
    console.log('Successfully connected to the Oracle Database');
  } catch (err) {
    console.error('Error connecting to Oracle Database:', err.message);
    console.error('Please make sure your .env credentials are correct.');
  }
}

initDb();

// Helper to execute queries easily
async function executeQuery(query, binds = []) {
  let connection;
  try {
    connection = await connectionPool.getConnection();
    const result = await connection.execute(query, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

// API ROUTES

const normalizeKeys = (rows) => {
    // Oracle often returns uppercase column names. We convert them back to lower/snake casing expected by frontend
    return rows.map(row => {
        let newRow = {};
        for(let key in row) {
            newRow[key.toLowerCase()] = row[key];
        }
        return newRow;
    });
};

// 1. Get all Colleges
app.get('/api/colleges', async (req, res) => {
    try {
        const rows = await executeQuery('SELECT * FROM College');
        res.json(normalizeKeys(rows));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get all Departments
app.get('/api/departments', async (req, res) => {
    const query = `
        SELECT d.dept_id, d.department_name, d.contact_no, d.head_of_department, d.college_id, c.name AS college_name 
        FROM Department d 
        LEFT JOIN College c ON d.college_id = c.college_id
    `;
    try {
        const rows = await executeQuery(query);
        res.json(normalizeKeys(rows));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Get all Courses
app.get('/api/courses', async (req, res) => {
    const query = `
        SELECT c.course_no, c.course_title, c.year, c.dept_id, d.department_name 
        FROM Course c 
        LEFT JOIN Department d ON c.dept_id = d.dept_id
    `;
    try {
        const rows = await executeQuery(query);
        res.json(normalizeKeys(rows));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Get all Faculties
app.get('/api/faculties', async (req, res) => {
    const query = `
        SELECT f.faculty_id, f.name, f.designation, f.qualification, f.address, f.contact_no, f.college_id, c.name AS college_name 
        FROM Faculty f 
        LEFT JOIN College c ON f.college_id = c.college_id
    `;
    try {
        const rows = await executeQuery(query);
        res.json(normalizeKeys(rows));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Get all Students
app.get('/api/students', async (req, res) => {
    const query = `
        SELECT s.student_id, s.name, s.year, s.contact_no, s.address, s.dept_id, d.department_name 
        FROM Student s 
        LEFT JOIN Department d ON s.dept_id = d.dept_id
    `;
    try {
        const rows = await executeQuery(query);
        res.json(normalizeKeys(rows));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Get all Progress Reports
app.get('/api/reports', async (req, res) => {
    const query = `
        SELECT p.report_id, p.year, p.year AS pass_year, p.grade, p.rank, p.student_id, s.name AS student_name 
        FROM Progress_Report p 
        LEFT JOIN Student s ON p.student_id = s.student_id
    `;
    try {
        const rows = await executeQuery(query);
        res.json(normalizeKeys(rows));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==== GENERIC CRUD ENPOINTS ==== //

const entityConfig = {
    colleges: { table: 'College', pk: 'college_id' },
    departments: { table: 'Department', pk: 'dept_id' },
    courses: { table: 'Course', pk: 'course_no' },
    faculties: { table: 'Faculty', pk: 'faculty_id' },
    students: { table: 'Student', pk: 'student_id' },
    reports: { table: 'Progress_Report', pk: 'report_id' }
};

// CREATE
app.post('/api/:entity', async (req, res) => {
    const config = entityConfig[req.params.entity];
    if (!config) return res.status(404).json({ error: "Entity not found" });

    const payload = { ...req.body };
    delete payload[config.pk]; // Don't try to insert the PK manually
    delete payload['college_name']; // Ignore joined view columns
    delete payload['department_name'];
    delete payload['student_name'];
    delete payload['pass_year'];

    const keys = Object.keys(payload);
    const values = Object.values(payload);
    if (keys.length === 0) return res.status(400).json({ error: "Empty payload" });

    const bindStr = keys.map((_, i) => `:${i + 1}`).join(', ');
    const query = `INSERT INTO ${config.table} (${keys.join(', ')}) VALUES (${bindStr})`;

    let connection;
    try {
        connection = await connectionPool.getConnection();
        const result = await connection.execute(query, values, { autoCommit: true });
        res.status(201).json({ message: "Created successfully", rowsAffected: result.rowsAffected });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// UPDATE
app.put('/api/:entity/:id', async (req, res) => {
    const config = entityConfig[req.params.entity];
    if (!config) return res.status(404).json({ error: "Entity not found" });

    const payload = { ...req.body };
    delete payload[config.pk];
    delete payload['college_name'];
    delete payload['department_name'];
    delete payload['student_name'];
    delete payload['pass_year'];
    
    const keys = Object.keys(payload);
    const values = Object.values(payload);
    if (keys.length === 0) return res.status(400).json({ error: "Empty payload" });

    const setStr = keys.map((key, i) => `${key} = :${i + 1}`).join(', ');
    values.push(req.params.id);
    const query = `UPDATE ${config.table} SET ${setStr} WHERE ${config.pk} = :${values.length}`;

    let connection;
    try {
        connection = await connectionPool.getConnection();
        const result = await connection.execute(query, values, { autoCommit: true });
        res.json({ message: "Updated successfully", rowsAffected: result.rowsAffected });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// DELETE
app.delete('/api/:entity/:id', async (req, res) => {
    const config = entityConfig[req.params.entity];
    if (!config) return res.status(404).json({ error: "Entity not found" });

    const query = `DELETE FROM ${config.table} WHERE ${config.pk} = :1`;

    let connection;
    try {
        connection = await connectionPool.getConnection();
        const result = await connection.execute(query, [req.params.id], { autoCommit: true });
        res.json({ message: "Deleted successfully", rowsAffected: result.rowsAffected });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) await connection.close();
    }
});

// Fallback to index.html for unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running beautifully on http://localhost:${PORT}`);
});
