const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.DB_PORT || 3001;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname));

app.post('/api/transactions', async (req, res) => {
    const { type, amount, description, date } = req.body;

    if (!type || !amount || !description || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting MySQL connection from pool:', err);
                return res.status(500).json({ error: 'Failed to add transaction' });
            }

            connection.query('INSERT INTO transactions (type, amount, description, date) VALUES (?, ?, ?, ?)',
                [type, amount, description, date],
                (err, result) => {
                    connection.release();

                    if (err) {
                        console.error('Error executing query:', err);
                        return res.status(500).json({ error: 'Failed to add transaction' });
                    }

                    const insertedId = result.insertId;
                    if (insertedId) {
                        const insertedTransaction = { id: insertedId, type, amount, description, date };
                        return res.status(201).json(insertedTransaction);
                    } else {
                        return res.status(500).json({ error: 'Failed to insert transaction' });
                    }
                });
        });
    } catch (err) {
        console.error('Error inserting transaction:', err);
        res.status(500).json({ error: 'Failed to add transaction' });
    }
});

app.delete('/api/transactions/:id', async (req, res) => {
    const transactionId = req.params.id;

    try {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting MySQL connection from pool:', err);
                return res.status(500).json({ error: 'Failed to delete transaction' });
            }

            connection.query('DELETE FROM transactions WHERE id = ?',
                [transactionId],
                (err, result) => {
                    connection.release();

                    if (err) {
                        console.error('Error executing query:', err);
                        return res.status(500).json({ error: 'Failed to delete transaction' });
                    }

                    if (result.affectedRows > 0) {
                        res.status(200).json({ message: 'Transaction deleted successfully' });
                    } else {
                        res.status(404).json({ error: 'Transaction not found' });
                    }
                });
        });
    } catch (err) {
        console.error('Error deleting transaction:', err);
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
});

app.get('/api/transactions', async (req, res) => {
    try {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting MySQL connection from pool:', err);
                return res.status(500).json({ error: 'Failed to fetch transactions' });
            }

            connection.query('SELECT * FROM transactions', (err, results) => {
                connection.release();

                if (err) {
                    console.error('Error executing query:', err);
                    return res.status(500).json({ error: 'Failed to fetch transactions' });
                }

                res.status(200).json(results);
            });
        });
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// displaying the index.html page when sever starts
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
