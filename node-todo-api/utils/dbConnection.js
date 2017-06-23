var mysql = require('promise-mysql');
var connection;

var dbConn = mysql.createConnection(process.env.JAWSDB_URL || {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'todoapp'
}).then(function (conn) {
    return connection = conn;
    //console.log('Connection ID... ' + connection.threadId);
    //return connection.query('select * from t_users');
}).catch((error) => {
    console.log('Unable to connect...' + error);
});

module.exports.dbConn = dbConn;