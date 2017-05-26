var express = require('express');
var body = require('body-parser');//Parses the body to the server as a JSON and converts it to an object.

var app = express();

//Takes URL and the callback parameter
app.post('/todos', (req, res) => {
    console.log(req.body);
});

app.listen(3000, () => {
    console.log('Started on port 3000');
})

