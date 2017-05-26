var con = require('./connectionDB');
var connection;

con.theConn.then(function (con) {
    connection = con;
    //console.log(con);
    var post = {_name: 'James Goslin', _sex: 'Female', _location: 'Miton Keynes'};
    return con.query('INSERT INTO t_users SET ?', post);
}).then(function (rows) {
    console.log('Data inserted...');
    console.log(rows);
    connection.end();
}).catch((error) => {
    console.log('Unable to connect...' + error);
});