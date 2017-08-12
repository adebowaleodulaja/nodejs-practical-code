var mysql = require('promise-mysql');
var connection;
var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    var config = require('../server/config/config.json');
    var envConfig = config[env];//When you want to use a variable to access a property, you have to use a bracket notation like this.

    var dbConn = mysql.createConnection(process.env.JAWSDB_URL || {
        host: envConfig.host,
        user: envConfig.user,
        password: envConfig.password,
        database: envConfig.database
    }).then(function (conn) {
        return connection = conn;
        //console.log('Connection ID... ' + connection.threadId);
        //console.log(connection.query('SELECT COUNT(*) FROM users'));
    }).catch((error) => {
        console.log('Inside dbConnection.js, Unable to connect...' + error);
    });
    //console.log(Object.keys(envConfig));
} else {
   var dbConn = mysql.createConnection(process.env.JAWSDB_URL)
    .then(function (conn) {
        return connection = conn;
        //console.log('Connection ID... ' + connection.threadId);
        //console.log(connection.query('SELECT COUNT(*) FROM users'));
    }).catch((error) => {
        console.log('Inside dbConnection.js, Unable to connect...' + error);
    });
}

module.exports.dbConn = dbConn;

/* var config = require('../server/config/config.json');
var envConfig = config[env];
Object.keys(envConfig).forEach((key) => {//Object.keys takes an object, get all of its keys and return as an array.
    process.env[key] = envConfig[key];
});
console.log(envConfig.user); */
/* Object.keys(envConfig).forEach((key) => {//Object.keys takes an object, get all of its keys and return as an array.
    process.env[key] = envConfig[key];
}); */

/* var dbConn = mysql.createConnection(process.env.JAWSDB_URL || {
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
}); */