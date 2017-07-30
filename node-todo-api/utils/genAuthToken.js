const jwt = require('jsonwebtoken');

exports.generateAuthToken = function (username) {
    var access = 'auth';
    var token = jwt.sign({ username, access }, 'abc123').toString();
    //console.log(token);

    return token;
};

exports.verifyAuthToken = function (tokenToVerify) {
    return jwt.verify(tokenToVerify, 'abc123');
};

//module.exports.generateAuthToken = generateAuthToken;
//module.exports = {verifyAuthToken};
//generateAuthToken('Adebowale');