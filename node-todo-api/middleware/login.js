const connect = require('../utils/dbConnection');
const bcrypt = require('bcryptjs');
const authToken = require('../utils/genAuthToken');
//const hashing = require('../utils/genAuthToken');

var loginUser = function (req, res) {
    //var hashPassword = hashing.hashPassword(req.body.password);

    connect.dbConn.then((conn) => {
        var sql = `SELECT uname, upassword FROM users WHERE uname = ${conn.escape(req.body.username)}`;
        //console.log(`SQL String ${sql}`);
        return conn.query(sql);
    }).then((rows) => {
        if (rows.length != 0) {
            bcrypt.compare(req.body.password, rows[0].upassword, (err, x) => {
                if (x) {
                    var atoken = authToken.generateAuthToken(req.body.username);
                    res.header('x-auth', atoken).send(rows);
                }else {
                    res.send({status: "Password does not match!"})
                }
            });
        }
        else {
            res.status(404).send({
                message:
                {
                    status: "Request failed",
                    reason: "Invalid username and/or password"
                }
            });
        }
    }).catch((error) => {
        res.status(400).send(error);
        console.log('An error occurred in login.js...' + error);
    });
}

module.exports = { loginUser };