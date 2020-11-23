var http = require('http');

var app = require('./app');

var port = 3000; //tao port ket noi server

var server = http.createServer(app); //tao server chay app.js

server.listen(port);