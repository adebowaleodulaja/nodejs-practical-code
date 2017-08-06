const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var generateAuthToken = function (username) {
    var access = 'auth';
    var token = jwt.sign({ username, access }, 'abc123').toString();
    //console.log(token);

    return token;
};

var verifyAuthToken = function (tokenToVerify) {
    return jwt.verify(tokenToVerify, 'abc123');
};

var hashPassword = function (yourPassword) {
    var salt = bcrypt.genSaltSync(12);
    var hash = bcrypt.hashSync(yourPassword, salt);
    return hash;
    /*bcrypt.genSalt(12, (error, salt) => {
        bcrypt.hash(yourPassword, salt, (err, hash) => {
            //console.log(`Inside genAuthToken.js, hashed value is ${hash}`);
        });
    });*/
};

var comparePassword = (yourPassword, hashed) => {
    var proceed = bcrypt.compare(yourPassword, hashed).toString();
    /*bcrypt.compare(yourPassword, hashed).then((res) => {
        console.log('Inside genAuthToken.comparePassword: ', res);
        if (res) {
            proceed = 'Yes';
        }
    });*/
    console.log('Inside genAuthToken.comparePassword: ', proceed);
    return proceed;
};

//module.exports.generateAuthToken = generateAuthToken;
module.exports = { comparePassword, hashPassword, generateAuthToken, verifyAuthToken };
//generateAuthToken('Adebowale');