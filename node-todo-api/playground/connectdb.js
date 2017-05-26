var mysql = require('promise-mysql');
var connection;

mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'passw0rd',
    database: 'todoapi'
}).then(function (conn) {
    connection = conn;
    //console.log('Connection ID... ' + connection.Connection.threadId);
    return conn.query('select * from t_users');
}).then(function (rows) {
    for (var i in rows) {
        console.log('List...' + rows[i]._name);
    }
    connection.end();
}).catch((error) => {
    console.log('Unable to connect...' + error);
    connection.end();
});