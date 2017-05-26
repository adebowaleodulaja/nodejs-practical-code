var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'passw0rd',
    database: 'todoapi'
});

connection.connect();

connection.query('SELECT * FROM t_users', (error, results, fields) => {
    if (error) {
        console.log(`An error occured ${error}`);
    }
    else{
        console.log('Rows returned: '+results[0]._name);
    }
})

/*connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});*/

connection.end();