var express = require('express');
var app = express();

app.use('/client', express.static(__dirname + '/client'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.listen((process.env.PORT || 3000), function() {
    console.log('Server started');
});