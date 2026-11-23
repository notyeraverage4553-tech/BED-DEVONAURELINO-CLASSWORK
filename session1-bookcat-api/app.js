const express = require('express');
const sql = require('mssql');
const app = express();

app.use(express.json());

const dbConfig = {
    server: 'localhost',
    database: 'NPbookstore',
    user: 'PLACEHOLDER',
    password: 'PLACEHOLDER',
    options: { trustServerCertificate: true }
};

app.get('/', (req, res) => {
    res.send('Welcome to the Book Category API');
    });

app.get('/categories', (req, res) => {
res.json([
{ id: 1, name: 'Fiction' },
{ id: 2, name: 'Non-Fiction' },
{ id: 3, name: 'Biography' }
    ]);
});


app.get('/publishers', async (req, res) => {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const request = connection.request();
        const result = await request.query('SELECT PublisherID, Name FROM Publisher');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) await connection.close();
    }
});


app.get('/publishers/:id', async (req, res) => {
    const publisherId = parseInt(req.params.id);
    if (isNaN(publisherId)) {
        return res.status(400).json({ error: 'Invalid id' });
    }
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const request = connection.request();
        request.input('id', publisherId);
        const result = await request.query(
            'SELECT PublisherID, Name FROM Publisher WHERE PublisherID = @id'
        );
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) await connection.close();
    }
});

app.post('/publishers', async (req, res) => {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const request = connection.request();
        request.input('id', req.body.id);
        request.input('name', req.body.name);
        const result = await request.query(
            `INSERT INTO Publisher (PublisherID, Name)
             OUTPUT INSERTED.*
             VALUES (@id, @name)`
        );
        res.status(201).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) await connection.close();
    }
});

app.put('/publishers/:id', async (req, res) => {
    const publisherId = parseInt(req.params.id);
    if (isNaN(publisherId)) {
        return res.status(400).json({ error: 'Invalid id' });
    }
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const request = connection.request();
        request.input('id', publisherId);
        request.input('name', req.body.name);
        const result = await request.query(
            'UPDATE Publisher SET Name = @name WHERE PublisherID = @id'
        );
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.status(200).json({ updated: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) await connection.close();
    }
});

app.delete('/publishers/:id', async (req, res) => {
    const publisherId = parseInt(req.params.id);
    if (isNaN(publisherId)) {
        return res.status(400).json({ error: 'Invalid id' });
    }
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const request = connection.request();
        request.input('id', publisherId);
        const result = await request.query(
            'DELETE FROM Publisher WHERE PublisherID = @id'
        );
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) await connection.close();
    }
});


app.listen(3000, () => {
    console.log('Listening on port 3000');
    });