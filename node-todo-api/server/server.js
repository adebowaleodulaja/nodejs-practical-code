const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');//Parses the body to the server as a JSON and converts it to an object.
const validator = require('validator');

var connect = require('../utils/dbConnection');
const authToken = require('../utils/genAuthToken');
const { authenticate } = require('../middleware/authenticate');
const { loginUser } = require('../middleware/login');
const { logoutUser } = require('../middleware/logout');


var app = express();
var connection;
const port = process.env.PORT || 3000;
//var todos = {};

app.use(bodyParser.json());

//Takes URL and the callback parameter
app.post('/todos', authenticate, (req, res) => {
    //if (req.username !== ""){}
    var sqlString = `SELECT uname, token FROM users WHERE uname = '${req.username}' `;
    connect.dbConn.then(function (conn) {
        connection = conn;
        return conn.query(sqlString);
    }).then(function (rows) {
        var postData = { text: req.body.text, username: req.username };
        if (rows.length !== 0) {
            var insert = connection.query('INSERT INTO todos SET ?', postData);
            console.log('Data inserted...');
            return insert;
        } else {
            res.status(401).send({ message: 'You are not authenticated' });
        }
        // connection.end();
    }).then((rows) => {
        res.send({ message: 'Data has been inserted successfully' });
    }).catch((error) => {
        res.status(400).send(error);
        console.log('An error occurred...' + error);
        //connection.end();
    });
    console.log(req.body);
    //console.log(res.body.text);
});

//Get all todos
app.get('/todos', authenticate, (req, res) => {
    var sqlString = `SELECT uname, token FROM users WHERE uname = '${req.username}' `;
    connect.dbConn.then((conn) => {
        connection = conn;
        return conn.query(sqlString);
    }).then((rows) => {
        if (rows.length !== 0) {
            var selectTodo = connection.query(`SELECT * FROM todos WHERE username = '${req.username}'`);
            console.log('Iniside get todos, Data Found...');
            return selectTodo;
        } else {
            res.status(401).send({ message: 'You are not authenticated' });
        }
    }).then((rows) => {
        res.send({ todos: rows });
    }).catch((error) => {
        res.status(400).send(error);
        console.log('An error occurred...' + error);
        throw error;
        //connection.end();
    });
});

//Get specific todos
app.get('/todos/:id', authenticate, (req, res) => {
    //res.send(req.params);
    connect.dbConn.then((conn) => {
        connection = conn;
        var sqlString = `SELECT uname, token FROM users WHERE uname = '${req.username}' `;
        return conn.query(sqlString);
    }).then((rows) => {
        if (rows.length !== 0) {
            var sql = `SELECT * FROM todos WHERE id = ${connection.escape(req.params.id)} AND username = ${connection.escape(req.username)}`;
            var result = connection.query(sql);
            return result;
        }
    }).then((rows) => {
        if (rows.length !== 0) {
            res.send({ todos: rows });
        } else {
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

//Delete a todo
app.delete('/todos/:id', authenticate, (req, res) => {
    //res.send(req.params);
    connect.dbConn.then((conn) => {
        connection = conn;
        var sqlString = `SELECT uname, token FROM users WHERE uname = '${req.username}' `;
        return conn.query(sqlString);
    }).then((rows) => {
        if (rows.length !== 0) {
            var sql = `DELETE FROM todos WHERE id = ${connection.escape(req.params.id)} AND username = ${connection.escape(req.username)}`;
            var result = connection.query(sql);
            console.log(sql);
            return result;
        }
    }).then((rows) => {
        if (rows.length !== 0) {
            res.send({
                message: "Request Successful",
                result: rows.affectedRows + " row(s) was deleted!"
            });
        } else {
            res.status(404).send({
                message: "Request Failed",
                reason: "No such todo with id " + req.params.id
            });
        }
    }).catch((error) => {
        res.status(400).send(error);
        console.log('An error occurred...' + error);
        throw error;
    });
});

//Update a todo (Basically patch is used for UPDATE in a standard API dev)
app.patch('/todos/:id', (req, res) => {
    var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') // replace T with a space
    var theID = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);//Pick method from lodash is used to pull off certain keys from a json.

    connect.dbConn.then((conn) => {
        //Checking to see if body.completed value is boolean, if yes and it's set to true, update the completedAt.
        if (_.isBoolean(body.completed) && body.completed) {
            body.completedAt = date;//new Date().getTime();
        } else {
            body.completed = 'false';
            body.completedAt = null;
        }
        //var sql = `UPDATE todos SET completed = ?, completedAt = ? WHERE id = ? [${body.completed},${body.completedAt},${conn.escape(theID)}]`;
        //console.log(`SQL Query ${sql}`);
        return conn.query('UPDATE todos SET completed = ?, completedAt = ? WHERE id = ?', [body.completed.toString(), body.completedAt, theID]);
    }).then((rows) => {
        console.log(rows.affectedRows);
        if (rows.length != 0) {
            res.send({
                message: "Request Successful",
                result: rows.affectedRows + " row(s) was updated!"
            });
        }
        else {
            res.status(404).send({
                message: "Request Failed",
                reason: "No such todo with id " + req.params.id
            });
        }
    }).catch((error) => {
        res.status(400).send(error);
        console.log('An error occurred...' + error);
    });
});

//Takes URL and the callback parameter
app.post('/newuser', (req, res) => {
    var atoken = authToken.generateAuthToken(req.body.username);
    var hash = authToken.hashPassword(req.body.password);
    var postData = {
        uname: req.body.username, upassword: hash,
        uage: req.body.age, location: req.body.location,
        token: atoken, access: 'auth'
    };

    connect.dbConn.then(function (conn) {
        connection = conn;
        console.log('Post Data', hash);
        if (validator.isEmail(req.body.username)) {
            return conn.query('INSERT INTO users SET ?', postData);
        } else {
            return res.send({ message: `${req.body.username} is not a valid email address!` });
        }
    }).then(function (rows) {
        res.header('x-auth', atoken).send({ message: `New user ${req.body.username} has been created successfully` });
        //res.header('x-auth', atoken);
        console.log('New user inserted...');
        console.log(rows);
    }).catch((error) => {
        if (error) { return res.status(400).send(error); }
        console.log('An error occurred...' + error);
    });
    console.log("body_request", req.body);
});

//Route to login users
app.post('/api/users/login', loginUser);

//Logout Route
app.delete('/api/users/logout', logoutUser);

/* app.post('/api/users/log', (req, res) => {
    var body = _.pick(req.body, ['username', 'password']);

    res.send(body);
}); */

//API route to verify authentication per user.
app.get('/users/me', authenticate, (req, res) => {
    res.send({ "username": req.username });
});

app.listen(port, () => {
    console.log(`Started on port: ${port}`);
});

module.exports = { app };