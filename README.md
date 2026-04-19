# University Management System (UMS)

A modern, full-stack Data Management Dashboard built to seamlessly operate on top of an **Oracle Cloud FreeSQL Database**. It features a beautiful, dynamic local UI capable of administering complex relational data via direct CRUD (Create, Read, Update, Delete) algorithms straight into Oracle.

## 🚀 Features
- **Dynamic CRUD UI:** Effortlessly add, update, and delete massive entities like Colleges, Departments, Courses, Faculty, and Students using dynamically generated modal forms.
- **Thick Mode Architecture:** Implements `node-oracledb` Thick Mode configuration to ensure highly secure, enterprise-grade database bindings with Oracle Instant Client.
- **Relational Integrity Built-in:** Safely cascades updates, intelligently manages auto-generated Identity fields, and efficiently queries relations using LEFT JOINS to avoid displaying fragmented data.
- **Premium Glassmorphism Aesthetic:** Responsive CSS design equipped with clean data tables, interactive animated form actions, and an effortless Admin Interface.

## 🛠️ Technologies Used
- **Frontend Core** - HTML5, Built-in CSS3, and precise Vanilla JavaScript mappings.
- **Backend API** - Node.js, Express.js for REST endpoints.
- **Database Architecture** - Oracle Database 23ai (Cloud FreeSQL Platform).

## ⚙️ How to Run Locally Configuration
1. Clone the repository locally.
2. Run `npm install` inside the project to initialize the necessary dependencies (like `express`, `cors`, `dotenv`, and `oracledb`).
3. Ensure you have the `Oracle Instant Client` installed on your machine.
4. Setup a strict `.env` file with your direct Oracle routing: `DB_CONNECTION_STRING`, `DB_USER`, and `DB_PASSWORD`.
5. Run `node server.js` to establish the API handshake and spin up the database mapping.
6. Open your browser and navigate to `http://localhost:3000` to interact with the Dashboard!
