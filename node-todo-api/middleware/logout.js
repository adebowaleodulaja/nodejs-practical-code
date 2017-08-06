
const connect = require('../utils/dbConnection');

var logoutUser = (req, res) => {
    connect.dbConn.then((conn) => {
        //console.log(`SQL String ${sql}`);
        return conn.query('UPDATE users SET token = ?, access = ? WHERE token = ?', ['', '', req.get('x-auth'), ]);
    }).then((rows) => {
        console.log(rows.affectedRows+' row(s) affected');
        res.status(200).send();
    }).catch((error) => {
        res.status(400).send(error);
        console.log('An error occurred in login.js...' + error);
    });
}

module.exports = { logoutUser };