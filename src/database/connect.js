const mysql = require('mysql');

// creating a connection to mysql
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: 'root',
    password: '',
    database: 'astics'
});

module.exports = connection;