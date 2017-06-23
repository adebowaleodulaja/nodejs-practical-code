var express = require('express');
var bodyParser = require('body-parser');//Parses the body to the server as a JSON and converts it to an object.

var connect = require('../utils/dbConnection');

var app = express();
var connection;
const port = process.env.PORT || 3000;
//var todos = {};

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
    //console.log(res.body.text);
});

//Get all todos
app.get('/todos', (req, res) => {
    connect.dbConn.then((conn) => {
        return conn.query('SELECT * FROM todos');
    }).then((rows) => {
        /*for (var i in rows) {
            //res.json(rows);
            //todos = {id: rows[i].id, text: rows[i].text, completed: rows[i].completed, completedAt: rows[i].completedAt};
        }*/
        res.send({ todos: rows });
        //res.send({id: rows[i].id, text: rows[i].text, completed: rows[i].completed, completedAt: rows[i].completedAt});
    }).catch((error) => {
        res.status(400).send(error);
        console.log('An error occurred...' + error);
        //connection.end();
    });
});

//Get specific todos
app.get('/todos/:id', (req, res) => {
    //res.send(req.params);
    connect.dbConn.then((conn) => {
        var sql = `SELECT * FROM todos WHERE id = ${conn.escape(req.params.id)}`;
        //console.log(`SQL String ${sql}`);
        return conn.query(sql);
    }).then((rows) => {
        if (rows.length != 0) {
            res.send({ todos: rows });
        }
        else {
            res.status(404).send({
                message: "Request failed",
                reason: "No such todo with id " + req.params.id
            });
        }
    }).catch((error) => {
        res.status(400).send(error);
        console.log('An error occurred...' + error);
        //connection.end();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = { app };