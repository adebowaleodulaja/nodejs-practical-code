var express = require('express');
var bodyParser = require('body-parser');//Parses the body to the server as a JSON and converts it to an object.

var connect = require('../utils/dbConnection');

var app = express();
var connection;

app.use(bodyParser.json());

//Takes URL and the callback parameter
app.post('/todos', (req, res) => {
    var postData = { text: req.body.text };
    connect.dbConn.then(function (conn) {
        connection = conn;
        return conn.query('INSERT INTO todos SET ?', postData);
    }).then(function (rows) {
        res.send({ message: 'Data has been inserted successfully' });
        console.log('Data inserted...');
        console.log(rows);
       // connection.end();
    }).catch((error) => {
        res.status(400).send(error);
        console.log('An error occurred...' + error);
        //connection.end();
    });
    console.log(req.body);
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};