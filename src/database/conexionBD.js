const mysql = require('mysql2/promise');
const config = require('../config');

const conexion = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

module.exports = conexion;