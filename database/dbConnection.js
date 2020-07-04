require('dotenv').config();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.User,
    password: process.env.Password,
    database: process.env.Database
});

connection.connect(function (err) {
    if (err) {
        console.log('Error connecting to Database',err);
        return;
    }
    console.log('Connection established');
});
module.exports = connection;

