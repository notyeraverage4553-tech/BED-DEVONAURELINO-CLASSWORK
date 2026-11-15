const express = require('express');
const sql = require('mssql'); // new line
const app = express();

const dbConfig = { 
    user: 'PLACEHOLDER',
    password: 'PLACEHOLDER',
    server: 'localhost',
    database: 'NPBookstore',
    options: { trustServerCertificate: true}
};



app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/categories', (req, res) => {
    res.json([
        {id: 1, name: 'Fiction'},
        {id: 2, name: 'Non-Fiction'},
        {id: 3, name: 'Biography'}
    ]);
});

app.get('/about', (req, res) => {
    res.send("Hello, I'm Devon fron IT04!");
   
});

app.get('/db-test'
, async (req, res) => {
    try {
    const pool = await sql.connect ({
    server: 'localhost',
    port: 1433,
    database: 'NPBookstore',
    user: 'PLACEHOLDER',
    password: 'PLACEHOLDER',
    options: { trustServerCertificate: true },
    });

const result = await pool.request()
    .query('SELECT COUNT(*) AS Total FROM Author');
    await pool.close();
    res.json({ connected: true, authors: result.recordset[0].Total });
} catch (err) {
    res.status(500).json({ connected: false, error: err.message });
}
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

