const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../server/config/config.json');

var env = process.env.NODE_ENV || 'development';
var envConfig = config[env];
var generateAuthToken = function (username) {
    if (env === 'development' || env === 'test') {
        var access = 'auth';
        var token = jwt.sign({ username, access }, envConfig.JWT_SECRET).toString();
        //console.log("The token ", envConfig.JWT_SECRET);
    } else {
        var access = 'auth';
        var token = jwt.sign({ username, access }, process.env.JWT_SECRET).toString();
        //console.log("The token ", process.env.JWT_SECRET);
    }

    return token;
};

var verifyAuthToken = function (tokenToVerify) {
    var jwtValue;
    if(env === 'development' || env === 'test'){
        jwtValue = jwt.verify(tokenToVerify, envConfig.JWT_SECRET);
    }else{
        jwtValue = jwt.verify(tokenToVerify, process.env.JWT_SECRET)
    }
    return jwtValue;
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