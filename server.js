const express = require('express');
const mysql = require('mysql2');
const PORT = 3001; 

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

// CONNECT OT THE LOCAL DATABASE
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Sagenthave07',
        database:  ''
    },
    console.log(`Connect to the database`)
)


app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON POST ${PORT}`)
});