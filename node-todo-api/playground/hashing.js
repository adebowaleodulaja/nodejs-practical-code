//require crypto-js
const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {//The data we want to send
    id: 5
};

var token = jwt.sign(data, '123abc'); //takes the data and signs it by taking the hash and signs it and returns the token value.
console.log(token);
var decoded = jwt.verify(token, '123abc'); //verify basically verifies the signed data to be sure it wasn't manipulated
console.log('decoded', decoded);

//Below code is a way to make hashing manually (Using crypto-js) without a library
/*let message = 'I am user number 1';
var hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

//testing a proper hashing and salt
var data = {//The data we want to send
    id: 4
};

//Using token would allow us to get the actuall data and hash it
var token = {
    data: data,
    hash: SHA256(JSON.stringify(data) + 'saltvalue').toString() //Adding a salt value would make our token full-prove
};

// token.data.id = 3;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

//To be sure the token was not manipulated, we'd create a variable that'd hold the hash result.
var hashResult = SHA256(JSON.stringify(token.data) + 'saltvalue').toString();
if (hashResult === token.hash) {
    console.log('Data was not changed.');
} else {
    console.log('Data was changed, do not trust');
}*/