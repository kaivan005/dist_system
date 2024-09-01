const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'drug_inv'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Fetch all drugs
app.get('/drugs', (req, res) => {
    const query = 'SELECT id, name, quantity_available, low_stock_amount, last_restocked, vendor FROM drugs';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add a new drug
app.post('/drugs', (req, res) => {
    const { name, quantity_available, low_stock_amount, last_restocked, vendor } = req.body;
    const query = 'INSERT INTO drugs (name, quantity_available, low_stock_amount, last_restocked, vendor) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, quantity_available, low_stock_amount, last_restocked, vendor], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Drug added successfully!', id: result.insertId });
    });
});

// Update a drug
app.put('/drugs/:id', (req, res) => {
    const { id } = req.params;
    const { name, quantity_available, low_stock_amount, last_restocked, vendor } = req.body;
    const query = 'UPDATE drugs SET name = ?, quantity_available = ?, low_stock_amount = ?, last_restocked = ?, vendor = ? WHERE id = ?';
    db.query(query, [name, quantity_available, low_stock_amount, last_restocked, vendor, id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Drug updated successfully!' });
    });
});

// Delete a drug
app.delete('/drugs/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM drugs WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Drug deleted successfully!' });
    });
});

// Register Endpoint
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    
    // Check if the email already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = bcrypt.hashSync(password, 8);
        db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
            [username, email, hashedPassword], 
            (err, result) => {
                if (err) throw err;
                res.json({ message: 'User registered successfully!' });
            }
        );
    });
});

// Login Endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) throw err;
        
        if (results.length > 0) {
            const user = results[0];
            const isValidPassword = bcrypt.compareSync(password, user.password);
            
            if (isValidPassword) {
                const token = jwt.sign(
                    { id: user.id, username: user.username, email: user.email },
                    process.env.JWT_SECRET || 'your_jwt_secret', 
                    { expiresIn: '1h' }
                );
                res.json({ token, username: user.username });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
});


SELECT * FROM drugs;
SELECT * FROM hospital;
SELECT * FROM orders;
SELECT * FROM patients;
SELECT * FROM supplier;
SELECT * FROM user;

SHOW COLUMNS FROM
SHOW COLUMNS FROM
SHOW COLUMNS FROM
SHOW COLUMNS FROM
SHOW COLUMNS FROM
SHOW COLUMNS FROM