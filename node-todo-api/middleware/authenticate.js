const connect = require('../utils/dbConnection');
//const jwt = require('jsonwebtoken');
const { verifyAuthToken } = require('../utils/genAuthToken');

/*var verifyAuthToken = function (tokenToVerify) {
    return jwt.verify(tokenToVerify, 'abc123');
};*/

var authenticate = function (req, res, next) {
    var token = req.header('x-auth');
    var decoded;

    try {
        decoded = verifyAuthToken(token);
        //var decoded = jwt.verify(token, 'abc123');
        console.log('Inside authenticate, Decoded value is: ', decoded);
    } catch (error) {

    }

    connect.dbConn.then((conn) => {
        //var sql = `SELECT * FROM users WHERE token = ${conn.escape(token)} AND uname = ${conn.escape(decoded.username)}`;
        var sql = `SELECT * FROM users WHERE uname = ${conn.escape(decoded.username)}`;
        return conn.query(sql);
    }).then((rows) => {
        if (rows.length != 0) {
            //res.send({ todos: rows });
            req.token = token;
            req.username = decoded.username;
            next();
        }
        else {
            res.status(401).send({
                message: "Request failed",
                reason: "No such token associated to a user "
            });
        }
    }).catch((error) => {
        res.status(400).send(error);
        console.log('Inside authenticate.js, An error occurred...' + error);
    });
};

module.exports = { authenticate };