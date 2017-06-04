var mysql = require('promise-mysql');
var connection;

mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'todoapp'
}).then(function (conn) {
    connection = conn;
    //console.log('Connection ID... ' + connection.Connection.threadId);
    return conn.query('select * from users');
}).then((rows) => {
    for (var i in rows) {
        console.log('List...' + rows[i].uname);
    }
    connection.end();
}).catch((error) => {
    console.log('Unable to connect...' + error);
    connection.end();
});